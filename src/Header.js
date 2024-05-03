import leaf from './assets/leaf.png';

const Header = () => {
    const openForm = () => {
        document.querySelector('.firstForm').style.display = 'flex';
        document.querySelector('.commentButton').style.display = 'none';
    }

    return (
        <header>
            <img src={leaf} className="left leaf" alt="Green leaves in watercolor - positioned on the top left corner to frame the title." />
            <img src={leaf} className="right leaf" alt="Green leaves in watercolor - positioned on the bottom right corner to frame the title. " />
            <div className="button">
                <button onClick={openForm} className="commentButton"> Add Comment</button>
            </div>
            <div className="title">
                <h1>John ❤ Jane</h1>
                <h2>May 3rd 2024</h2>
                <div className="instructions">
                    <p>Record a video with your well wishes, something funny, words of advice, or maybe date night ideas. When we look back we'll be reminded of all the people who helped celebrate our special day.</p>
                </div>
            </div>
        </header>
    )
}

export default Header;