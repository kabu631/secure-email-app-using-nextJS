export interface User {
  id: string;
  email: string;
  name?: string;
  password: string; // Will be hashed
  publicKey?: string;
  privateKey?: string; // Will be encrypted before storage
}

export interface Email {
  id: string;
  from: string;
  to: string[];
  cc?: string[]; // Add CC field for carbon copy recipients
  subject: string;
  body: string;
  attachments?: Attachment[];
  isEncrypted: boolean;
  date: Date;
  read: boolean;
  deleted: boolean;
  folder: EmailFolder;
}

export interface Attachment {
  id: string;
  filename: string;
  content: string; // Base64 encoded
  contentType: string;
  size: number;
}

export enum EmailFolder {
  INBOX = "inbox",
  SENT = "sent",
  DRAFT = "draft",
  TRASH = "trash",
  SPAM = "spam"
}

export interface IMAPConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  tls: boolean;
}

export interface SMTPConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  secure: boolean;
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export interface EncryptionResult {
  encryptedData: string;
  iv: string; // Initialization vector for AES
}

export interface DecryptionResult {
  decryptedData: string;
} 