import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'

function App() {
  // Shared state across pages
  const [uploadResult, setUploadResult] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)

  return (
    <div className="min-h-screen relative">
      {/* Animated background */}
      <div className="bg-gradient-animated" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-20">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                onUploadSuccess={(result) => setUploadResult(result)}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                uploadResult={uploadResult}
                analysisResult={analysisResult}
                setAnalysisResult={setAnalysisResult}
              />
            }
          />
          <Route
            path="/chat"
            element={
              <Chat
                analysisResult={analysisResult}
              />
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
