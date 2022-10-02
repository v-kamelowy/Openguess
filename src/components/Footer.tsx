import './css/Footer.css';

export default function Footer() {
    return (
        <div className="Footer">
            <div className="Footer--Container">
                <div className="Footer--Copyright">
                    <p className="Footer--Copyright--Text">
                        <a href="https://github.com/v-kamelowy" target={'_blank'}>GNU GPL v3.0 - 2022 © Kamelowy. No rights reserved.</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

/*
<div className="Footer--Items">
                    <ul>
                        <li>
                            <a href="#" className="Footer--Items--Link">
                                About
                            </a>
                            <div className="Footer--CrossingLine"></div>
                        </li>
                        <li>
                            <a href="#" className="Footer--Items--Link">
                                Terms
                            </a>
                            <div className="Footer--CrossingLine"></div>
                        </li>
                        <li>
                            <a href="#" className="Footer--Items--Link">
                                Privacy
                            </a>
                            <div className="Footer--CrossingLine"></div>
                        </li>
                        <li>
                            <a href="#" className="Footer--Items--Link">
                                Contact
                            </a>
                            <div className="Footer--CrossingLine"></div>
                        </li>
                    </ul>
                </div>
*/