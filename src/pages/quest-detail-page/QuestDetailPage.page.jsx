import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { db, auth } from '../../utils/firebase.utills';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { completeQuest } from '../../store/quest/questSlice';
import { addExperience } from '../../store/character/characterSlice';  // Import addExperience action for leveling
import './quest-detail-page.styles.css';  // Optional styling

const QuestDetailPage = () => {
  const { questId } = useParams();  // Get quest ID from URL params
  const quests = useSelector((state) => state.quests.quests);  // Get quests from Redux
  const dispatch = useDispatch();
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the quest from the Redux state by ID
    const selectedQuest = quests.find(q => q.id === questId);
    setQuest(selectedQuest);
    setLoading(false);
  }, [questId, quests]);

  const handleCompleteQuest = async () => {
    const user = auth.currentUser;
    if (user && quest && !quest.completed) {  // Check if quest is not already completed
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedQuests = userData.quests.map(q => {
          if (q.id === quest.id) {
            return { ...q, completed: true };
          }
          return q;
        });

        // Update Firestore with the completed quest
        await updateDoc(userDocRef, { quests: updatedQuests });

        // Dispatch the completeQuest action to update Redux store
        dispatch(completeQuest({ questId }));

        // Reward distribution logic: Only XP is rewarded now
        const xpReward = quest.xp;

        // Update character's experience in Firestore and Redux
        const updatedCharacter = {
          ...userData.character,
          experience: userData.character.experience + xpReward
        };

        await updateDoc(userDocRef, { character: updatedCharacter });

        // Dispatch XP gain to Redux character slice, which handles leveling
        dispatch(addExperience(xpReward));

        // Notify the user of their rewards
        alert(`Quest completed! You've earned ${xpReward} XP.`);
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
      <button onClick={handleCompleteQuest} disabled={quest.completed}>
        {quest.completed ? 'Quest Completed' : 'Complete Quest'}
      </button>
    </div>
  );
};

export default QuestDetailPage;
