import { NextResponse } from 'next/server';
import { logoutWithJWT } from '@/lib/auth';

export async function POST() {
  await logoutWithJWT();
  return NextResponse.json({ success: true });
}
