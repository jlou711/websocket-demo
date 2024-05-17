/* eslint-disable react/style-prop-object */
import WebSocket from 'isomorphic-ws';
import { FormEvent, useState } from 'react';

export function Chat({ ws }: { ws: WebSocket | undefined }) {
  const [inputState, setInputState] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (ws) {
      ws.send((e.target as HTMLFormElement).message.value);
    }
    setInputState('');
  }
  if (ws) {
    ws.onopen = () => {
      const message: string = "You've joined the chat!";
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    ws.onclose = () => {
      const message: string = "You've left the chat!";
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    ws.onmessage = (event) => {
      const message: string = event.data.toString();
      setMessages((prevMessages) => [...prevMessages, message]);
    };
  }
  return (
    <form onSubmit={handleSubmit}>
      <ul style={{ listStyle: 'none' }}>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <label>
        <input
          type="text"
          name="message"
          value={inputState}
          onChange={(e) => setInputState(e.target.value)}
        />
      </label>
      <button type="submit">Send</button>
    </form>
  );
}
