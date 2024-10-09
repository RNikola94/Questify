import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../utils/firebase.utills';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './skills-page.styles.css'; 

const MAX_SKILL_LEVEL = 5;

const SkillsPage = () => {
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false); // Prevent multiple clicks during upgrade
  const navigate = useNavigate();

  console.log(character);

  useEffect(() => {
    const fetchCharacterData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCharacter(docSnap.data().character);
          setLoading(false);
        } else {
          console.log('No character data found');
        }
      } else {
        navigate('/login');
      }
    };

    fetchCharacterData();
  }, [navigate]);

  const handleSkillUpgrade = async (skillIndex) => {
    if (character.skillPoints > 0 && !upgrading) {
      setUpgrading(true);
  
      const newSkills = [...character.skills];
      const selectedSkill = newSkills[skillIndex];
  
      if (selectedSkill.level < MAX_SKILL_LEVEL) {
        selectedSkill.level += 1;
  
        const updatedCharacter = {
          ...character,
          skills: newSkills,
          skillPoints: character.skillPoints - 1, // Decrement skill points
        };
  
        try {
          const user = auth.currentUser;
          const docRef = doc(db, 'users', user.uid);
          await updateDoc(docRef, {
            'character.skills': newSkills,
            'character.skillPoints': character.skillPoints - 1,  // Update Firestore
          });
          setCharacter(updatedCharacter);
        } catch (error) {
          console.error('Error updating skill level: ', error);
        }
      }
  
      setUpgrading(false);
    } else {
      console.log('Not enough skill points or update in progress');
    }
  };
  

  if (loading) {
    return <div>Loading character...</div>;
  }

  return (
    <div className="skills-page">
      <h2>{character.characterClass} Skill Tree</h2>
      <p>Available Skill Points: {character.skillPoints}</p>
      
      <section className="hex-grid">
        {/* First Row - 3 skills */}
        <div className="hex-row">
          {character.skills.slice(0, 3).map((skill, index) => (
            <div key={index} className="hexagon hexagon-scale">
              <div className="hexagon-in1">
                <div className="hexagon-in2">
                  <h3>{skill.skill}</h3>
                  <p>Level: {skill.level} / {MAX_SKILL_LEVEL}</p>
                  <button
                    onClick={() => handleSkillUpgrade(index)}  // Index is correct here
                    disabled={skill.level >= MAX_SKILL_LEVEL || character.skillPoints === 0 || upgrading}
                  >
                    {skill.level >= MAX_SKILL_LEVEL ? 'Max Level' : 'Upgrade'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Second Row - 4 skills */}
        <div className="hex-row hex-row-offset">
          {character.skills.slice(3, 7).map((skill, index) => (
            <div key={index + 3} className="hexagon hexagon-scale">  {/* Add 3 to index */}
              <div className="hexagon-in1">
                <div className="hexagon-in2">
                  <h3>{skill.skill}</h3>
                  <p>Level: {skill.level} / {MAX_SKILL_LEVEL}</p>
                  <button
                    onClick={() => handleSkillUpgrade(index + 3)}  // Use correct index offset
                    disabled={skill.level >= MAX_SKILL_LEVEL || character.skillPoints === 0 || upgrading}
                  >
                    {skill.level >= MAX_SKILL_LEVEL ? 'Max Level' : 'Upgrade'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Third Row - 3 skills */}
        <div className="hex-row">
          {character.skills.slice(7, 10).map((skill, index) => (
            <div key={index + 7} className="hexagon hexagon-scale">  {/* Add 7 to index */}
              <div className="hexagon-in1">
                <div className="hexagon-in2">
                  <h3>{skill.skill}</h3>
                  <p>Level: {skill.level} / {MAX_SKILL_LEVEL}</p>
                  <button
                    onClick={() => handleSkillUpgrade(index + 7)}  // Use correct index offset
                    disabled={skill.level >= MAX_SKILL_LEVEL || character.skillPoints === 0 || upgrading}
                  >
                    {skill.level >= MAX_SKILL_LEVEL ? 'Max Level' : 'Upgrade'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SkillsPage;
