# Quiz Optimization System

A full-stack web application designed to help users maximize their quiz scores within a specific time limit. This project was built as a practical assessment for the Full Stack Intern position.

The core feature is an **Algorithm Optimizer** that uses Dynamic Programming to determine the mathematically perfect combination of questions to answer to achieve the highest possible score.

## 🚀 Features

* **Quiz Dashboard:** Browse available technical and general knowledge quizzes.
* **Strategy Optimizer:** Input a time limit (e.g., 5 minutes), and the system calculates the optimal set of questions.
* **Attempt History:** Tracks selected strategies, scores, and timestamps in a database.
* **Modern UI:** A clean, minimalist "Quiet Luxury" aesthetic using Tailwind CSS.
* **Mobile Responsive:** Fully responsive layout for all device sizes.

## 🛠️ Technology Stack

* **Frontend:** Next.js 15 (App Router), React, Tailwind CSS, Lucide Icons
* **Backend:** Next.js API Routes (Serverless functions)
* **Database:** Supabase (PostgreSQL)
* **Language:** TypeScript
* **Algorithm:** 0/1 Knapsack Problem (Dynamic Programming)

---

## ⚙️ Setup Instructions

Follow these steps to run the project locally.

### 1. Prerequisites
* Node.js (v18 or higher)
* npm or yarn

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/chithraka-kal/quiz-optimization-system
cd quiz-optimizaer

# Install dependencies
npm install
```

### 3. Environment Configuration
For the convenience of the reviewer, I have included a .env.example file with the necessary Supabase credentials to run the project immediately.

* Locate the .env.example file in the root directory.
* Rename it to .env.local.

### 4. Database Setup (Optional)
The project connects to a live Supabase instance by default (if you used the keys above). However, if you wish to set up your own database, execute the following SQL in your Supabase SQL Editor:
```bash
-- 1. Create Tables
create table users (
  id uuid default gen_random_uuid() primary key,
  username text unique not null,
  created_at timestamp with time zone default now()
);

create table quizzes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  created_at timestamp with time zone default now()
);

create table questions (
  id uuid default gen_random_uuid() primary key,
  quiz_id uuid references quizzes(id) on delete cascade,
  text text not null,
  score int not null,
  time_required int not null,
  created_at timestamp with time zone default now()
);

create table answers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id),
  question_id uuid references questions(id),
  selected_option text,
  is_correct boolean,
  created_at timestamp with time zone default now()
);

-- 2. Disable RLS (For assessment simplicity)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes DISABLE ROW LEVEL SECURITY;

-- 3. Seed Data
INSERT INTO users (username) VALUES ('test_candidate');

INSERT INTO quizzes (title, description) VALUES 
('Computer Science Basics', 'Algorithms and Data Structures'),
('World Geography', 'Capitals and Rivers');

-- Insert Questions (Example mapping to CS quiz)
-- Note: Replace 'QUIZ_ID_HERE' with actual UUID from quizzes table
-- INSERT INTO questions (quiz_id, text, score, time_required) VALUES ('QUIZ_ID_HERE', 'Binary Search Complexity', 20, 2);
```

### 5. Run the Application
```bash
npm run dev
```

## 🧠 Algorithm Explanation
The core requirement of this assessment was to "maximize total score without exceeding totalTime." This is a classic computer science optimization problem known as the **0/1 Knapsack Problem.**

**Implementation Details:**
* **Input:** A set of questions (items), each with a score (value) and time_required (weight).
* **Constraint:** A maximum timeLimit (capacity).

* **Approach:** Used a **Dynamic** Programming approach (bottom-up table).

    * We construct a table dp[i][w] where i is the number of items considered and w is the current time capacity.
    * dp[i][w] stores the maximum score achievable.
    * **Time Complexity:** O(N * W) where N is the number of questions and W is the time limit.

This ensures the solution is not just a "greedy" guess, but the mathematically proven optimal set

## 📂 Project Structure
```bash
/src
  /app
    /api/optimize      # Backend: Handles the Knapsack algorithm logic
    /quizzes           # Page: Lists all available quizzes
    /quiz/[id]         # Page: Questions display & Optimization controls
    /history           # Page: Table of user's past attempts
  /components          # Reusable UI (Sidebar, QuizCard, ResultCard)
  /lib                 # Supabase client configuration
  /types               # TypeScript interfaces (Type Safety)
  ```
  ## 📝 API Documentation

**POST** /api/optimize

Calculates the optimal set of questions given a list and a time constraint.

**Request Body:**
```bash
{
  "questions": [
    { "id": "uuid", "text": "Question 1", "score": 20, "time_required": 5 },
    { "id": "uuid", "text": "Question 2", "score": 40, "time_required": 10 }
  ],
  "timeLimit": 15
}
```
**Response:**
```bash
{
  "maxScore": 60,
  "selectedQuestions": [
    { "id": "uuid", "text": "Question 1", "score": 20, "time_required": 5 },
    { "id": "uuid", "text": "Question 2", "score": 40, "time_required": 10 }
  ]
}
```
