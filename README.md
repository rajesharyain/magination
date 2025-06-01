# Magination

An AI-based text-to-speech application that generates audio based on mood and emotion. Built with React, TypeScript, and Python.

## Features

- Text-to-speech conversion with multiple language support
- Emotion-based voice modulation
- Speed control for audio playback
- Modern, responsive UI with dark theme
- Real-time audio preview
- Script processing for batch audio generation

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Heroicons

### Backend
- Python
- FastAPI
- gTTS (Google Text-to-Speech)

## Setup

### Prerequisites
- Node.js (v18 or higher)
- Python 3.12
- npm or yarn

### Frontend Setup
1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

### Backend Setup
1. Create a Python virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the FastAPI server:
```bash
python app.py
```

## Usage

1. Enter text in the input field
2. Select a language
3. Choose an emotion
4. Adjust the speed
5. Click "Generate Audio" to create the speech
6. Use the audio player to preview the generated audio

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
