import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { db, auth } from '../../utils/firebase.utills';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { completeQuest } from '../../store/quest/questSlice';
import { addExperience } from '../../store/character/characterSlice';
import './quest-detail-page.styles.css';

const QuestDetailPage = () => {
  const { questId } = useParams();
  const quests = useSelector((state) => state.quests.quests);
  const dispatch = useDispatch();
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const selectedQuest = quests.find(q => q.id === questId);
    setQuest(selectedQuest);
    setLoading(false);
  }, [questId, quests]);

  const rewardsByDifficulty = {
    easy: [
      { id: 'potion1', name: 'Potion of Focus', type: 'Potion', rarity: 'Common', isEquipped: false },
      { id: 'scroll1', name: 'Scroll of Minor Boost', type: 'Scroll', rarity: 'Common', isEquipped: false }
    ],
    medium: [
      { id: 'sword1', name: 'Sword of Efficiency', type: 'Weapon', rarity: 'Rare', isEquipped: false },
      { id: 'robe1', name: 'Robe of Focus', type: 'Armor', rarity: 'Uncommon', isEquipped: false },
      { id: 'cape1', name: 'Cape of Focus', type: 'Cape', rarity: 'Uncommon', isEquipped: false }
    ],
    hard: [
      { id: 'axe1', name: 'Axe of Productivity', type: 'Weapon', rarity: 'Epic', isEquipped: false },
      { id: 'cape2', name: 'Cape of Motivation', type: 'Cape', rarity: 'Epic', isEquipped: false },
      { id: 'potion2', name: 'Potion of Motivation', type: 'Potion', rarity: 'Rare', isEquipped: false }
    ],
    legendary: [
      { id: 'blade1', name: 'Blade of Time', type: 'Weapon', rarity: 'Legendary', isEquipped: false },
      { id: 'armor1', name: 'Armor of Immortal Focus', type: 'Armor', rarity: 'Legendary', isEquipped: false },
      { id: 'crystal1', name: 'Crystal of Mastery', type: 'Artifact', rarity: 'Legendary', isEquipped: false }
    ]
  };
  

  const getQuestReward = (difficulty) => {
    const rewardList = rewardsByDifficulty[difficulty.toLowerCase()];
    
    if (!rewardList) {
      console.error(`Invalid difficulty: ${difficulty}`);
      return { id: 'default', name: 'Default Reward', type: 'Misc', rarity: 'Common', isEquipped: false };
    }
  
    const randomIndex = Math.floor(Math.random() * rewardList.length);
    return rewardList[randomIndex];
  };
  
  
  const handleCompleteQuest = async () => {
    const user = auth.currentUser;
    if (user && quest && !quest.completed) {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Ensure inventory is initialized as an array if undefined
        const inventory = Array.isArray(userData.character.inventory)
          ? userData.character.inventory
          : [];
  
        const updatedQuests = userData.quests.map(q => {
          if (q.id === quest.id) {
            return { ...q, completed: true };
          }
          return q;
        });
  
        // Reward distribution logic: XP and Item
        const xpReward = quest.xp;
        const itemReward = getQuestReward(quest.difficulty);
  
        // Update character's experience and add the reward item to inventory
        const updatedCharacter = {
          ...userData.character,
          experience: userData.character.experience + xpReward,
          inventory: [...inventory, itemReward]
        };
        
  
        await updateDoc(userDocRef, {
          quests: updatedQuests,
          character: updatedCharacter
        });
  
        dispatch(completeQuest({ questId }));
        dispatch(addExperience(xpReward));
  
        alert(`Quest completed! You've earned ${xpReward} XP and a ${itemReward}.`);
      }
    }
  };
  

  if (loading || !quest) {
    return <div>Loading quest details...</div>;
  }

  return (
    <div className="quest-detail-page">
      <h2>{quest.name}</h2>
      <p>{quest.description}</p>
      <p>Difficulty: {quest.difficulty}</p>
      <p>XP Reward: {quest.xp}</p>
      <p>Status: {quest.completed ? 'Completed' : 'Incomplete'}</p>
      {quest.completed && quest.completionTime && (
        <p>Completed in: {quest.completionTime} minutes</p>
      )}
      <button onClick={handleCompleteQuest} disabled={quest.completed}>
        {quest.completed ? 'Quest Completed' : 'Complete Quest'}
      </button>
    </div>
  );
};

export default QuestDetailPage;
