# Moodge
Live demo: https://moodge.onrender.com

A full-stack mood tracker that lets you log your daily mood alongside custom factors you define yourself (sleep, caffeine, exercise, anything), then surfaces patterns showing how those factors relate to how you feel. For example, "your mood averages 7.2 on days you slept 7+ hours versus 4.8 when you slept less."

> Personal demonstration project. Not intended for storing real sensitive information.

## Features

- Secure auth with bcrypt-hashed passwords and httpOnly cookie sessions
- Custom tracking variables with typed inputs (number, yes/no, 1–10 scale, text)
- Daily mood logging with optional notes and variable values
- Dashboard with average mood, total entries, and a mood-over-time chart
- Insights that compare your mood across high vs. low values of each factor
- Full entry history with delete
- Light / dark mode
- Account deletion

## Tech Stack

**Frontend:** React, React Router, Axios, Recharts
**Backend:** Node.js, Express, PostgreSQL, Prisma, JWT (httpOnly cookies), bcrypt

## Getting Started

**Prerequisites:** Node.js, PostgreSQL, Git

1. Clone and create the database:

   ```bash
   git clone https://github.com/knguyen196/Mood-Tracker.git
   cd Mood-Tracker
   ```

   ```sql
   CREATE DATABASE mood_tracker;
   ```

2. Set up the server:

   ```bash
   cd server
   npm install
   ```

   Create a `.env` in `server/`:

   ```
   DATABASE_URL="postgresql://postgres:YOURPASSWORD@localhost:5432/mood_tracker"
   JWT_SECRET="your-super-duper-random-secret-string"
   PORT=5000
   ```

   ```bash
   npx prisma migrate dev
   npm run dev
   ```

3. Set up the client (in a separate terminal):

   ```bash
   cd client
   npm install
   npm start
   ```

   Opens at `http://localhost:3000`.
