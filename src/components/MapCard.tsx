import React, { useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer';
import Popup from "./Popup";
import './css/MapCard.css';

export default function MapCard(props: any) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        console.log(props);
    }, []);
    const {ref: CardRef, inView: CardIsVisible} = useInView({ threshold: 0, rootMargin: '72px', triggerOnce: true });
    return (
        <div ref={CardRef} className={`MapCard ${CardIsVisible ? 'MapCard--Animate-FadeIn' : ''}`}>
            <div className="MapCard--Container">
                <div className="MapCard--Header">
                    <h1 className="MapCard--Header--Title">
                        {props.title}
                    </h1>
                    <div className="MapCard--Header--Line">&nbsp;</div>
                    <div className="MapCard--Header--Subtitle">
                        <p className="MapCard--Header--Subtitle--Text">
                            {props.description}
                        </p>
                    </div>
                    <button onClick={() => setIsOpen(true)} className="MapCard--Header--Button">
                        <span className="MapCard--Header--Button--Text">
                            Start
                        </span>
                    </button>
                </div>
                <div className="MapCard--Image">
                    <img className="MapCard--Image--Img" src={props.image} alt='' />
                </div>
                {/*
                <div className="Heart--Icon">
                    {isClicked ? <HeartIconFilled onClick={() => setIsClicked(!isClicked)} className="MapCard--Heart--Clicked w-8 h-8" color="rgb(225, 35, 75)"/> : <HeartIcon onClick={() => setIsClicked(!isClicked)} className="w-8 h-8" color="#bbb"/>}
                </div>
                */}
            </div>
            {<Popup IsOpen = {isOpen} setIsOpen={setIsOpen} mapKey={props.mapKey} />}
        </div>
    )
}

/*
<h1 className="MapCard--Header--Title">
    {props.title}
</h1>
<div className="MapCard--Header--Subtitle">
    <p className="MapCard--Header--Subtitle--Text">
        {props.description}
    </p>
</div>
*/