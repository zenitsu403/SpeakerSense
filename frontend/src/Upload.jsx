import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WaveformAnimation = () => {
  const [waveformHeights, setWaveformHeights] = useState(Array(5).fill(50));

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveformHeights(waveformHeights.map(() => Math.random() * 100));
    }, 200); // Change interval to control smoothness

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1 h-16 justify-center">
      {waveformHeights.map((height, i) => (
        <div
          key={i}
          className="w-1.5 bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
          style={{
            height: `${height}%`,
            animationDelay: `${i * 2}s`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
};

const Loading = () => {
  return (
    <div className="flex flex-col gap-5 justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      <p className="ml-4 text-sm text-gray-400">Please Wait....</p>
    </div>
  );
};

const AudioUploader = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const navigate = useNavigate();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFile = (file) => {
    const validTypes = ["audio/mpeg", "audio/mp3"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid MP3 file");
      return false;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("File size should be less than 20MB");
      return false;
    }
    return true;
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError("");
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
      setUploadStatus('idle');
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError("");
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setUploadStatus('idle');
    }
  };

  const uploadFile = async () => {
    setIsLoading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const config = {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      };

      const response = await axios.post("http://localhost:8000/upload/", formData, config);
      setUploadStatus('success');
      navigate('/meeting-analytics', { state: { response_data: response.data } });
    } catch (err) {
      console.log(err)
      setError("Upload failed. Please try again.");
      setUploadStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div
        className={`
          relative rounded-xl border-2 border-dashed p-12
          transition-all duration-300 ease-in-out backdrop-blur-sm
          ${isDragging ? 'border-blue-500 bg-blue-500/5' : 'border-gray-700 bg-gray-800/50'}
          ${uploadStatus === 'success' ? 'border-green-500 bg-green-500/5' : ''}
          ${uploadStatus === 'error' ? 'border-red-500 bg-red-500/5' : ''}
          shadow-lg hover:shadow-blue-500/10
        `}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-6">
          {!file && (
            <>
              <div className="rounded-full bg-gray-800/80 p-6 shadow-lg">
                <WaveformAnimation />
              </div>
              <div className="text-center">
                <button
                  onClick={() => document.getElementById('file-upload').click()}
                  className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  Click to upload
                </button>
                <span className="text-gray-400"> or drag and drop</span>
                <p className="text-sm text-gray-500 mt-2">MP3 files up to 20MB</p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".mp3,audio/mpeg"
                onChange={handleFileChange}
              />
            </>
          )}

          {file && uploadStatus === 'idle' && (
            <div className="text-center">
              <div className="mb-6 bg-gray-800/80 p-6 rounded-full shadow-lg">
                <WaveformAnimation />
              </div>
              <p className="text-sm font-medium text-gray-300">{file.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <button
                onClick={uploadFile}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg
                         hover:bg-blue-500 transition-all duration-200
                         shadow-lg hover:shadow-blue-500/20"
              >
                Upload File
              </button>
            </div>
          )}

          {uploadStatus === 'uploading' && (
            <Loading />
          )}

          {uploadStatus === 'success' && (
            <div className="text-center text-green-400">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="mt-2 text-sm font-medium">Upload successful!</p>
              <button
                onClick={() => {
                  setFile(null);
                  setUploadStatus('idle');
                }}
                className="mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                Upload another file
              </button>
            </div>
          )}

          {error && (
            <div className="text-center text-red-400">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2 text-sm">{error}</p>
              <button
                onClick={() => {
                  setError("");
                  setFile(null);
                  setUploadStatus('idle');
                }}
                className="mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Upload = () => {
    return (
      <main className="flex-grow pt-24">
        <AudioUploader />
      </main>
    );
  };  

export default Upload;