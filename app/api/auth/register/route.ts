import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { loginWithJWT } from '@/lib/auth';
import { hash } from 'bcrypt-ts';
import crypto from 'crypto';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json({ error: 'Password must include uppercase letter and number' }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection('users');

    const existingUser = await users.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);
    const userId = crypto.randomUUID();

    await users.insertOne({
      _id: userId as unknown as import('mongodb').ObjectId,
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash,
      createdAt: new Date(),
      streaks: 0,
    });

    const userPayload = { id: userId, name: name.trim(), email: email.toLowerCase() };
    await loginWithJWT(userPayload);

    return NextResponse.json({ success: true, user: userPayload });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
