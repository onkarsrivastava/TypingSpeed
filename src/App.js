// Typing Speed Test Website Codebase

// 1. Frontend: React App

// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const sentences = [
  "The quick brown fox jumps over the lazy dog.",
  "A journey of a thousand miles begins with a single step.",
  "To be or not to be, that is the question.",
  "All that glitters is not gold."
];

function App() {
  const [currentSentence, setCurrentSentence] = useState("");
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    setCurrentSentence(
      sentences[Math.floor(Math.random() * sentences.length)]
    );
  }, []);

  const handleChange = (e) => {
    const text = e.target.value;
    setTypedText(text);

    if (text.length === 1 && !startTime) {
      setStartTime(new Date());
    }

    if (text === currentSentence) {
      setEndTime(new Date());
    }
  };

  useEffect(() => {
    if (endTime && startTime) {
      const timeTaken = (endTime - startTime) / 1000; // in seconds
      const words = currentSentence.split(" ").length;
      const calculatedWpm = Math.round((words / timeTaken) * 60);
      const correctChars = typedText
        .split("")
        .filter((char, i) => char === currentSentence[i]).length;
      const calculatedAccuracy = Math.round((correctChars / currentSentence.length) * 100);

      setWpm(calculatedWpm);
      setAccuracy(calculatedAccuracy);
    }
  }, [endTime, startTime, typedText, currentSentence]);

  const handleReset = () => {
    setCurrentSentence(
      sentences[Math.floor(Math.random() * sentences.length)]
    );
    setTypedText("");
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(0);
  };

  return (
    <div className="App">
      <h1>Typing Speed Test</h1>
      <p className="sentence">{currentSentence}</p>
      <textarea
        value={typedText}
        onChange={handleChange}
        placeholder="Start typing here..."
      ></textarea>
      {endTime && (
        <div className="results">
          <p>Words per minute: {wpm}</p>
          <p>Accuracy: {accuracy}%</p>
        </div>
      )}
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

export default App;


