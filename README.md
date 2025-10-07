
````markdown
# Solid Realtime Voting App 🗳️

A **live poll / voting app** built with **SolidStart** and **Supabase Realtime**.  
Votes are updated instantly for all users — no backend required!

---

## Features

- Multiple poll options
- Realtime vote count and dynamic percentage bars
- Fully frontend-powered using Supabase Realtime

---

## Tech Stack

- **Frontend:** SolidStart (Solid.js framework)  
- **Realtime & Database:** Supabase (PostgreSQL + Realtime)  
- **Styling:** TailwindCSS (optional)  

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/NipunSGeeTH/realtime-voting-app
cd realtime-voting-app
````

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_KEY=YOUR_SUPABASE_ANON_KEY
```

### 4. Run the app locally

```bash
npm run dev
```

Open your browser at `http://localhost:3000` and see **realtime updates** when voting.

---

## Database Setup

Run the SQL in `database.sql` to create the tables and sample data.
Make sure **Realtime** is enabled for the `poll_options` table in Supabase.

---

## How It Works

* Frontend subscribes to **Supabase Realtime** events on `poll_options`
* Voting updates the table → Supabase pushes the change → UI updates instantly

---
