import { createSlice } from "@reduxjs/toolkit";
const statIncrements = {
  Warrior: {
    health: 20,
    mana: 5,
    defense: 10,
    attack: 15,
    stamina: 10,
    focus: 5,
    speed: 8
  },
  Mage: {
    health: 10,
    mana: 20,
    defense: 5,
    attack: 10,
    stamina: 5,
    focus: 15,
    speed: 5
  },
  Rogue: {
    health: 15,
    mana: 10,
    defense: 8,
    attack: 12,
    stamina: 15,
    focus: 10,
    speed: 20
  },
  Healer: {
    health: 12,
    mana: 18,
    defense: 6,
    attack: 8,
    stamina: 8,
    focus: 20,
    speed: 5
  }
};

const initialState = {
  characterName: '',
  characterClass: '',
  level: 1,
  experience: 0,
  skills: [],
  skillPoints: 0,
  canLevelUp: false,
  inventory: [],
  equippedItems: [],
  stats: {
    health: 0,
    mana: 0,
    defense: 0,
    attack: 0,
    stamina: 0,
    focus: 0,
    speed: 0
  }
};

const getXPForNextLevel = (level) => {
  return level * 100;
};

export const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    setInventory: (state, action) => {
      state.inventory = action.payload;
    },
    equipGear: (state, action) => {
      const item = state.inventory.find((gear) => gear.id === action.payload);
      if (item && !item.isEquipped) {
        item.isEquipped = true;
        state.equippedItems.push(item);
        state.inventory = state.inventory.filter((gear) => gear.id !== action.payload);
        calculateStats(state);
      }
    },
    unequipGear: (state, action) => {
      const itemIndex = state.equippedItems.findIndex((gear) => gear.id === action.payload);
      if (itemIndex !== -1) {
        const item = state.equippedItems[itemIndex];

        item.isEquipped = false;

        state.inventory.push(item);

        state.equippedItems.splice(itemIndex, 1);

        calculateStats(state);
      }
    },
    setCharacterInfo: (state, action) => {
      const { characterName, characterClass, skills, stats } = action.payload;
      state.characterName = characterName;
      state.characterClass = characterClass;
      state.skills = skills;
      state.stats = stats;
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

        const classIncrements = statIncrements[state.characterClass];
        state.stats.health += classIncrements.health;
        state.stats.mana += classIncrements.mana;
        state.stats.defense += classIncrements.defense;
        state.stats.attack += classIncrements.attack;
        state.stats.stamina += classIncrements.stamina;
        state.stats.focus += classIncrements.focus;
        state.stats.speed += classIncrements.speed;
      }
    },
    updateSkill: (state, action) => {
      const { skillIndex, newLevel } = action.payload;
      state.skills[skillIndex].level = newLevel;
    },
    spendSkillPoint: (state) => {
      if (state.skillPoints > 0) {
        state.skillPoints -= 1;
      }
    },
  }
});

export const { setCharacterInfo, addExperience, confirmLevelUp, updateSkill, spendSkillPoint, equipGear, unequipGear } = characterSlice.actions;

export default characterSlice.reducer;
