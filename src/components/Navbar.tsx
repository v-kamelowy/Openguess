import './css/Navbar.css';
import logo from './images/openguessr.svg';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DiscordLogo from '../pages/svgs/discordlogo.svg';

export default function Navbar() {
    const { session, logout } = useAuth();
    const [ loading, setLoading ] = useState(false);
    const [ username, setUsername ] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (session) {
            let temp_username = session.user.user_metadata.name.replace('#', '%23');
            setUsername(temp_username);
        }
    }, [])

    async function handleLogout() {
        try {
            setLoading(true);
            await logout();
            navigate('/redirect');
        } catch (error) {
            alert(error);
        }
        setLoading(false);
    }
    if (session === null) {
        return (
            <div className="Navbar">
                <nav className="Navbar--Nav">
                    <div className="Navbar--Container">
                        <img className="Navbar--Logo w-[180px] h-auto" src={logo} alt={"Openguess"} onClick={() => navigate('/')} />
                        <ul>
                            <div className="Navbar--Items items-center justify-end">
                                {
                                /*
                                <li>
                                    <a href="/login" className="Navbar--Items--SignIn whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                                    Sign in
                                    </a>
                                </li>
                                */
                                }
                                <li>
                                    <a href="/login" className="Navbar--Items--SignUp whitespace-nowrap inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-full shadow-lg text-base font-medium text-black bg-white transition-all">
                                        <img className='Navbar--Items--Login--Icon' src={DiscordLogo}></img>
                                    </a>
                                </li>
                            </div>
                        </ul>
                    </div>
                </nav>
            </div>
        )
    } else {
        return (
            <div className="Navbar">
                <nav className="Navbar--Nav">
                    <div className="Navbar--Container">
                        <img className="Navbar--Logo w-[180px] h-auto" src={logo} alt={"Openguess"} onClick={() => navigate('/')} />
                        <ul>
                            <div className="Navbar--Items items-center justify-end">
                                <li>
                                    <a onClick={() => window.location.href = (`/profile?discordId=${username}`)} className="Navbar--Items--SignIn whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                                        <img src={session.user.user_metadata.avatar_url} className="Navbar--Items--Avatar" />
                                    </a>
                                </li>
                                <li>
                                    <button disabled={loading} onClick={() => handleLogout()} id="Navbar--Items--LogOut" className="Navbar--Items--SignUp ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-rose-600 hover:bg-black transition-all">
                                    Sign out
                                    </button>
                                </li>
                            </div>
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }   
}