import { NextResponse } from 'next/server';
import { users } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { generateRSAKeyPair, encryptPrivateKey } from '@/lib/encryption/rsa';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const userExists = users.some(user => user.email === email);
    if (userExists) {
      return NextResponse.json(
        { success: false, error: 'Email already in use' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate keys
    const keyPair = generateRSAKeyPair();
    const encryptedPrivateKey = encryptPrivateKey(keyPair.privateKey, password);

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      password: hashedPassword,
      publicKey: keyPair.publicKey,
      privateKey: encryptedPrivateKey
    };

    // Add to users array
    users.push(newUser);

    return NextResponse.json(
      { success: true, message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 