import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCharacterInfo } from '../../store/character/characterSlice';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../utils/firebase.utills';
import { doc, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import './character-creation.styles.css';

const CharacterCreation = () => {
  const [characterData, setCharacterData] = useState({
    characterName: '',
    characterClass: ''
  });
  const [selectedClass, setSelectedClass] = useState('');
  const [hoveredSkill, setHoveredSkill] = useState(null);
  
  const classes = ['Warrior', 'Mage', 'Rogue', 'Healer'];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const defaultSkills = {
    Warrior: ['Sword Mastery', 'Shield Block', 'Berserker Rage', 'War Cry', 'Battle Tactics', 'Endurance', 'Weapon Expertise', 'Charge', 'Armor Mastery', 'Fury'],
    Mage: ['Fireball', 'Ice Shard', 'Arcane Blast', 'Mana Shield', 'Teleport', 'Lightning Bolt', 'Spell Mastery', 'Enchanting', 'Summon Elemental', 'Mystic Shield'],
    Rogue: ['Stealth', 'Backstab', 'Lock Picking', 'Dual Wield', 'Evasion', 'Poison Dagger', 'Shadow Step', 'Agility Boost', 'Critical Hit', 'Ambush'],
    Healer: ['Healing Touch', 'Revive', 'Purify', 'Mana Regeneration', 'Barrier', 'Blessing', 'Holy Light', 'Group Heal', 'Cleanse', 'Resurrection']
  };

  const skillDescriptions = {
    Warrior: {
      'Sword Mastery': 'Increases your sword damage by 10%. Damage: +10%. Mana: None.',
      'Shield Block': 'Blocks 20% of incoming damage. Damage: N/A. Mana: 15.',
      'Berserker Rage': 'Boosts attack speed by 15%. Damage: N/A. Mana: 20.',
      'War Cry': 'Reduces enemy damage by 10%. Damage: N/A. Mana: 25.',
      'Battle Tactics': 'Increases party damage by 5%. Damage: N/A. Mana: 20.',
      'Endurance': 'Increases health regeneration by 20%. Damage: N/A. Mana: 15.',
      'Weapon Expertise': 'Boosts weapon damage by 15%. Damage: +15%. Mana: None.',
      'Charge': 'Deals 30 damage and stuns the enemy. Damage: 30. Mana: 30.',
      'Armor Mastery': 'Increases armor rating by 10%. Damage: N/A. Mana: None.',
      'Fury': 'Boosts damage by 20%, takes 5% more damage. Damage: +20%. Mana: 40.'
    },
    Mage: {
      'Fireball': 'Deals 50 fire damage over 5 seconds. Damage: 50. Mana: 30.',
      'Ice Shard': 'Deals 40 frost damage and slows enemy. Damage: 40. Mana: 25.',
      'Arcane Blast': 'Deals 60 arcane damage. Damage: 60. Mana: 35.',
      'Mana Shield': 'Absorbs 50 damage using mana. Damage: N/A. Mana: 15 (per hit).',
      'Teleport': 'Instantly move to a short distance. Damage: N/A. Mana: 20.',
      'Lightning Bolt': 'Deals 45 lightning damage. Damage: 45. Mana: 30.',
      'Spell Mastery': 'Increases all spell damage by 10%. Damage: +10%. Mana: None.',
      'Enchanting': 'Adds 15 magic damage to weapon for 1 minute. Damage: 15. Mana: 25.',
      'Summon Elemental': 'Summons an elemental that deals 30 damage per hit. Damage: 30 (per hit). Mana: 50.',
      'Mystic Shield': 'Increases magical defense by 20%. Damage: N/A. Mana: 30.'
    },
    Rogue: {
      'Stealth': 'Makes you invisible for 10 seconds. Damage: N/A. Mana: 20.',
      'Backstab': 'Deals 70 damage from behind. Damage: 70. Mana: 25.',
      'Lock Picking': 'Increases lock picking success by 15%. Damage: N/A. Mana: None.',
      'Dual Wield': 'Increases attack speed by 10%. Damage: +10%. Mana: None.',
      'Evasion': 'Increases dodge chance by 25% for 10 seconds. Damage: N/A. Mana: 15.',
      'Poison Dagger': 'Deals 50 poison damage over 5 seconds. Damage: 50. Mana: 20.',
      'Shadow Step': 'Teleports behind enemy and deals 40 damage. Damage: 40. Mana: 25.',
      'Agility Boost': 'Increases agility by 20% for 15 seconds. Damage: N/A. Mana: 15.',
      'Critical Hit': 'Next attack has 50% increased critical chance. Damage: N/A. Mana: 10.',
      'Ambush': 'Deals 60 damage from stealth. Damage: 60. Mana: 30.'
    },
    Healer: {
      'Healing Touch': 'Restores 40 health to a single target. Damage: N/A. Mana: 25.',
      'Revive': 'Revives ally with 30% health. Damage: N/A. Mana: 50.',
      'Purify': 'Cleanses all negative effects. Damage: N/A. Mana: 20.',
      'Mana Regeneration': 'Increases mana regeneration by 25%. Damage: N/A. Mana: 10.',
      'Barrier': 'Absorbs 60 damage. Damage: N/A. Mana: 30.',
      'Blessing': 'Increases allies’ health by 10%. Damage: N/A. Mana: 20.',
      'Holy Light': 'Heals 40 or deals 40 damage to undead. Damage: 40 or Heal: 40. Mana: 25.',
      'Group Heal': 'Heals all allies for 30 health. Damage: N/A. Mana: 35.',
      'Cleanse': 'Removes poisons and diseases. Damage: N/A. Mana: 15.',
      'Resurrection': 'Revives ally with full health. Damage: N/A. Mana: 60.'
    }
  };

  const classBaseStats = {
    Warrior: {
      health: 150,
      mana: 50,
      defense: 20,
      attack: 25,
      stamina: 100,
      focus: 60,
      speed: 50
    },
    Mage: {
      health: 100,
      mana: 150,
      defense: 10,
      attack: 30,
      stamina: 70,
      focus: 80,
      speed: 40
    },
    Rogue: {
      health: 120,
      mana: 70,
      defense: 15,
      attack: 35,
      stamina: 90,
      focus: 70,
      speed: 80
    },
    Healer: {
      health: 110,
      mana: 130,
      defense: 12,
      attack: 20,
      stamina: 80,
      focus: 90,
      speed: 40
    }
  };
  
  

  const handleClassClick = (className) => {
    setSelectedClass(className);
    setCharacterData({ 
      ...characterData, 
      characterClass: className,
      stats: classBaseStats[className]
     });
  };

  const handleCreateCharacter = async () => {
    const user = auth.currentUser;
    
    if (user) {
      if (!characterData.stats) {
        console.error("Character stats not set!");
        return;
      }
  
      const skills = defaultSkills[characterData.characterClass].map(skill => ({ skill, level: 0 }));
  
      console.log("Character Data ", characterData);
  
      dispatch(setCharacterInfo({
        characterName: characterData.characterName,
        characterClass: characterData.characterClass,
        skills,
        stats: characterData.stats
      }));
  
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          character: {
            characterName: characterData.characterName,
            characterClass: characterData.characterClass,
            level: 1,
            experience: 0,
            skillPoints: 0,
            skills: skills,
            stats: characterData.stats,
            inventory: [],
            equippedItems: [],
          }
        });
  
        console.log("Character successfully saved to Firestore!");
  
        navigate('/skills');
      } catch (error) {
        console.error("Error updating Firestore: ", error);
      }
    } else {
      alert('User not authenticated');
    }
  };
  

  return (
    <div className="character-creation-container">
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        Create Your Character
      </motion.h2>

      <motion.input 
        type="text"
        placeholder="Character Name"
        onChange={(e) => setCharacterData({ ...characterData, characterName: e.target.value })}
        className="character-input"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      />

      <motion.h3 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        Select Class
      </motion.h3>

      <div className="class-buttons-container">
        {classes.map((className, index) => (
          <motion.button
            key={index}
            onClick={() => handleClassClick(className)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`class-button ${selectedClass === className ? 'selected' : ''}`}
          >
            {className}
          </motion.button>
        ))}
      </div>

      {selectedClass && (
        <div className="skills-container">
          <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            Starting Skills for {selectedClass}
          </motion.h3>
          <ul className="skills-list">
            {defaultSkills[selectedClass].map((skill, index) => (
              <motion.li
                key={index}
                className="skill-item"
                onMouseEnter={() => setHoveredSkill(skill)}
                onMouseLeave={() => setHoveredSkill(null)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {skill}
              </motion.li>
            ))}
          </ul>
          {hoveredSkill && (
            <div className="skill-description">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {skillDescriptions[selectedClass][hoveredSkill]}
              </motion.p>
            </div>
          )}
        </div>
      )}

      <motion.button
        onClick={handleCreateCharacter}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="create-character-button"
        disabled={!characterData.characterName || !characterData.characterClass}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Create Character
      </motion.button>
    </div>
  );
};

export default CharacterCreation;
