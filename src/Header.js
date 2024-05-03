import leaf from './assets/leaf.png';

const Header = () => {
    const openForm = () => {
        const firstForm = document.querySelector('.firstForm')
        const commentButton = document.querySelector('.commentButton')

        firstForm.style.display = 'flex';

        if (firstForm.style.display === 'flex') {
            commentButton.style.display = 'none';
        } else {
            commentButton.style.display = 'block';
        }
    }
    return (
        <header>
            <img src={leaf} className="left leaf" alt="Green leaves in watercolor - positioned on the top left corner to frame the title." />
            <img src={leaf} className="right leaf" alt="Green leaves in watercolor - positioned on the bottom right corner to frame the title. " />
            <div className="button">
                <button onClick={openForm} className="commentButton"> Add Comment</button>
            </div>
            <div className="title">
                <h1>Jack ❤ Jill</h1>
                <h2>November 28th 2019</h2>
                <div className="instructions">
                    <p>Record a video with your well wishes, something funny, words of advice, or maybe date night ideas. When we look back we'll be reminded of all the people who helped celebrate our special day.</p>
                </div>
            </div>
        </header>
    )
}

export default Header;