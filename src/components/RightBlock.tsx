import { useInView } from 'react-intersection-observer';
import './css/RightBlock.css';

export default function RightBlock(props: any) {
    const {ref: RightBlockRef, inView: RightBlockIsVisible} = useInView({ threshold: 0.05, rootMargin: '24px', triggerOnce: true });
    /*console.log('RightBlockIsVisible', RightBlockIsVisible);*/
    return (
        <div className='RightBlock'>
            <div ref={RightBlockRef} className={`RightBlock--Container ${RightBlockIsVisible ? 'RightBlock--Appear' : ''}`}>
                <div className="RightBlock--Rightside">
                    <h1 className="RightBlock--Rightside--Title">
                        {props.title}
                    </h1>
                    <div className="RightBlock--Rightside--Subtitle">
                        <p className="RightBlock--Rightside--Subtitle--Line1">
                            {props.subtitleLine1}
                        </p>
                        <p className="RightBlock--Rightside--Subtitle--Line2">
                            {props.subtitleLine2}
                        </p>
                    </div>
                </div>
                <div className="RightBlock--Leftside">
                    <div className="RightBlock--LeftSide--Image">
                        <img className="RightBlock--LeftSide--Image--Img" alt={"Right Block"} src={props.image} />
                    </div>
                </div>
            </div>
        </div>
    )
}