import './Profile.css';
import Navbar from "../components/Navbar";
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useEffect, useState } from 'react';

export default function Profile() {
    const [ userAvatar, setUserAvatar ] = useState('');
    const [ highscores, setHighscores ] = useState([]);
    const navigate = useNavigate();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const discordId = urlParams.get('discordId');
    const profile = decodeURIComponent(discordId);

    useEffect(() => {
        if (discordId == '') {
            navigate('/error')
        }
        async function getUserProfile(fullUsername: string) {
            console.log(profile);
            let { data: profile_data, error } = await supabase
            .from('profiles')
            .select('highscores, avatar_url')
            .eq('username', fullUsername);

            if (profile_data[0] == undefined) {
                navigate('/error')
            } else {
                if (error) {
                    console.log(error);
                } else {
                    setUserAvatar(profile_data[0].avatar_url);
                    setHighscores(profile_data[0].highscores);
                }
            }
        }
        getUserProfile(profile);
    }, []);

    function Profile() {
        return (
            <div className="Profile">
                <div className="Profile--Container">
                    <div className="Profile--Header">
                        <div className="Profile--Header--Avatar">
                            <img src={userAvatar} alt="Avatar" className="Profile--Header--Avatar--Image" />
                        </div>
                        <div className="Profile--Header--Name">
                            <h1>{profile}</h1>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    function HighScores(props: { highscores: any[]; }) {
        if (highscores.length == 0 || null) {
            return (
                <div className="Profile--Highscores">
                    <div className="Profile--Highscores--Header">
                        <h1>Highscores</h1>
                    </div>
                    <p className='Profile--Highscores--NoScores'>Play at least one game to show your highscores.</p>
                </div>
            )
        } else {
            return (
                <div className="Profile--Highscores">
                    <div className="Profile--Highscores--Header">
                        <h1>Highscores</h1>
                    </div>
                    <ul>
                        {props.highscores.map((highscore: any, index) => {
                            let score = highscore.score.toString();
                            score = score.replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
                            score = score + ' points';
                            return (
                                <div key={index} className="Profile--Highscores--Card">
                                    <li className="Profile--Highscores--Item">
                                        <div className="Profile--Highscores--MapName">{highscore.map}</div>
                                        <div className="Profile--Highscores--Score">{score}</div>
                                    </li>
                                </div>
                            )
                        }
                        )}
                    </ul>
                </div>
            )
        }
    }

    return (
        <div>
            <Navbar />
            <Profile />
            <HighScores highscores={highscores}/>
            <div className='Profile--Body'>&nbsp;</div>
        </div>
    )
}