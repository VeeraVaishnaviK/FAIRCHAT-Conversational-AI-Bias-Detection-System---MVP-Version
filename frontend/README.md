# FAIRCHAT Frontend

Modern, React-based frontend for the FAIRCHAT Conversational AI Bias Detection System.

## Features

- **Instant Dataset Analysis**: Upload CSV files and get a comprehensive fairness score.
- **Interactive Dashboard**: Visualize bias levels, affected features, and AI-driven explanations.
- **AI Bias Assistant**: Chat with a Gemini-powered assistant to explore and mitigate biases.
- **Modern SaaS UI**: Clean, professional interface with smooth transitions and responsive design.

## Tech Stack

- **React 19** + **TypeScript**
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)
- **Axios** (API Client)
- **React Router** (Navigation)

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Backend URL**:
   Create a `.env` file or use the default `http://localhost:8000/api`.
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

3. **Run in Development**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## Project Structure

- `src/components`: Reusable UI components (Navbar, FileUpload, etc.)
- `src/pages`: Main application views (Home, Dashboard, Chat)
- `src/services`: API service layer
- `src/hooks`: Custom hooks and state management (Context API)
- `src/types`: TypeScript interfaces
- `src/utils`: Helper functions
