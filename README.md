# Audio Transcriber

This project is a web application that allows users to upload an audio file, which is then transcribed using the Rev.ai Speech-to-Text API. The transcribed text is saved to a `.txt` file on the server. The application includes a frontend that enables users to download the transcription once it's ready.

## Features

- **Frontend**: React application for uploading audio files with polling to check transcription status and enabling download of the transcription file.
- **Backend**: Node.js with Express for handling file uploads and interacting with Rev.ai.
- **Transcription**: Uses Rev.ai API for converting audio to text.
- **Webhook**: Configured to receive transcription results.
- **Docker**: Containerizes the application for easy deployment.

## Prerequisites

- Node.js (v16 or later)
- Docker
- Rev.ai API Key
- ngrok Auth Token (handled internally by the application)

## Installation

### Backend

1. **Clone the repository:**

    ```bash
    git clone https://github.com/nantes/audioTranscriber.git
    cd audioTranscriber/backend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Create a `.env` file** in the `backend` directory with the following content:

    ```env
    REV_AI_API_KEY=your_rev_ai_api_key
    NGROK_AUTHTOKEN=your_ngrok_auth_token
    ```

    Replace `your_rev_ai_api_key` with the API key provided by Rev.ai, and `your_ngrok_auth_token` with your ngrok auth token.

4. **Run the backend locally:**

    ```bash
    npm start
    ```

    The backend will be available at `http://localhost:3000`.

### Frontend

1. **Navigate to the frontend directory:**

    ```bash
    cd ../frontend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Run the frontend locally:**

    ```bash
    npm start
    ```

    The frontend will be available at `http://localhost:8080` by default.

### Docker

1. **Create a `.env` file** in the root of your project directory (if not already created) with the following content:

    ```env
    REV_AI_API_KEY=your_rev_ai_api_key
    NGROK_AUTHTOKEN=your_ngrok_auth_token
    ```

    Replace `your_rev_ai_api_key` with the API key provided by Rev.ai, and `your_ngrok_auth_token` with your ngrok auth token.

2. **Build Docker images:**

    Navigate to the root of your project directory and run:

    ```bash
    docker-compose build
    ```

3. **Start the application:**

    ```bash
    docker-compose up
    ```

    This will start both the backend and frontend services. The application will handle ngrok integration internally.

## How It Works

1. **File Upload**: Users upload an audio file through the React frontend.
2. **Transcription Request**: The backend sends the file to Rev.ai for transcription.
3. **Polling**: Once the upload is complete and Rev.ai responds, the frontend begins polling every 5 seconds to check if the transcription is complete.
4. **Webhook**: Rev.ai sends the transcription result to the configured webhook URL.
5. **Download**: When the transcription is ready, the frontend enables the user to download the `.txt` file containing the transcribed text from the `transcriptions` folder.

## Notes

- The `transcriptions` folder is where the transcribed text files are saved.
- The frontend performs polling to check for transcription status updates every 5 seconds.
- Ensure that Docker is properly installed and running on your system for containerized deployments.
- The backend listens on port `3000` and the frontend listens on port `8080` by default.
- The `.env` file is required both for local development and Docker deployment to provide necessary environment variables.

## Acknowledgements

- Rev.ai for the Speech-to-Text API
- Docker for containerizing the application
- React and Express for the frontend and backend frameworks
