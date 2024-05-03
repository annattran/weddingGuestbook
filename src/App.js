import './App.css';
import firebase from './firebase.js';
import { getDatabase, ref, get, onValue } from 'firebase/database';
import { useState, useEffect } from 'react';
// import components
import Header from './Header.js';
import Form from './Form.js';
import List from './List.js';
import Footer from './Footer.js'

function App() {
  const [comments, setComments] = useState([]);

  const showComments = (snap) => {
    const database = snap.val();
    const commentArray = [];

    for (let key in database) {
      const commentObject = {
        uniqueID: key,
        guestName: database[key].name,
        guestComment: database[key].comment,
        timeStamp: database[key].time,
        videoURL: database[key].video
      }
      commentArray.push(commentObject);
    }
    setComments(commentArray);
  }

  useEffect(() => {
    const database = getDatabase(firebase);
    const dbRef = ref(database);

    get(dbRef).then((snapshot) => {
      if (snapshot.exists()) {
        // console.log(snapshot.val())
        showComments(snapshot)
      } else {
        console.log("No data available")
      }
    }).catch((error) => {
      console.log(error)
    })

    onValue(dbRef, (snapshot) => {
      showComments(snapshot)
    })

  }, [])

  return (
    <div>
      <Header />
      <Form />
      <List listItems={comments} />
      <Footer />
    </div>
  );
}

export default App;
