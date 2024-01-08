import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DarkModeTwoToneIcon from '@mui/icons-material/DarkModeTwoTone';
import { CopyToClipboard } from 'react-copy-to-clipboard';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [thalaData, setThalaData] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [audioSrc, setAudioSrc] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopySuccess = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('https://thalaforreason-vsu1.onrender.com/check', { input });
      setResult(response.data.message);

      // Fetch updated data immediately after submitting
      fetchThalaData();

      // Set audio source based on the condition
      setAudioSrc(response.data.message.includes('=') ? '/thala.mp3' : '/moye-moye.mp3');
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const fetchThalaData = async () => {
    try {
      const response = await axios.get('https://thalaforreason-vsu1.onrender.com/getThalaData');
      setThalaData(response.data.thalaData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchThalaData();
  }, []);

  useEffect(() => {
    const audioElement = new Audio(audioSrc);

    const playAudio = () => {
      if (audioElement.readyState >= 2) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      audioElement.play();
    };

    if (input && (audioSrc === '/thala.mp3' || audioSrc === '/moye-moye.mp3')) {
      playAudio();
    }

    return () => {
      audioElement.pause();
      audioElement.src = '';
    };
  }, [audioSrc]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const getShareableUrl = () => {
    return `${window.location.origin}/result?result=${encodeURIComponent(result)}`;
  };

  return (
    <div className={`flex flex-col items-center justify-center h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      
      <div className={`p-8 rounded shadow-md w-full max-w-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className='fixed top-2 right-2'>
          <button
            className={`p-2 rounded-full bg-${theme === 'light' ? 'white' : 'black'} text-${theme === 'light' ? 'black' : 'white'} hover:bg-${theme === 'light' ? 'gray-200' : 'gray-800'} focus:outline-none`}
            onClick={toggleTheme}
          >
            {theme === 'light' ? <DarkModeTwoToneIcon style={{ color: 'black' }} /> : <DarkModeTwoToneIcon style={{ color: 'white' }} />}
          </button>
        </div>
        <h1 className={`text-4xl font-bold text-center mb-8 ${theme === 'dark' ? 'text-yellow-300' : 'text-gray-900'}`}>Thala for a Reason</h1>
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={handleKeyUp}
            placeholder="Ready for Thala magic? Input your string or number."
            className={`px-4 py-2 border rounded w-full focus:outline-none ${theme === 'dark' ? 'border-gray-700 text-black' : 'border-gray-300 text-black'}`}
          />
          <button
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none ml-4 ${theme === 'dark' ? 'bg-blue-800' : ''}`}
            onClick={handleSubmit}
          >
            Check
          </button>
        </div>
        {result && (
          <div>
            <p className={`text-lg ${result.includes('Input is not related to the number 7') ? 'text-red-500' : 'text-green-500'}`}>
              {result}
            </p>
            {/* Share Button */}
            <CopyToClipboard text={getShareableUrl()} onCopy={handleCopySuccess}>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none mt-4">
                {copied ? 'Copied!' : 'Share Result'}
              </button>
            </CopyToClipboard>
          </div>
        )}

        <div className="mt-8">
          <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-yellow-300' : 'text-gray-900'}`}>💛 Thala For A Reason 💛</h2>
          <div className="table-container max-h-96 overflow-y-auto">
            <table className={`min-w-full border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
              <thead>
                <tr>
                  <th className={`py-2 px-4 border-b ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Input</th>
                  <th className={`py-2 px-4 border-b ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Result</th>
                </tr>
              </thead>
              <tbody>
                {thalaData.map((data, index) => (
                  <tr key={index} className={index % 2 === 0 ? `${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}` : ''}>
                    <td className={`py-2 px-4 border-b ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{data.input}</td>
                    <td className={`py-2 px-4 border-b ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{data.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* <div className="mt-8 text-center text-gray-500">
        <p>Priyanshu Patel</p>
        <p>
          <a href="https://github.com/priyanshu1044/" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </div> */}
    </div>
  );
}

export default App;
