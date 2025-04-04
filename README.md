# Secure Email Application

**Overview**

The Secure Email Application is a modern web-based email platform designed to ensure the privacy and security of user communications. Developed using Next.js and React, it incorporates robust encryption features and user-friendly functionality.

---

## Features

- Secure user authentication via email and password
- Confidential email transmission and reception
- CC support for multiple recipients
- Optional end-to-end encryption for sensitive communications
- Light and dark theme modes with seamless transitions
- Responsive design compatible with mobile devices
- Email folder management including Inbox, Sent, Drafts, Trash, and Spam

---

## Installation Guide

### Prerequisites

To install and run the application locally, ensure the following software is installed:

- Node.js version 18.x or higher
- npm or yarn package manager

### Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/secure-email-app.git
   cd secure-email-app
   ```

2. Install project dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Launch the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Access the application via your web browser:

   ```
   http://localhost:3000
   ```

---

## Demo Accounts

The following pre-configured demo accounts are available for testing purposes:

| Account Name | Email Address        | Password   |
|--------------|----------------------|------------|
| Demo User    | demo@example.com     | secure123  |
| User One     | user1@example.com    | secure123  |
| User Two     | user2@example.com    | secure123  |

---

## User Guide

### Account Access

- Users may log in using demo credentials or register through the sign-up interface.
- The registration link is available on the login page.

### Viewing Emails

- Emails can be read by selecting them from the Inbox.
- Users can navigate between folders using the sidebar.

### Composing Emails

- Select "Compose New Email" to draft a message.
- Enter recipient addresses in the "To" field (separated by commas for multiple recipients).
- Optionally add CC addresses.
- Provide a subject and compose the message body.
- Enable encryption for secure transmission if desired.
- Click "Send Email" to dispatch the message.

### Theme Customization

- Use the theme toggle button located in the header to switch between light and dark modes.

---

## Development Stack

The application has been developed using the following technologies:

| Technology   | Function                          |
|--------------|-----------------------------------|
| Next.js 14   | React-based web development       |
| React 18     | Front-end user interface library  |
| NextAuth.js  | Authentication and session management |
| TailwindCSS  | Styling and UI design framework   |
| TypeScript   | Type-safe JavaScript programming  |

---

## Security and Cryptographic Algorithms

To ensure secure communication, the application integrates several cryptographic mechanisms:

| Algorithm      | Purpose                                | Implementation Details                                   |
|----------------|----------------------------------------|----------------------------------------------------------|
| AES-256-CBC    | Symmetric encryption for email content | Implemented using CryptoJS with CBC mode and PKCS7 padding |
| RSA            | Asymmetric key exchange                | Implemented using CryptoJS (WebCrypto API recommended for production) |
| HMAC-SHA256    | Message authentication                 | Used to generate and verify digital signatures           |
| bcrypt         | Password hashing                       | Stores user passwords securely using salted hashing      |

**Encryption Workflow:**
1. The email content is encrypted using AES-256-CBC.
2. The AES key is encrypted using the recipient's RSA public key.
3. An HMAC-SHA256 signature is generated to verify message integrity and sender authenticity.

---

## Security Considerations

Please note that this application is configured for demonstration purposes only. In a production environment, the following enhancements are strongly recommended:

- Utilize a persistent database system for data storage
- Implement secure cryptographic key management practices
- Serve all traffic over HTTPS
- Integrate additional safeguards such as rate limiting and CSRF protection

---

## License

This project is licensed under the MIT License. For more information, please refer to the LICENSE file included in the repository.
