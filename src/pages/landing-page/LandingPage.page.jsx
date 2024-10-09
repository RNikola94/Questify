import { Link } from "react-router-dom";
import './landing-page.styles.css';

export default function LandingPage() {
    return (
        <div className="landing">
            <section className="hero">
                <h1>Embark on Your Greatest Quest for Productivity!</h1>
                <p>Turn your tasks into epic quests and level up your life with Questify.</p>
                <div className="cta-buttons">
                    <Link to='/register' className="btn-primary">Get started</Link>
                    <Link to='login' className="btn-secondary">Login</Link>
                </div>
            </section>

            <section className="features">
                <h2>Why Questify?</h2>
                <div className="feature-cards">
                <div className="feature-card">
                    <h3>Task Quests</h3>
                    <p>Turn mundane tasks into epic quests and challenges.</p>
                </div>
                <div className="feature-card">
                    <h3>Character Creation</h3>
                    <p>Create and customize your hero avatar.</p>
                </div>
                <div className="feature-card">
                    <h3>Level Up</h3>
                    <p>Earn experience and rewards as you complete quests.</p>
                </div>
                <div className="feature-card">
                    <h3>Collaborative Missions</h3>
                    <p>Team up with others to tackle shared tasks and quests.</p>
                </div>
                </div>
            </section>

            <footer className="landing-footer">
                <p>© 2024 Questify. All Rights Reserved.</p>
                <div className="footer-links">
                    <Link to="/about">About</Link>
                    <Link to="/terms">Terms</Link>
                    <Link to="/privacy">Privacy</Link>
                </div>
            </footer>
        </div>
    );
};