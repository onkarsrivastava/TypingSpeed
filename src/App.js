import React, { useState, useEffect } from 'react';
import './App.css';

const sentences = {
  easy: [
    "The quick brown fox jumps over the lazy dog.",
    "A journey of a thousand miles begins with a single step."
  ],
  medium: [
    "To be or not to be, that is the question.",
    "All that glitters is not gold.",
    "Time flies when you're having fun."
  ],
  hard: [
    "The mitochondria is the powerhouse of the cell.",
    "Artificial intelligence is the simulation of human intelligence processes by machines.",
    "In science, we study the behavior of matter and energy."
  ]
};

function App() {
  const [currentSentence, setCurrentSentence] = useState("");
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [difficulty, setDifficulty] = useState('easy');
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState({ wpm: 0, accuracy: 0, testsCompleted: 0 });
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    setCurrentSentence(
      sentences[difficulty][Math.floor(Math.random() * sentences[difficulty].length)]
    );
  }, [difficulty]);

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

      // Save to localStorage for progress tracking
      let progress = JSON.parse(localStorage.getItem("userProgress")) || { wpm: 0, accuracy: 0, testsCompleted: 0 };
      progress.testsCompleted += 1;
      localStorage.setItem("userProgress", JSON.stringify(progress));

      // Update userData
      setUserData(progress);

      // Update local leaderboard
      const newLeaderboard = [...leaderboard, { wpm: calculatedWpm, accuracy: calculatedAccuracy }];
      newLeaderboard.sort((a, b) => b.wpm - a.wpm); // Sort by WPM in descending order
      newLeaderboard.slice(0, 10); // Limit to top 10
      setLeaderboard(newLeaderboard);
    }
  }, [endTime, startTime, typedText, currentSentence]);

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

  const handleReset = () => {
    setCurrentSentence(
      sentences[difficulty][Math.floor(Math.random() * sentences[difficulty].length)]
    );
    setTypedText("");
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(0);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  const handleCustomTextChange = (e) => {
    setCurrentSentence(e.target.value);
  };

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      <h1>Typing Speed Test</h1>
      <div>
        <select onChange={handleDifficultyChange} value={difficulty}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <textarea
          value={typedText}
          onChange={handleChange}
          placeholder="Start typing here..."
        ></textarea>
        <div className="results">
          <p>Words per minute: {wpm}</p>
          <p>Accuracy: {accuracy}%</p>
        </div>
        <button onClick={handleReset}>Reset</button>
        <button onClick={toggleDarkMode}>Toggle Dark Mode</button>
        <textarea
          placeholder="Enter your own sentence here"
          onChange={handleCustomTextChange}
        ></textarea>
      </div>
      <div className="leaderboard">
        <h2>Leaderboard</h2>
        <ul>
          {leaderboard.map((entry, index) => (
            <li key={index}>
              WPM: {entry.wpm} - Accuracy: {entry.accuracy}%
            </li>
          ))}
        </ul>
      </div>
      <div className="progress">
        <p>WPM: {userData.wpm}</p>
        <p>Accuracy: {userData.accuracy}%</p>
        <p>Tests Completed: {userData.testsCompleted}</p>
      </div>
    </div>
  );
}

export default App;
