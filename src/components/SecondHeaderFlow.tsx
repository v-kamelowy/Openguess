import './css/SecondHeaderFlow.css';

export default function SecondHeaderFlow(props: any) {
    return (
        <div className={`SecHeaderFlow bg-[${props.color}]`}>
            <div className="SecHeaderFlow--Container">
                &nbsp;<br></br>&nbsp;
            </div>
        </div>
    )
}