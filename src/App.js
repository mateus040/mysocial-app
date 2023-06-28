import './App.css';
import { db, auth } from './firebase.js';
import { useEffect, useState } from 'react';
import Header from './Header';
import Post from './Post';

function App() {

  const [user, setUser] = useState();

  const [posts, setPosts] = useState([]);

  useEffect(() => {

    // Configurando login
    auth.onAuthStateChanged(function (val) {
      if (val != null) {
        setUser(val.displayName);
      }
    })

    // Ordenando o timestamp em ordem decrescente
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
      setPosts(snapshot.docs.map((document) => {
        return { id: document.id, info: document.data() } // Atualizando de forma automática
      }))
    })

  }, [])


  return (
    <div className="App">

      <Header setUser={setUser} user={user}></Header>

      {
        posts.map(function (val) {

          return (

            <Post user={user} info={val.info} id={val.id} />

          )

        })
      }

    </div>
  );
}

export default App;
