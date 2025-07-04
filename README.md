# 🩺 CuroVia

**CuroVia** is a comprehensive telemedicine web platform that enables patients and doctors to connect through secure one-on-one video consultations from anywhere in the world. It features robust user onboarding, real-time scheduling, secure payments, and a fully responsive interface. Built with **React 19**, **Next.js 15**, **Tailwind CSS**, **Shadcn UI**, **Vonage**, **NeonDB**, **Prisma**, and **Clerk Authentication**.

---

### *Key Features & Functionalities*:-

### Secure Authentication & Role-Based Access
- **Clerk Authentication** for secure sign-ups/logins.
- Role-based onboarding for **patients, doctors, and admins**.

### Specialty-Based Doctor Search & Booking
- Patients can **search by medical specialty** to find the right doctor.
- Book appointments using **real-time doctor availability** with easy slot selection.

### One-on-One Video Consultations with Notes
- **Vonage integration** powers secure video calls.
- Patients can add **pre-consultation notes**; doctors can share follow-up notes post-session.
- Users can turn **video/audio on/off** and end calls smoothly.

### Subscription Plans & Credit-Based System
- Patients purchase **monthly subscription plans** when credits run out.
- Each credit equals **$10 USD**, with a **20% platform fee** per credit.

### Admin Dashboard & Doctor Management
- Admins **verify medical credentials**, approve doctor applications, and manage payouts.
- Admins can **suspend doctor accounts** and process withdrawal requests securely.

---

### *Real-World Implementation & Revenue Model*:-

- Clinics and hospitals can deploy **CuroVia** to offer remote consultations to patients worldwide.
- Doctors earn money by offering consultations; patients pay with purchased credits.
- The platform retains a **20% fee per credit**, creating a **sustainable revenue stream**.
- **PayPal integration** processes payouts for doctors after admin approval.
- Fully cloud-based architecture allows easy scaling to serve global users.

---

## Tech Stack Breakdown

| Category          | Technology Used                | Purpose                                          |
|-------------------|---------------------------------|--------------------------------------------------|
| **Frontend**      | React 19 + Next.js 15          | UI, Routing, SSR                                 |
| **UI Framework**  | Shadcn UI + Tailwind CSS       | Responsive, modern design                        |
| **Backend**       | Next.js API Routes             | Business logic & API handling                    |
| **Database**      | NeonDB (PostgreSQL)            | Store users, appointments, transactions          |
| **ORM**           | Prisma ORM                     | Database queries & schema management             |
| **Video Calls**   | Vonage API                     | Secure real-time video consultations             |
| **Authentication**| Clerk Authentication           | Role-based access control                        |
| **Payments**      | PayPal                         | Doctor payouts & platform fee collection         |
| **Hosting**       | Vercel                         | Cloud-based deployment                           |

---

✨ **CuroVia** bridges the gap between patients and doctors through secure, convenient, and efficient virtual healthcare.
