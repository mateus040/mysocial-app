import './App.css';
import { db, auth } from './firebase.js';
import { useEffect, useState } from 'react';
import Header from './Header';
import Post from './Post';

function App() {

  const [user, setUser] = useState();

  useEffect(() => {



  }, [])


  return (
    <div className="App">
      <div className='header'>
        <div className='center'>
          <div className='header__logo'>
            <a href=''><img src={process.env.PUBLIC_URL + '/images/logo.png'}></img></a>
          </div>

          {
            (user) ?
              <div>Olá</div>
              :
              <div className='header__loginForm'>
                <form>
                  <input type='text' placeholder='E-mail:' />
                  <input type='password' placeholder='Senha:' />
                  <input type='submit' name='acao' value='Entrar' />
                </form>
              </div>
          }

        </div>
      </div>
    </div>
  );
}

export default App;
