<h1>
  <img src="https://github.com/user-attachments/assets/98752926-34d2-499c-9056-a0268c14463a" width="40" style="vertical-align: middle;"/> CuroVia
</h1>

**CuroVia** is a modern telemedicine web platform that connects patients and doctors worldwide through secure video consultations. It provides robust user onboarding, specialty-based search, real-time scheduling, role-based dashboards, credit-based booking, and smooth payouts - all in a fully responsive interface. Built with **React 19**, **Next.js 15**, **Tailwind CSS**, **Shadcn UI**, **Vonage**, **NeonDB**, **Prisma**, and **Clerk Authentication**.

---

### *Key Features & Functionalities*:-

### Secure Authentication & Role Management
- **Clerk Authentication** for secure sign-ups/logins.
- Role-based access for **patients, doctors, and admins**.

### Patient Experience & Booking System
- Patients **register as patients** with guided onboarding.
- Search for doctors **by specialty** to find the best match.
- Book appointments through **real-time available slots**.
- Buy **monthly subscription plans** to top up credits for booking consultations.
- Add **notes for the doctor** before the appointment and review **doctor’s notes** after.
- Cancel or join video calls through the **appointments page**.

### Doctor Dashboard & Earnings
- Doctors **register with verification** and set their availability.
- Manage appointments, join video calls, and add post-consultation notes.
- Track earnings and **request payouts** through a dedicated dashboard.
- Withdrawals processed securely via **PayPal**.

### Admin Controls & Platform Security
- Admins **verify doctor credentials** before approval.
- **Suspend accounts**, manage compliance, and process payout requests.
- Monitor platform activity and ensure secure operations.

### Video Consultation Powered by Vonage
- One-on-one secure video calls with **token expiration** for privacy.
- Doctors and patients can **turn mic/camera on/off**, mute/unmute, or end the call anytime.

---

### *Platform Revenue & Real-World Use Case*:-

- **Revenue Model**: Patients pay for consultations using credits purchased through monthly subscription plans.
- Each credit covers a consultation fee — doctors earn for each session.
- **Each credit = $10 USD**, with a **20% platform fee** deducted per credit - the rest goes to the doctor.
- This ensures a sustainable business model for the platform.

- **Real-World Use**: Ideal for hospitals, clinics, or individual practitioners expanding to remote care. Patients can access doctors globally, and doctors have a trusted channel for secure payouts.

---

## Tech Stack Breakdown

| Category          | Technology Used                | Purpose                                          |
|-------------------|---------------------------------|--------------------------------------------------|
| **Frontend**      | React 19 + Next.js 15          | Modern UI, SSR, Routing                          |
| **UI Framework**  | Shadcn UI + Tailwind CSS       | Clean, responsive design                         |
| **Backend**       | Next.js API Routes             | Business logic & APIs                            |
| **Database**      | NeonDB (PostgreSQL)            | Stores users, bookings, transactions             |
| **ORM**           | Prisma ORM                     | Database queries & schema management             |
| **Video Calls**   | Vonage API                     | Real-time secure video consultations             |
| **Authentication**| Clerk Authentication           | Secure role-based sign-ups/logins                |
| **Payments**      | PayPal                         | Doctor payouts & credit purchases                |
| **Hosting**       | Vercel                         | Cloud-based deployment                           |

---

**CuroVia** - bringing accessible, trusted healthcare to your fingertips, anywhere in the world.
