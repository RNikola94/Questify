import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createQuest } from '../../store/quest/questSlice';
import './create-quest-form.styles.css';

const QuestCreation = () => {
  const [questData, setQuestData] = useState({
    name: '',
    description: '',
    difficulty: 'Simple', // default value
    estimatedTime: 'Short', // default value
    type: 'Exploration', // default value
  });
  const [calculatedXP, setCalculatedXP] = useState(0); // for displaying XP
  const [error, setError] = useState(''); // for validation
  const dispatch = useDispatch();

  // Function to calculate XP based on quest attributes
  const calculateXP = ({ difficulty, estimatedTime }) => {
    let baseXP = 10; // base XP for any quest

    // Add XP based on difficulty
    switch (difficulty) {
      case 'Moderate':
        baseXP += 20;
        break;
      case 'Hard':
        baseXP += 50;
        break;
      default:
        baseXP += 0; // for Simple quests
    }

    // Add XP based on estimated time
    switch (estimatedTime) {
      case 'Medium':
        baseXP += 15;
        break;
      case 'Long':
        baseXP += 30;
        break;
      default:
        baseXP += 0; // for Short quests
    }

    return baseXP;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestData({ ...questData, [name]: value });

    // Recalculate XP whenever a relevant input changes
    if (name === 'difficulty' || name === 'estimatedTime') {
      const newXP = calculateXP({ ...questData, [name]: value });
      setCalculatedXP(newXP);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!questData.name || !questData.description) {
      setError('Please fill in all fields');
      return;
    }

    // Clear any existing errors
    setError('');

    // Dispatch quest creation action, including the calculated XP
    dispatch(createQuest({ ...questData, xp: calculatedXP }));

    // Reset form
    setQuestData({
      name: '',
      description: '',
      difficulty: 'Simple',
      estimatedTime: 'Short',
      type: 'Exploration',
    });
    setCalculatedXP(0); // Reset XP display
  };

  return (
    <div className="quest-creation">
      <h2>Create a New Quest</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={questData.name}
          onChange={handleInputChange}
          placeholder="Quest Name"
        />
        <textarea
          name="description"
          value={questData.description}
          onChange={handleInputChange}
          placeholder="Quest Description"
        />
        
        <label>Difficulty</label>
        <select name="difficulty" value={questData.difficulty} onChange={handleInputChange}>
          <option value="Simple">Simple</option>
          <option value="Moderate">Moderate</option>
          <option value="Hard">Hard</option>
        </select>

        <label>Estimated Time</label>
        <select name="estimatedTime" value={questData.estimatedTime} onChange={handleInputChange}>
          <option value="Short">Short (Less than 1 hour)</option>
          <option value="Medium">Medium (1-3 hours)</option>
          <option value="Long">Long (More than 3 hours)</option>
        </select>

        <label>Type</label>
        <select name="type" value={questData.type} onChange={handleInputChange}>
          <option value="Exploration">Exploration</option>
          <option value="Battle">Battle</option>
          <option value="Gathering">Gathering</option>
        </select>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>Calculated XP: {calculatedXP}</p>
        <button type="submit">Create Quest</button>
      </form>
    </div>
  );
};

export default QuestCreation;
