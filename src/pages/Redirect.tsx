import { useEffect } from "react";

export default function Redirect() {

    useEffect(() => {
        setTimeout(() => {
            window.location.href = 'https://www.openguess.pl/';
        }, 1000);
    }, []);

    return (
        <div className="Redirect">
            <div className="Redirect--Container">
                <div className="Redirect--Header">
                    <h1 className="Redirect--Header--Title">
                        Redirecting...
                    </h1>
                    <div className="Redirect--Header--Subtitle">
                        <p className="Redirect--Header--Subtitle--Text">
                            Welcome! You'll be redirected to OpenGuess website in a second.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}