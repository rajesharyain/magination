// API endpoints
const API_BASE_URL = 'http://localhost:3001/api';

// Fetch available languages and emotions
async function fetchOptions() {
    try {
        const [languages, emotions] = await Promise.all([
            fetch(`${API_BASE_URL}/languages`).then(r => r.json()),
            fetch(`${API_BASE_URL}/emotions`).then(r => r.json())
        ]);

        // Populate language dropdowns
        const languageSelects = document.querySelectorAll('#simpleLanguage, #language');
        languageSelects.forEach(select => {
            Object.entries(languages).forEach(([name, code]) => {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = name;
                select.appendChild(option);
            });
        });

        // Populate emotion dropdown
        const emotionSelect = document.getElementById('emotion');
        Object.keys(emotions).forEach(emotion => {
            const option = document.createElement('option');
            option.value = emotion;
            option.textContent = emotion;
            emotionSelect.appendChild(option);
        });
    } catch (error) {
        showError('Failed to load options. Please refresh the page.');
        console.error('Error loading options:', error);
    }
}

// Show loading spinner
function showLoading(element) {
    const loading = document.createElement('div');
    loading.className = 'loading';
    element.innerHTML = '';
    element.appendChild(loading);
}

// Show error message
function showError(message, element) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    element.innerHTML = '';
    element.appendChild(errorDiv);
}

// Show success message
function showSuccess(message, element) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    element.innerHTML = '';
    element.appendChild(successDiv);
}

// Create audio player
function createAudioPlayer(audioUrl) {
    const container = document.createElement('div');
    container.className = 'audio-container';
    
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = audioUrl;
    
    container.appendChild(audio);
    return container;
}

// Simple TTS form submission
document.getElementById('simpleTtsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = document.getElementById('simpleText').value;
    const language = document.getElementById('simpleLanguage').value;
    const audioContainer = document.getElementById('simpleAudio');

    if (!text) {
        showError('Please enter some text', audioContainer);
        return;
    }

    showLoading(audioContainer);

    try {
        const response = await fetch(`${API_BASE_URL}/generate-audio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, language })
        });
        const data = await response.json();
        
        if (data.success) {
            audioContainer.innerHTML = '';
            audioContainer.appendChild(createAudioPlayer(data.audioUrl));
        } else {
            showError('Failed to generate audio', audioContainer);
        }
    } catch (error) {
        showError('Error generating audio', audioContainer);
        console.error('Error:', error);
    }
});

// Advanced TTS form submission
document.getElementById('advancedTtsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = document.getElementById('advancedText').value;
    const language = document.getElementById('language').value;
    const emotion = document.getElementById('emotion').value;
    const speed = parseFloat(document.getElementById('speed').value);
    const audioContainer = document.getElementById('advancedAudio');

    if (!text) {
        showError('Please enter some text', audioContainer);
        return;
    }

    showLoading(audioContainer);

    try {
        const response = await fetch(`${API_BASE_URL}/generate-audio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text,
                language,
                emotion,
                speed
            })
        });
        const data = await response.json();
        
        if (data.success) {
            audioContainer.innerHTML = '';
            audioContainer.appendChild(createAudioPlayer(data.audioUrl));
        } else {
            showError('Failed to generate audio', audioContainer);
        }
    } catch (error) {
        showError('Error generating audio', audioContainer);
        console.error('Error:', error);
    }
});

// Script form submission
document.getElementById('scriptForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = document.getElementById('scriptFile').files[0];
    const audioContainer = document.getElementById('scriptAudio');

    if (!file) {
        showError('Please select a script file', audioContainer);
        return;
    }

    showLoading(audioContainer);

    const formData = new FormData();
    formData.append('script', file);

    try {
        const response = await fetch(`${API_BASE_URL}/process-script`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            audioContainer.innerHTML = '';
            data.audioFiles.forEach(({ scene, audioUrl }) => {
                const div = document.createElement('div');
                div.className = 'mb-4';
                div.innerHTML = `
                    <p class="text-sm text-gray-600">${scene.text}</p>
                `;
                div.appendChild(createAudioPlayer(audioUrl));
                audioContainer.appendChild(div);
            });
        } else {
            showError('Failed to process script', audioContainer);
        }
    } catch (error) {
        showError('Error processing script', audioContainer);
        console.error('Error:', error);
    }
});

// Initialize options when the page loads
document.addEventListener('DOMContentLoaded', fetchOptions); 