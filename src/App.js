import React, {useState} from 'react';
import './App.css';
import io from 'socket.io-client';

import Chat from './components/Chat';

const socket = io.connect('http://localhost:3001');

function App() {

  const [userName, setUserName] = useState('');
  const [chatRoom, setChatRoom] = useState('');
  const [showChatWindow, setShowChatWindow] = useState(false);

  const joinRoom = (e) => {
    e.preventDefault();
    if(userName !== '' && chatRoom !== '') {
      socket.emit('join_room', chatRoom);
      setShowChatWindow(true);
    }
  }

  const setUserNameInput = (e) => {
    setUserName(e.target.value);
  }

  const setChatRoomInput = (e) => {
    setChatRoom(e.target.value);
  }

  return (
    <div className="App">
      <form onSubmit={joinRoom}>
        {!showChatWindow ?
          (<div className="joinChatContainer">
            <h3>Join a chat</h3>
            <input type="text" placeholder="Username" onChange={setUserNameInput} />
            <input type="text" placeholder="Chatroom Name" onChange={setChatRoomInput} />
            <button type="submit">Join chatroom</button>
          </div>)
        :
          (<Chat socket={socket} user={userName} room={chatRoom} />)
        }
      </form>
    </div>
  );
}

export default App;
