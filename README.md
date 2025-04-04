# Secure Email Application

<p align="center">
  <img src="public/logo.png" alt="Secure Email Logo" width="120">
</p>

A modern web-based secure email application with encryption features built with Next.js and React.

![Application Screenshot](public/screenshot.png)

## ✨ Features

- 🔐 User authentication with email and password
- 📧 Secure email sending and receiving
- 👥 CC functionality for multiple recipients
- 🔒 End-to-end encryption option for sensitive messages
- 🌓 Dark/Light mode theming with smooth transitions
- 📱 Mobile-responsive design
- 📁 Folder management (Inbox, Sent, Drafts, Trash, Spam)

## 🚀 Installation

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Setup Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/secure-email-app.git
   cd secure-email-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## 👤 Demo Accounts

You can use any of these pre-configured accounts to test the application:

| Account | Email | Password |
|---------|-------|----------|
| Demo User | demo@example.com | secure123 |
| User One | user1@example.com | secure123 |
| User Two | user2@example.com | secure123 |

## 📝 Usage Guide

### Login/Registration
- Use one of the demo accounts or create your own account through the signup page
- Navigate to the signup page by clicking "Sign up" on the login screen

### Reading Emails
- Click on any email in your inbox to view its contents
- Use the folder sidebar to navigate between different email folders

### Sending Emails
- Click the "Compose New Email" button to create a new message
- Add recipients in the "To" field (multiple emails can be separated by commas)
- Add CC recipients if needed
- Write your subject and message
- Toggle encryption if you want to send a secure message
- Click "Send Email" to deliver your message

### Theme Toggle
- Click the sun/moon icon in the header to toggle between light and dark themes

## 🛠️ Development Information

This application is built with:

| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework with App Router |
| React 18 | UI library |
| NextAuth.js | Authentication |
| TailwindCSS | Styling |
| TypeScript | Type safety |

## 🔐 Security and Cryptography Algorithms

This application implements several cryptographic algorithms to ensure secure email communication:

| Algorithm | Purpose | Implementation |
|-----------|---------|----------------|
| AES-256-CBC | Symmetric encryption for email content | Uses CryptoJS for AES encryption with CBC mode and PKCS7 padding |
| RSA | Asymmetric encryption for key exchange | Simplified implementation using CryptoJS (in production, would use WebCrypto API) |
| HMAC-SHA256 | Digital signatures | Used to verify email authenticity |
| bcrypt | Password hashing | Securely stores user passwords with salt |

The application follows a hybrid encryption model:
1. Email content is encrypted with AES (symmetric encryption)
2. The AES key is encrypted with the recipient's RSA public key (asymmetric encryption)
3. Digital signatures are created using HMAC-SHA256 to verify sender authenticity

## 🔒 Security Notes

For demonstration purposes, this application uses an in-memory storage system. In a production environment, you would want to:
- Use a proper database for persistent storage
- Implement proper cryptographic key management
- Set up HTTPS for all communication
- Add additional security measures like rate limiting and CSRF protection

## 📱 Screenshots

<p align="center">
  <img src="public/login-screen.png" alt="Login Screen" width="250">
  <img src="public/inbox.png" alt="Inbox" width="250">
  <img src="public/compose-email.png" alt="Compose Email" width="250">
</p>

## 📄 License

This project is licensed under the GIT License - see the LICENSE file for details.
