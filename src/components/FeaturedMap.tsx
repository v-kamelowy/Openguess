import React, { useState } from "react";
import Popup from "./Popup";
import './css/FeaturedMap.css';
import FeaturedMapStripImage from './images/NewStrip.svg';
import { useInView } from 'react-intersection-observer';

export default function FeaturedMap(props: any) {
    const [isOpen, setIsOpen] = useState(false);
    const {ref: FeaturedMapRef, inView: FeaturedMapIsVisible} = useInView({ threshold: 0, rootMargin: '72px', triggerOnce: true });
    return (
        <div ref={FeaturedMapRef} className={`FeaturedMap ${FeaturedMapIsVisible ? 'FeaturedMap--Animate-FadeIn' : ''}`}>
            <div className="FeaturedMap--Container">
                <div className="FeaturedMap--Header">
                    <h1 className="FeaturedMap--Header--Title">
                        {props.title}
                    </h1>
                    <div className="FeaturedMap--Header--Line">&nbsp;</div>
                    <div className="FeaturedMap--Header--Subtitle">
                        <p className="FeaturedMap--Header--Subtitle--Text">
                            {props.description}
                        </p>
                    </div>
                    <button onClick={() => setIsOpen(true)} className="FeaturedMap--Header--Button">
                        <span className="FeaturedMap--Header--Button--Text">
                            Start
                        </span>
                    </button>
                </div>
                <div className="FeaturedMap--Image">
                    <img className="FeaturedMap--Image--Img" src={props.image} alt='' />
                </div>
                <div className="FeaturedMap--Strip">
                    <img className="FeaturedMap--Strip--Image" alt={"NEW!"} src={FeaturedMapStripImage} />
                </div>
            </div>
            {<Popup IsOpen = {isOpen} setIsOpen={setIsOpen} />}
        </div>
    )
}