import './css/HomepageNavbar.css';
import logo from './images/openguessr.svg';
import logoWhite from './images/openguessr-white.svg';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DiscordLogo from '../pages/svgs/discordlogo.svg';

export default function HomepageNavbar(props: any) {
    const { session, logout } = useAuth();
    const [ loading, setLoading ] = useState(false);
    const [ username, setUsername ] = useState('');
    const navigate = useNavigate();
    const navbar = useRef<HTMLElement>();
    const logoRef = useRef<HTMLImageElement>();

    useEffect(() => {
        window.onscroll = function () { 
            if (window.scrollY < 740) {
                console.log("top");
                navbar.current.style.backgroundColor = "rgba(255, 255, 255, 0)";
                logoRef.current.src = logoWhite;
            } 
            else {
                navbar.current.style.backgroundColor = "#fff";
                logoRef.current.src = logo;
            }
        };

        if (session) {
            let temp_username = session.user.user_metadata.name.replace('#', '%23');
            setUsername(temp_username);
        }
    }, []);

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
            <div className="HomepageNavbar">
                <nav className="HomepageNavbar--Nav" ref={navbar}>
                    <div className="HomepageNavbar--Container">
                        <img className="HomepageNavbar--Logo w-[180px] h-auto" alt={"Openguess"} src={logoWhite} onClick={() => navigate('/')} ref={logoRef}/>
                        <div>
                            <ul className="HomepageNavbar--Items items-center justify-end">
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
                                    <a href="/login" className="HomepageNavbar--Items--SignUp whitespace-nowrap inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-full shadow-lg text-base font-medium text-black bg-white transition-all">
                                        <img className='HomepageNavbar--Items--Login--Icon' alt={"Discord Login"} src={DiscordLogo}></img>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        )
    } else {
        return (
            <div className="HomepageNavbar">
                <nav className="HomepageNavbar--Nav" ref={navbar}>
                    <div className="HomepageNavbar--Container">
                        <img className="HomepageNavbar--Logo w-[180px] h-auto" alt={"Openguess"} src={logoWhite} onClick={() => navigate('/')} ref={logoRef}/>
                        <div>
                            <ul className="HomepageNavbar--Items items-center justify-end">
                                <li>
                                    <a onClick={() => window.location.href = (`/profile?discordId=${username}`)} className="HomepageNavbar--Items--SignIn whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                                        <img src={session.user.user_metadata.avatar_url} className="HomepageNavbar--Items--Avatar" />
                                    </a>
                                </li>
                                <li>
                                    <button disabled={loading} onClick={() => handleLogout()} id="HomepageNavbar--Items--LogOut" className="HomepageNavbar--Items--SignUp ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-lg text-base font-medium text-black bg-white transition-all">
                                    Sign out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        )
    }   
}