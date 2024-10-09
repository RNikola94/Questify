import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  characterName: '',
  characterClass: '',
  level: 1,
  experience: 0,
  skills: [],  // Array of skill objects with { skill, level }
  skillPoints: 0,
  canLevelUp: false
};

const getXPForNextLevel = (level) => {
  return level * 100; // Example XP calculation (you can adjust it)
};

export const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    setCharacterInfo: (state, action) => {
      const { characterName, characterClass, skills } = action.payload;
      state.characterName = characterName;
      state.characterClass = characterClass;
      state.skills = skills;  // Set the skills array with objects
    },
    addExperience: (state, action) => {
      const xpGained = action.payload;
      state.experience += xpGained;

      const nextLevelXP = getXPForNextLevel(state.level);
    
      if (state.experience >= nextLevelXP) {
        state.canLevelUp = true;
      }
    },
    confirmLevelUp: (state) => {
      const nextLevelXP = getXPForNextLevel(state.level);
      if (state.experience >= nextLevelXP) {
        state.level += 1;
        state.experience -= nextLevelXP;
        state.skillPoints += 1;
        state.canLevelUp = false;

        // Skills remain unchanged during leveling up
      }
    },
    updateSkill: (state, action) => {
      const { skillIndex, newLevel } = action.payload;
      state.skills[skillIndex].level = newLevel;  // Update the specific skill level
    },
    spendSkillPoint: (state) => {
      if (state.skillPoints > 0) {
        state.skillPoints -= 1;
      }
    },
  }
});

export const { setCharacterInfo, addExperience, confirmLevelUp, updateSkill, spendSkillPoint } = characterSlice.actions;

export default characterSlice.reducer;
