import { useState, useEffect } from "react";
import socket from "./socket.js";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });
  }, []);

  const sendMessage = () => {
    const data = {
      text: message,
    };

    socket.emit("sendMessage", data);

    setMessages((prev) => [...prev, data]);

    setMessage("");
  };

  return (
    <div>
      <h2>Chat App</h2>

      {messages.map((msg, i) => (
        <p key={i}>{msg.text}</p>
      ))}

      <input value={message} onChange={(e) => setMessage(e.target.value)} />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
