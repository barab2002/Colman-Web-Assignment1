import { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import { config } from '../config/env';

export async function mongoHealth(_req: Request, res: Response) {
  const baseUri = process.env.MONGO_URI || config.MONGO_URI || 'mongodb://localhost:27017';

  let uri = baseUri;
  // If explicit user/pass provided and not already embedded in URI, inject them
  if (config.MONGO_USER && config.MONGO_PASS && !/^[^@]+@/.test(baseUri.replace(/^mongodb(?:\+srv)?:\/\//, ''))) {
    uri = baseUri.replace(/^(mongodb(?:\+srv)?:\/\/)(.*)$/, `$1${encodeURIComponent(config.MONGO_USER)}:${encodeURIComponent(config.MONGO_PASS)}@$2`);
  }

  const tryConnect = async (candidateUri: string) => {
    const client = new MongoClient(candidateUri, { serverSelectionTimeoutMS: 3000 });
    try {
      await client.connect();
      await client.db('admin').admin().ping();
      return { ok: true, client };
    } catch (err: any) {
      try { await client.close(); } catch {};
      return { ok: false, error: err };
    }
  };

  // First attempt
  let first = await tryConnect(uri);
  // If auth failed and we have credentials, try again forcing authSource=admin
  if (!first.ok && /auth|authentication/i.test(String(first.error?.message || '')) && config.MONGO_USER && config.MONGO_PASS) {
    let fallback = uri;
    if (!/authSource=/i.test(fallback)) {
      fallback = fallback + (fallback.includes('?') ? '&' : '?') + 'authSource=admin';
    }
    first = await tryConnect(fallback);
  }

  const safeConfig = {
    MONGO_URI: String(process.env.MONGO_URI || config.MONGO_URI).replace(/:(?:[^:@]+)@/, ':<redacted>@'),
    MONGO_DB: config.MONGO_DB,
    MONGO_USER: config.MONGO_USER || undefined,
    hasPassword: !!config.MONGO_PASS,
  };

  if (first && first.ok && first.client) {
    try { await first.client.close(); } catch {};
    return res.json({ ok: true, uriUsed: 'ok', config: safeConfig });
  }

  const err = first && (first.error || new Error('unknown'));
  return res.status(503).json({ ok: false, error: String((err as any)?.message ?? err), config: safeConfig });
}
