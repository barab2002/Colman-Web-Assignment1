import getRepositories from '../dal/index';
import bcrypt from 'bcryptjs';
import { User } from '../dal/models';

const { userRepo } = getRepositories();

export async function createUser(data: { username: string; email: string; password: string }): Promise<User> {
  const existing = await userRepo.getByUsername(data.username);
  if (existing) throw new Error('username_taken');
  const emailExists = await userRepo.getByEmail(data.email);
  if (emailExists) throw new Error('email_taken');
  const passwordHash = await bcrypt.hash(data.password, 8);
  const created = await userRepo.create({ username: data.username, email: data.email, passwordHash });
  return created as User;
}

export async function getUserById(id: string): Promise<User | null> {
  return userRepo.getById(id);
}

export async function getAllUsers(): Promise<User[]> {
  return userRepo.getAll();
}

export async function updateUser(id: string, data: Partial<User & { password?: string }>): Promise<User | null> {
  const updateData: any = { ...data };
  if ((data as any).password) {
    updateData.passwordHash = await bcrypt.hash((data as any).password, 8);
  }
  return userRepo.update(id, updateData);
}

export async function deleteUser(id: string): Promise<boolean> {
  return userRepo.delete(id);
}
