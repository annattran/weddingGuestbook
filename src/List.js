const List = (props) => {
    return (
        <ul className="commentsSection" data-aos="zoom-in">
            {props.listItems.map((item, i) => {
                return (
                    <li key={i} className="commentCard">
                        <div className="videoComment">
                            <video width="320" height="240" controls>
                                <source src={item.videoURL} type="video/webm" />
                            </video>
                        </div>
                        <div className="writtenComment">
                            <p>{item.guestComment}</p>
                            <p>— {item.guestName}</p>
                            <p className="timeStamp">{item.timeStamp}</p>
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}

export default List;