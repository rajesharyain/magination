import { useState, useEffect } from 'react';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid';

interface Language {
  [key: string]: string;
}

interface Emotion {
  [key: string]: {
    speed: number;
  };
}

const API_BASE_URL = 'http://localhost:3001/api';

export default function TextToSpeech() {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [emotion, setEmotion] = useState('neutral');
  const [speed, setSpeed] = useState(1.0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [languages, setLanguages] = useState<Language>({});
  const [emotions, setEmotions] = useState<Emotion>({});
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    // Fetch available languages and emotions
    const fetchOptions = async () => {
      try {
        const [languagesRes, emotionsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/languages`),
          fetch(`${API_BASE_URL}/emotions`)
        ]);
        
        const languagesData = await languagesRes.json();
        const emotionsData = await emotionsRes.json();
        
        setLanguages(languagesData);
        setEmotions(emotionsData);
      } catch (error) {
        setError('Failed to load options');
        console.error('Error loading options:', error);
      }
    };

    fetchOptions();
  }, []);

  const handleGenerate = async () => {
    if (!text) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/generate-audio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language,
          emotion,
          speed,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setAudioUrl(data.audioUrl);
      } else {
        setError('Failed to generate audio');
      }
    } catch (error) {
      setError('Error generating audio');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Text to Speech</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`p-2 rounded-full transition-all duration-200 ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isRecording ? (
                <StopIcon className="h-6 w-6 text-white" />
              ) : (
                <MicrophoneIcon className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-32 bg-gray-800 text-white rounded-xl p-4 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 resize-none"
            placeholder="Enter your text here..."
          />
          <div className="absolute bottom-4 right-4 text-gray-400 text-sm">
            {text.length} characters
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
            >
              {Object.entries(languages).map(([name, code]) => (
                <option key={code} value={code} className="bg-gray-800">
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Emotion</label>
            <select
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
            >
              {Object.keys(emotions).map((emotion) => (
                <option key={emotion} value={emotion} className="bg-gray-800">
                  {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Speed</label>
          <div className="relative">
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Slower</span>
              <span className="text-blue-400">{speed}x</span>
              <span>Faster</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !text}
          className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all duration-200 ${
            isLoading || !text
              ? 'bg-gray-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.02]'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Generating...
            </div>
          ) : (
            'Generate Audio'
          )}
        </button>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        {audioUrl && (
          <div className="bg-gray-800/50 rounded-xl p-4">
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
} 