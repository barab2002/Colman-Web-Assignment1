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

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 3000 });
  try {
    await client.connect();
    // run a ping
    await client.db().admin().ping();
    const safeConfig = {
      MONGO_URI: String(process.env.MONGO_URI || config.MONGO_URI).replace(/:(?:[^:@]+)@/, ':<redacted>@'),
      MONGO_DB: config.MONGO_DB,
      MONGO_USER: config.MONGO_USER || undefined,
      hasPassword: !!config.MONGO_PASS,
    };

    res.json({ ok: true, uriUsed: uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://') ? 'ok' : 'constructed', config: safeConfig });
  } catch (err: any) {
    const safeConfig = {
      MONGO_URI: String(process.env.MONGO_URI || config.MONGO_URI).replace(/:(?:[^:@]+)@/, ':<redacted>@'),
      MONGO_DB: config.MONGO_DB,
      MONGO_USER: config.MONGO_USER || undefined,
      hasPassword: !!config.MONGO_PASS,
    };
    res.status(503).json({ ok: false, error: String(err.message ?? err), config: safeConfig });
  } finally {
    try { await client.close(); } catch {};
  }
}
