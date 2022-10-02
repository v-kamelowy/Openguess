import './css/Hero.css';
import LiquidImage from './images/hero_liquid.svg';
import { useAuth } from '../contexts/AuthContext';

export default function Hero() {
    const { session } = useAuth();
    function scrollToMaps() {
        const maps = document.getElementById('Maps');
        maps.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <div className="Hero">
            <div className="Hero--Container Hero--Appear">
                <div className="Hero--Header">
                    <h1 className="Hero--Header--Title">
                        {session !== null || undefined ? 'Welcome back, ' + session.user.user_metadata.full_name : 'Welcome to OpenGuess'}
                    </h1>
                    <div className="Hero--Header--Subtitle">
                        <p className="Hero--Header--Subtitle--Text">
                            {session !== null ? 'You are playing on Early Alpha Build - Errors are expected!' : ' You are playing on Early Alpha Build - Errors are expected!'}
                        </p>
                    </div>
                    <button className="Hero--Header--Button effect01" onClick={() => scrollToMaps()}>
                        <span className="Hero--Header--Button--Text">
                            Play right now!
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}
/*
<img className="Hero--Liquid--Image" src={LiquidImage} />
*/