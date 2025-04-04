import CryptoJS from 'crypto-js';
import { EncryptionResult, DecryptionResult } from '@/types';

// Generate a random key for AES encryption
export function generateAESKey(): string {
  return CryptoJS.lib.WordArray.random(256 / 8).toString();
}

// Generate a random IV (Initialization Vector)
export function generateIV(): string {
  return CryptoJS.lib.WordArray.random(128 / 8).toString();
}

// Encrypt data using AES
export function aesEncrypt(plaintext: string, key: string): EncryptionResult {
  const iv = generateIV();
  const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  return {
    encryptedData: encrypted.toString(),
    iv
  };
}

// Decrypt data using AES
export function aesDecrypt(ciphertext: string, key: string, iv: string): DecryptionResult {
  const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  return {
    decryptedData: decrypted.toString(CryptoJS.enc.Utf8)
  };
}

// Encrypt email content (body and attachments)
export function encryptEmailContent(content: string, recipientPublicKey: string): EncryptionResult {
  // In a real app, we would:
  // 1. Generate a random AES key
  // 2. Encrypt the content with the AES key
  // 3. Encrypt the AES key with the recipient's public key (RSA)
  // 4. Send both the encrypted content and encrypted AES key
  
  // For demo, we'll use a simplified approach
  const aesKey = generateAESKey();
  const result = aesEncrypt(content, aesKey);
  
  // In a real app, we would encrypt the AES key with RSA here
  
  return result;
}

// Digital signature function (simplified)
export function createDigitalSignature(message: string, privateKey: string): string {
  // In a real app, this would use RSA or ECDSA for digital signatures
  // For demo, we'll use HMAC as a simplified signature
  return CryptoJS.HmacSHA256(message, privateKey).toString();
}

// Verify digital signature
export function verifyDigitalSignature(
  message: string, 
  signature: string, 
  publicKey: string
): boolean {
  // In a real app, this would verify the RSA/ECDSA signature
  // For demo, we'll use HMAC verification
  const computedSignature = CryptoJS.HmacSHA256(message, publicKey).toString();
  return computedSignature === signature;
} 