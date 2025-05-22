# MedhaBee - Inclusive Science Education Platform

## Team
Sejuti Sharmin Siddiqui, Farhan Tausif, Mahdiya Rahman Sukanya

## Problem Addressed
MedhaBee addresses two major challenges:
- **Language and Literacy Gaps:** Most scientific resources in Bangladesh are in English, creating barriers for Bangla-speaking learners. MedhaBee provides multilingual, simplified content for varying literacy levels.
- **Inclusivity for All:** The platform is designed for accessibility, supporting users with visual and auditory disabilities through screen reader compatibility and voice navigation.

## Solution Overview
MedhaBee is an AI-powered, accessible science education platform that:
- Translates and simplifies scientific content into Bangla and English using the Gemini API.
- Offers multimedia learning with categorized YouTube videos.
- Provides interactive daily facts and quizzes.
- Ensures accessibility with screen reader optimization and voice navigation.

## Key Features

### 1. Authentication System
- **Registered Users:**
  - Save preferences and progress.
  - Access AI chatbot, video library, daily facts, and quizzes.
- **Guest Mode:**
  - Access only the AI chatbot (with voice/text input).

### 2. AI-Powered Chatbot
- Gemini API integration for English and Bangla queries.
- Simplify/Advance modes for different literacy levels.
- Text-to-Speech (TTS) and Speech-to-Text (STT) for accessibility.

### 3. Video Player Interface
- Fetches and categorizes YouTube science videos (Biology, Physics, Chemistry, Medicine).

### 4. Curated Daily Content
- "Did You Know?" facts by category.
- Quizzes after every 10 facts.
- Low-bandwidth design for rural accessibility.

### 5. Accessibility Features
- Screen reader optimization (ARIA labels, alt-text).
- Voice navigation for hands-free control.

## Technology Stack
- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** FastAPI, Node.js
- **APIs:** Gemini API, YouTube API, Azure Speech API

## Getting Started

### Prerequisites
- Node.js (for frontend)
- Python 3.10+ (for backend)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd MedhaBee
```

### 2. Setup Environment Variables
- Copy `.env.example` files in both `frontend/` and `backend/` to `.env` and fill in your credentials.

### 3. Install Dependencies
#### Frontend
```bash
cd frontend
npm install
```
#### Backend
```bash
cd ../backend
pip install -r requirements.txt
```

### 4. Run the Application
#### Backend
```bash
cd backend
uvicorn main:app --reload
```
#### Frontend
```bash
cd ../frontend
npm run dev
```

### 5. Access the App
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Folder Structure
```
MedhaBee/
  backend/      # FastAPI backend
  frontend/     # Next.js frontend
```

## Environment Variables
See `.env.example` files in both `frontend/` and `backend/` for required variables.

## Impact and Future Scope
- **Impact:** Makes science education accessible to non-English speakers and users with disabilities. Fosters critical thinking and combats misinformation.
- **Future Scope:**
  - Offline-first capabilities for low-connectivity areas.
  - Augmented reality (AR) for interactive learning.
  - Mobile app for broader accessibility.
