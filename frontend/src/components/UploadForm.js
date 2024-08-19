import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UploadForm.css';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState('');
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-wav'];
    if (selectedFile && !allowedTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload an audio file (mp3, wav).');
      setFile(null);
      setFileName('');
    } else {
      setError('');
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  useEffect(() => {
    if (jobId) {
      const intervalId = setInterval(async () => {
        try {
          const response = await axios.get(`http://localhost:3000/check/${jobId}`);
          if (response.data.finished) {
            setTranscription(response.data.content);
            setLoading(false);
            setJobId(''); // Clear jobId after transcription is complete
            clearInterval(intervalId);
          }
        } catch (err) {
          setError('Error checking transcription status. Please try again.');
          setLoading(false);
          setJobId(''); // Clear jobId if there's an error
          clearInterval(intervalId);
        }
      }, 5000); // Check every 5 seconds

      return () => clearInterval(intervalId); // Cleanup on component unmount
    }
  }, [jobId]);

  const downloadTranscription = () => {
    const element = document.createElement('a');
    const file = new Blob([transcription], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${jobId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData);
      setJobId(response.data.id);
      setTranscription('');
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Error uploading file. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="upload-form">
      <input 
        type="file" 
        onChange={handleFileChange} 
        className="file-input"
        disabled={loading}
      />
      {fileName && <p className="file-name">Selected file: {fileName}</p>} {/* Display the file name */}
      {error && <p className="error-message">{error}</p>}
      <button 
        onClick={handleUpload} 
        disabled={!file || loading} 
        className="upload-button"
      >
        Upload
      </button>
      {loading && <p className="loading-message">Waiting for transcription be done. Please wait...</p>}
      {transcription && <button onClick={downloadTranscription} className="download-button">Download Transcription</button>}
    </div>
  );
};

export default UploadForm;
