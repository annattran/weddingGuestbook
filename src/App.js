import './App.css';
import firebase from './firebase.js';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useState, useEffect } from 'react';
// import components
import Header from './Header.js';
import Form from './Form.js';
import List from './List.js';
import Footer from './Footer.js'

function App() {
  const [comments, setComments] = useState('');

  useEffect(() => {
    const database = getDatabase(firebase);
    const dbRef = ref(database);
    const newComments = [];

    onValue(dbRef, (snapshot) => {
      const database = snapshot.val();

      console.log(database)

      for (let key in database) {
        const commentObject = {
          uniqueID: key,
          guestName: database[key].name,
          guestComment: database[key].comment,
          timeStamp: database[key].time,
          videoURL: database[key].video
        }
        newComments.push(commentObject);
      }
    })

    setComments(newComments);

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
