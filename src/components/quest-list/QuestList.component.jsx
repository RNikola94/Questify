import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db, auth } from '../../utils/firebase.utills';
import { doc, onSnapshot } from 'firebase/firestore';
import { setQuests } from '../../store/quest/questSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom'; // Import Link from React Router

const QuestList = () => {
  const dispatch = useDispatch();
  const quests = useSelector((state) => state.quests.quests);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeFromFirestore = null;

    // Listen to authentication state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is authenticated, set up real-time listener on their quests
        const userDocRef = doc(db, 'users', user.uid);
        
        unsubscribeFromFirestore = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            dispatch(setQuests(userData.quests || []));
          } else {
            console.log('No user data found');
          }
          setLoading(false);  // Stop loading spinner
        }, (error) => {
          console.error("Error fetching quests: ", error);
          setLoading(false);  // Stop loading even if there's an error
        });
      } else {
        setLoading(false);  // Stop loading if no user
      }
    });

    // Clean up listener on component unmount
    return () => {
      if (unsubscribeFromFirestore) unsubscribeFromFirestore();
      unsubscribeAuth();
    };
  }, [dispatch]);

  if (loading) {
    return <div>Loading quests...</div>;
  }

  return (
    <div>
      <h2>Your Quests</h2>
      {quests.length === 0 ? (
        <p>No quests available</p>
      ) : (
        quests.map((quest) => (
          <div key={quest.id}>
            <h3>{quest.name}</h3>
            <p>Difficulty: {quest.difficulty}</p>
            <p>Experience: {quest.xp}</p>
            {/* Link to the quest detail page */}
            <Link to={`/quests/${quest.id}`}>View Details</Link>
          </div>
        ))
      )}
    </div>
  );
};

export default QuestList;
