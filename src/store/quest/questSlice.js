import { createSlice } from '@reduxjs/toolkit';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../../utils/firebase.utills';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for quests

const initialState = {
  quests: [],  // List of quests
  loading: false,
  error: null,
};

const questSlice = createSlice({
  name: 'quests',
  initialState,
  reducers: {
    setQuests: (state, action) => {
      state.quests = action.payload;
    },
    addQuest: (state, action) => {
      state.quests.push(action.payload);
    },
    completeQuest: (state, action) => {
      const questId = action.payload;
      const quest = state.quests.find(q => q.id === questId);
      if (quest) {
        quest.completed = true;
      }
    },
  },
});

// Thunk to handle quest creation and storing in Firestore
export const createQuest = (questData) => async (dispatch) => {
  const user = auth.currentUser;
  if (user) {
    try {
      // Add a unique ID to each quest
      const questWithId = { ...questData, id: uuidv4() };
      
      // Add quest to Firestore under user's collection
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        quests: arrayUnion(questWithId)
      });

      // Dispatch the quest to the Redux store
      dispatch(addQuest(questWithId));
    } catch (error) {
      console.error('Error creating quest: ', error);
    }
  }
};

export const { setQuests, addQuest, completeQuest } = questSlice.actions;
export default questSlice.reducer;
