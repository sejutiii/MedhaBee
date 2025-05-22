# MedhaBee - Inclusive Science Education Platform


MedhaBee is a web-based platform designed to make science education accessible and inclusive for all, particularly in Bangladesh. By addressing language barriers, literacy gaps, and accessibility challenges, MedhaBee empowers learners with curiosity to explore science through AI-powered tools, multimedia content, and inclusive design.


## Introduction
Learning should be open to all, regardless of language, literacy, or physical abilities. MedhaBee enables anyone with curiosity to learn science by offering:
- **AI-powered translation and simplification** in Bangla and English.
- **Accessible interfaces** for users with visual or auditory impairments.
- **Interactive content** like videos, daily facts, and quizzes to foster critical thinking.

## Problem Addressed
MedhaBee tackles two critical challenges in science education:
- **Language and Literacy Gaps**: Most scientific resources in Bangladesh are in English, excluding Bangla-speaking learners. Varying literacy levels require simplified, multilingual content.
- **Inclusivity for All**: Individuals with visual or auditory impairments are often excluded due to inaccessible platforms. MedhaBee ensures equal access through screen reader compatibility and voice navigation.

## Solution Overview
MedhaBee is an innovative platform that:
- **Translates and simplifies** scientific content into Bangla and English using the Gemini API.
- **Provides multimedia learning** with categorized YouTube videos (Biology, Physics, Chemistry, Medicine).
- **Offers interactive content** with curated "Did You Know?" facts and quizzes.
- **Ensures accessibility** with screen reader optimization, voice navigation.

## Key Features

### 1. Authentication System
- **Registered Users**:
  - Save preferences and progress for a personalized experience.
  - Access AI chatbot, video library, daily facts, and quizzes.
- **Guest Mode**:
  - Access only the AI chatbot, supporting text and voice input for scientific queries.

### 2. AI-Powered Chatbot
- Integrated with the **Gemini API** for Bangla and English queries.
- **Simplify/Advance modes** to tailor responses to literacy levels.
- **Text-to-Speech (TTS)** and **Speech-to-Text (STT)** for enhanced accessibility.

### 3. Video Player Interface
- Fetches YouTube videos, categorized by science topics (Biology, Physics, Chemistry, Medicine).
- Simplified mode for beginner-friendly content.

### 4. Curated Daily Content
- Tailored "Did You Know?" facts based on user-selected categories.
- Quizzes after every 10 facts to reinforce learning.
- Optimized for low-bandwidth environments.

### 5. Accessibility Features
- **Screen reader optimization** with ARIA labels and alt-text.
- **Voice navigation** (e.g., "Hey MedhaBee, simplify this") for hands-free control.
- Supports Bangla and English voice commands and audio responses.

## Technology Stack
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: FastAPI, Node.js, MongoDB Atlas
- **APIs**:
  - Gemini API (chatbot)
  - YouTube API (video content)
  - Azure Speech API (TTS/STT)
- **Deployment**: Vercel (planned for scalable hosting)
- **Accessibility**: WCAG-compliant with ARIA labels

## Getting Started

### Prerequisites
- **Node.js** (v16+ for frontend)
- **Python** (3.10+ for backend)
- **FFmpeg** (for audio processing with Azure Speech API)
- **MongoDB Atlas** account (for database)

#### Install FFmpeg
- **Ubuntu/Debian**:
  ```bash
  sudo apt update
  sudo apt install ffmpeg
  ```
- **macOS** (with Homebrew):
  ```bash
  brew install ffmpeg
  ```
- **Windows**:
  Download from [FFmpeg website](https://ffmpeg.org/download.html) and add to PATH.

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/MedhaBee.git
cd MedhaBee
```

### 2. Set Up Environment Variables
- Copy `.env.example` to `.env` in both `frontend/` and `backend/` directories.
- Fill in credentials for:
  - Gemini API key
  - YouTube API key
  - Azure Speech API key
  - MongoDB Atlas connection string

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
├── backend/         # FastAPI backend, MongoDB integration
├── frontend/        # Next.js frontend with React and Tailwind CSS
├── docs/           # Project documentation
└── README.md       # This file
```

## Environment Variables
Refer to `.env.example` in `frontend/` and `backend/` for required variables, including:
- `GEMINI_API_KEY`
- `YOUTUBE_API_KEY`
- `AZURE_SPEECH_KEY`
- `MONGODB_URI`

## Impact and Future Scope
### Impact
- **Accessibility**: Delivers Bangla and English content, simplified for diverse literacy levels.
- **Inclusivity**: Enables users with visual/auditory impairments to engage fully.
- **Scientific Literacy**: Curated facts and quizzes promote critical thinking and combat misinformation.

### Future Scope
- Implement **offline-first capabilities** for zero-connectivity regions.
- Integrate **augmented reality (AR)** for interactive science visualizations.
- Develop a **mobile app** to enhance accessibility.
- Expand language support to other regional dialects (e.g., Hindi, Tamil).
- Partner with schools to integrate MedhaBee into curricula.

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.


## Team
- **Sejuti Sharmin Siddiqui** - The University of Dhaka
- **Farhan Tausif** - The University of Dhaka
- **Mahdiya Rahman Sukanya** - The University of Dhaka

## Acknowledgments
- **BRAC-Biggan Adda** for hosting the 1st SN Bose National Science Festival 2025 IT Hackathon.
- **The University of Dhaka** for supporting our team.
- Built with ❤️ by **Status_Code 418**.
