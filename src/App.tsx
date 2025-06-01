import { useState } from 'react'
import UploadImage from './components/UploadImage'
import PromptInput from './components/PromptInput'
import PreviewPlayer from './components/PreviewPlayer'
import DownloadButton from './components/DownloadButton'
import TextToSpeech from './components/TextToSpeech'
import './App.css'

function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [prompt, setPrompt] = useState('')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleImageUpload = (file: File) => {
    setSelectedImage(file)
    setVideoUrl(null)
  }

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) return

    setIsLoading(true)
    try {
      // TODO: Implement API calls to:
      // 1. Upload image to Cloudinary
      // 2. Generate voice using Bark API
      // 3. Create animation using D-ID API
      
      // Mock response for now
      await new Promise(resolve => setTimeout(resolve, 2000))
      setVideoUrl('https://example.com/mock-video.mp4')
    } catch (error) {
      console.error('Error generating video:', error)
      // TODO: Add proper error handling
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          AI Image Animation
        </h1>
        
        <div className="space-y-8">
          <UploadImage onImageUpload={handleImageUpload} />
          
          {selectedImage && (
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleGenerate}
              isLoading={isLoading}
            />
          )}
          
          <PreviewPlayer videoUrl={videoUrl} isLoading={isLoading} />
          
          <div className="flex justify-center">
            <DownloadButton videoUrl={videoUrl} isLoading={isLoading} />
          </div>

          {/* Text-to-Speech Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-8">
              Text-to-Speech
            </h2>
            <TextToSpeech />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
