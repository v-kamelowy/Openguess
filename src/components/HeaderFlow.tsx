import './css/HeaderFlow.css';

export default function HeaderFlow(props: any) {
    return (
        <div className={`HeaderFlow bg-[${props.color}]`}>
            <div className="HeaderFlow--Container">
                &nbsp;<br></br>&nbsp;
            </div>
        </div>
    )
}