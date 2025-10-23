"use client";

import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import ChatForm from "@/components/ChatForm";

interface Message {
  sender: string;
  message: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<any>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on("message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSendMessage = (msg: string) => {
    if (socket) {
      socket.emit("message", msg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-4 text-center">Chat App</h1>

        <div
          ref={chatContainerRef}
          className="flex flex-col gap-2 overflow-y-auto h-96 border p-2 rounded-md"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg ${
                msg.sender === "You"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200 text-black self-start"
              }`}
            >
              <strong>{msg.sender}: </strong>
              {msg.message}
            </div>
          ))}
        </div>

        <ChatForm onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
