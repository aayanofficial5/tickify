# 🎟️ Tickify – Ticket Booking Web Application

**Tickify** is a full-stack ticket booking web application built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) and **Firebase**, integrated with Razorpay for secure payments. It offers a seamless, responsive, and modern user experience for browsing movies, selecting showtimes, booking seats, and managing bookings — all in one place.

---
# 🔐 Admin Credentials

Use the following credentials to log in as an **Admin** in the Ticket Booking Application:

- **Admin Email:** `admin@gmail.com`
- **Password:** `admin1234`

---
## 🚀 Features

### 👤 User Features
- 🔐 Secure authentication (Firebase Auth with JWT).
- 🎬 Browse movies and view detailed descriptions.
- 🗓️ Select preferred date, time, and theater for shows.
- 🪑 Seat selection with visual layout.
- 💳 Razorpay integration for online payments.
- 📄 Download professional PDF tickets.
- 📂 Manage and track past and upcoming bookings.
- 🌘 Fully responsive dark-themed UI.

### 👨‍💼 Admin Features
- 🔒 Admin login with role-based access.
- 🧾 Admin Dashboard to add/edit shows.
---

## 🖼️ UI/UX

Built using:
- ⚡ **React 19 + Vite**
- 🧩 **ShadCN UI** (Radix UI + Tailwind CSS)
- 🎨 Fully themeable design system
- 📱 Mobile-responsive layouts
- 🛎️ Toasts and modals using **Sonner** and **Radix Alert Dialogs**

---

## 🧱 Project Structure

```
tickify/
├── public/
│   └── icon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Common/
│   │   ├── Core/
│   │   └── ui/
│   ├── data/
│   ├── firebase.jsx
│   ├── redux/
│   ├── services/
│   ├── pages/
│   ├── utils/
│   └── main.jsx
├── .env
├── package.json
├── vite.config.js
└── vercel.json
```

---

## ⚙️ Tech Stack

| Layer        | Technology                          |
|--------------|--------------------------------------|
| Frontend     | React 19, Tailwind CSS, ShadCN UI    |
| Backend      | Firebase, Express.js (if used)       |
| Auth         | Firebase Auth                        |
| State Mgmt   | Redux Toolkit                        |
| Forms & Val. | React Hook Form + Zod                |
| Payments     | Razorpay                             |
| PDF Gen      | @react-pdf/renderer, jsPDF           |
| UI/UX        | Radix UI, Lucide Icons, Sonner       |
| Routing      | React Router v7                      |
| Deployment   | Vercel                                |

---

## 🧪 Setup & Installation

### 🔧 Prerequisites
- Node.js >= 16
- Firebase Project
- Razorpay Key

### 📦 Install Packages

```bash
npm install
```

### 🧬 Environment Setup

Create a `.env` file in the root directory:

```env

# Razorpay Configuration
VITE_RAZORPAY_ID=your_razorpay_key_id
VITE_TMDB_API_TOKEN=your_tmdb_api_token
```

### ▶️ Run Locally

```bash
npm run dev
```

--- 

## 🙌 Acknowledgements

- Thanks to **Celebal Technologies** for inspiration.
- Special thanks to mentors and peers for support.
- UI library powered by **ShadCN UI**.

---

## 📫 Contact

For queries, suggestions, or collaborations:

**Author**: Aayan  
**Email**: [aayanofficial5@gmail.com]  
**GitHub**: [github.com/aayanofficial5](https://github.com/aayanofficial5)

---

> ⭐ If you like the project, give it a star on GitHub!
