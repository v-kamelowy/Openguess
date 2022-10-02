import { useInView } from 'react-intersection-observer';
import './css/LeftBlock.css';

export default function LeftBlock(props: any) {
    const {ref: LeftBlockRef, inView: LeftBlockIsVisible} = useInView({ threshold: 0.05, rootMargin: '24px', triggerOnce: true });
    /*console.log('LeftBlockIsVisible', LeftBlockIsVisible);*/
    return (
        <div className='LeftBlock'>
            <div ref={LeftBlockRef} className={`LeftBlock--Container ${LeftBlockIsVisible ? 'LeftBlock--Appear' : ''}`}>
                <div className="LeftBlock--Rightside">
                    <h1 className="LeftBlock--Rightside--Title">
                        {props.title}
                    </h1>
                    <div className="LeftBlock--Rightside--Subtitle">
                        <p className="LeftBlock--Rightside--Subtitle--Line1">
                            {props.subtitleLine1}
                        </p>
                        <p className="LeftBlock--Rightside--Subtitle--Line2">
                            {props.subtitleLine2}
                        </p>
                    </div>
                </div>
                <div className="LeftBlock--Leftside">
                    <div className="LeftBlock--LeftSide--Image">
                        <img className="LeftBlock--LeftSide--Image--Img" alt={"Left Block"} src={props.image} />
                    </div>
                </div>
            </div>
        </div>
    )
}