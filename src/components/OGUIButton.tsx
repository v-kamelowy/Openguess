export default function UIButton(props: any) {
    return (
        <div className='Openguess--UI--Button' onClick={props.onClicked}>
            <div className="Openguess--UI--Button--Icon">{props.icon}</div>
        </div>
    )
}