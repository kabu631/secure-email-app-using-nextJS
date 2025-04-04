import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { generateRSAKeyPair, encryptPrivateKey } from '@/lib/encryption/rsa';
import { NextAuthOptions } from 'next-auth';

// Mock database for demo purposes (in a real app, use a proper database)
export const users = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    password: bcrypt.hashSync('secure123', 10), // Hashed password
    publicKey: '',
    privateKey: ''
  },
  {
    id: '2',
    name: 'User One',
    email: 'user1@example.com',
    password: bcrypt.hashSync('secure123', 10), // Same password for simplicity
    publicKey: '',
    privateKey: ''
  },
  {
    id: '3',
    name: 'User Two',
    email: 'user2@example.com',
    password: bcrypt.hashSync('secure123', 10), // Same password for simplicity
    publicKey: '',
    privateKey: ''
  },
  {
    id: '4',
    name: 'Test User 1',
    email: 'test1@example.com',
    password: bcrypt.hashSync('secure123', 10), // Same password for simplicity
    publicKey: '',
    privateKey: ''
  },
  {
    id: '5',
    name: 'Test User 2',
    email: 'test2@example.com',
    password: bcrypt.hashSync('secure123', 10), // Same password for simplicity
    publicKey: '',
    privateKey: ''
  }
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user by email
        const user = users.find(user => user.email === credentials.email);
        
        if (!user) {
          return null;
        }

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        
        if (!isValid) {
          return null;
        }

        // Generate keys if they don't exist
        if (!user.publicKey || !user.privateKey) {
          const keyPair = generateRSAKeyPair();
          
          // In a real app, store the encrypted private key in the database
          const encryptedPrivateKey = encryptPrivateKey(keyPair.privateKey, credentials.password);
          
          user.publicKey = keyPair.publicKey;
          user.privateKey = encryptedPrivateKey;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          publicKey: user.publicKey
        };
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || "INSECURE_SECRET_FOR_DEV_ONLY",
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.publicKey = user.publicKey;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.publicKey = token.publicKey as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
}; 