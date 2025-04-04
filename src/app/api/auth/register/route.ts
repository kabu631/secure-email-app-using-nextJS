import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Import the users array from auth.ts
// In a real application, this would be a database interaction
import { users } from '@/lib/auth';

// Define validation schema for registration
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const result = registerSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { name, email, password } = result.data;
    
    // Check if user already exists
    const userExists = users.some(user => user.email === email);
    
    if (userExists) {
      return NextResponse.json(
        { error: 'Email is already registered' },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = {
      id: `${users.length + 1}`,
      name,
      email,
      password: hashedPassword,
      publicKey: '',
      privateKey: '',
    };
    
    // Add user to the array
    users.push(newUser);
    
    // In a real application, you would save to database here
    console.log(`New user registered: ${email}`);
    
    // Return success without exposing sensitive data
    return NextResponse.json(
      { 
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
} 