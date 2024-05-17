import WebSocket from 'isomorphic-ws';
import './App.css';
import { FormEvent, useState } from 'react';
import { Chat } from './Chat';

function App() {
  const [userHasJoined, setUserHasJoined] = useState(false);
  const [ws, setWs] = useState<WebSocket>();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = (e.target as HTMLFormElement).username.value;
    const ws = new WebSocket(`ws://localhost:8089?name=${name}`);
    setUserHasJoined(true);
    setWs(ws);
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>Websocket Demo</h1>
        {!userHasJoined ? (
          <form onSubmit={handleSubmit}>
            <label>
              <input type="text" name="username" />
            </label>
            <button type="submit">Join</button>
          </form>
        ) : (
          <Chat ws={ws} />
        )}
      </header>
    </div>
  );
}

export default App;
