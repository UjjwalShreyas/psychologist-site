# 🧠 G. Suma Kavitha — Counselling Psychologist Website

A full-stack professional website built for a real client — G. Suma Kavitha, a Counselling Psychologist based in Hyderabad. Designed, developed, and deployed solo as a freelance project.

🌐 **Live Site:** [sumakavitha.online](https://sumakavitha.online)

---

## ✨ Features

- **Appointment Booking System** — patients can book in-person or online sessions, with real-time slot availability
- **Email Notifications** — automatic confirmation emails to patients + alerts to the doctor on every booking
- **Admin Dashboard** — protected dashboard to approve/reject appointments with one click
- **Double Booking Prevention** — approved slots are blocked in real-time via Supabase
- **Secure Auth** — HTTP-only cookie based admin authentication, protected by Next.js middleware
- **Fully Responsive** — mobile-first design, tested across devices
- **Custom Domain** — deployed on Vercel with a custom domain

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Email | Nodemailer + Gmail SMTP |
| Deployment | Vercel |
| Auth | HTTP-only cookies + Next.js middleware |

---

## 📁 Project Structure

```
app/
  admin/          → protected admin dashboard
  api/
    book/         → booking API with validation + double booking check
    adminLogin/   → cookie-based auth
    adminLogout/  → clears auth cookie
    checkAuth/    → validates session
    notify/       → sends approval/rejection emails to patients
  login/          → admin login page
  about/
  services/
  contact/
  gallery/
components/
  navbar/
  booking/        → BookingForm with real-time slot blocking
  about/
  services/
  stats/
  contact/
  footer/
middleware.ts     → server-side route protection for /admin
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/UjjwalShreyas/psychologist-site.git
cd psychologist-site
npm install
```

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GMAIL_USER=your_gmail
GMAIL_PASS=your_gmail_app_password
ADMIN_PASSWORD=your_admin_password
DOCTOR_EMAIL=doctor_email
```

```bash
npm run dev
```

---

## 🗄 Database Schema (Supabase)

```sql
create table appointments (
  id uuid default gen_random_uuid() primary key,
  name text,
  phone text,
  email text,
  session_type text,
  date text,
  time text,
  message text,
  status text default 'pending',
  created_at timestamp default now()
);
```

---

## 👨‍💻 About

Built solo by **Ujjwal Shreyas .G** — CS student and freelance developer.

[GitHub](https://github.com/UjjwalShreyas) · [LinkedIn](https://linkedin.com/in/ujjwalshreyas)
