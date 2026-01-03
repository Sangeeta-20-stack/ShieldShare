# ShieldShare

**ShieldShare** is a secure file sharing web application that encrypts your files before upload and provides one-time download links with optional password protection. Built with modern technologies, it ensures privacy, security, and seamless file sharing.

---

## Features

- **End-to-end encryption** – Files are encrypted before leaving your browser.  
- **Secure download links** – One-time download with optional password protection.  
- **File expiry** – Set files to expire after a specified number of hours.  
- **Clipboard copy** – Automatically copies download links after upload.  
- **Modern UI** – Futuristic and responsive design with animations and neon accents.  

---

## Tech Stack

### Frontend
- **React** – Component-based UI  
- **Tailwind CSS** – Styling and responsive layouts  
- **react-hot-toast** – Notifications  
- **Axios** – HTTP requests  

### Backend
- **Node.js & Express** – API and server  
- **MongoDB & Mongoose** – File metadata storage  
- **Multer** – File uploads  
- **Crypto** – Encryption & decryption  
- **Bcrypt** – Password hashing  

### Extras
- **Render** – Deployment of backend and frontend  
- **Clipboard API** – Copy links to clipboard  
- **One-time download logic** – Deletes file after download  

---

## Getting Started

### Prerequisites
- Node.js v18+  
- MongoDB (Atlas or local)  

### Clone the repository
```bash
git clone https://github.com/Sangeeta-20-stack/ShieldShare.git
cd ShieldShare

```Backebd setup
cd server
npm install

```Create a .env file with:

MONGO_URI=<your_mongodb_connection_string>
PORT=5000
```Start backend:
nodemon index.js

```Frontend setup

cd client
npm install
npm start

```Folder structure
ShieldShare/
├─ client/             # React frontend
├─ server/             # Node.js backend
│  ├─ models/          # Mongoose schemas
│  ├─ routes/          # API routes
│  ├─ utils/           # Encryption/decryption helpers
│  └─ uploads/         # Temporary file storage
└─ README.md


Future Enhancements

Multiple file uploads at once

User authentication and accounts

Cloud storage integration (S3, Google Drive)

Advanced analytics on downloads









