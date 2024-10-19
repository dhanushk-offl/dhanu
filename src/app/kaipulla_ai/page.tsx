"use client";
import React, { useEffect, useRef, useState } from "react";
import { Send, Trash2, Sparkles, User } from "lucide-react";

interface Message {
  message: string;
  sender: "model" | "user";
}

const ChatMessage = ({ message, sender }: Message) => {
  const isUser = sender !== "model";

  return (
    <div className={`flex p-2 ${isUser ? "justify-end" : "justify-start"} items-end`}>
      {!isUser && (
        <div className="relative mr-2">
          <div className="w-12 h-12 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex-shrink-0">
          <img 
              src="/avatar.jpg" 
              alt="AI Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-yellow-300 rounded-full w-6 h-6 flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles size={14} className="text-black" />
          </div>
        </div>
      )}
      <div
        className={`max-w-[70%] p-4 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black ${
          isUser
            ? "bg-yellow-300 transform rotate-1"
            : "bg-pink-300 transform -rotate-1"
        }`}
      >
        <div 
          className="text-base font-bold prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: message.replace(/'/g, "&rsquo;") }} // Escape single quotes
        />
        <time className="text-xs font-mono mt-2 block">
          {new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </time>
      </div>
      {isUser && (
        <div className="w-12 h-12 rounded-full border-4 border-black bg-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex-shrink-0 ml-2 flex items-center justify-center">
          <User size={24} className="text-white" />
        </div>
      )}
    </div>
  );
};

export default function Conversation() {
  const newMessage = useRef<HTMLTextAreaElement>(null);
  const messageArea = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isTyping) return;
    const message = newMessage.current?.value;
    if (!message) return;
    newMessage.current!.value = "";
    adjustTextareaHeight();
    
    const userMessage = { message, sender: "user" as const };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch(`https://genai-tools.skcript.com/api/ullam`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, history: messages }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from API');
      }

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: data.response.replace(/'/g, "&rsquo;"), sender: "model" as const }, // Escape single quotes
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: "Oops! My circuits got a bit tangled. Let's try that again, shall we?", sender: "model" as const },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (messageArea.current) {
      messageArea.current.scrollTop = messageArea.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const storedMessages = localStorage.getItem("messages");
    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages));
      } catch (error) {
        console.error("Error parsing stored messages:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem("messages");
  };

  const adjustTextareaHeight = () => {
    if (newMessage.current) {
      newMessage.current.style.height = 'auto';
      newMessage.current.style.height = `${newMessage.current.scrollHeight}px`;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-400 to-blue-400 font-sans">
      <header className="bg-yellow-300 shadow-[0_4px_0px_0px_rgba(0,0,0,1)] border-b-4 border-black p-4">
        <h1 className="text-3xl font-extrabold text-center text-black transform -rotate-2">
          KAIPULLA: Dhanu&apos;s Quirky AI Buddy {/* Escape apostrophe */}
        </h1>
      </header>

      <main className="flex-grow overflow-y-auto p-4 space-y-6" ref={messageArea}>
        {messages.length ? (
          <div className="space-y-6">
            {messages.map((message, idx) => (
              <ChatMessage key={idx} {...message} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black rounded-lg p-8 max-w-md text-center transform rotate-2">
              <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-24 h-24 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                  <img 
                    src="/avatar.jpg" 
                    alt="AI Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-300 rounded-full w-8 h-8 flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Sparkles size={18} className="text-black" />
                </div>
              </div>
              <p className="text-2xl font-bold text-black">
                Naan Dan! Kaipulla, your quirky AI pal. Let&apos;s chat about anything and everything - I promise it&apos;ll be a hoot! 🦉 {/* Escape apostrophe */}
              </p>
            </div>
          </div>
        )}
        {isTyping && (
          <div className="flex items-center space-x-2 p-4 bg-white rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
            <div className="w-4 h-4 bg-black rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-black rounded-full animate-bounce delay-100"></div>
            <div className="w-4 h-4 bg-black rounded-full animate-bounce delay-200"></div>
          </div>
        )}
      </main>

      <footer className="bg-green-300 shadow-[0_-4px_0px_0px_rgba(0,0,0,1)] border-t-4 border-black p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <textarea
            disabled={isTyping}
            className="flex-grow p-3 border-4 border-black rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-300 font-bold text-lg resize-none overflow-hidden"
            placeholder="Tell me something wacky..."
            ref={newMessage}
            onInput={adjustTextareaHeight} // Adjust height on input
          />
          <button
            type="submit"
            className={`p-3 bg-blue-500 text-white rounded-full hover:bg-blue-700 transition ${
              isTyping ? "opacity-50 cursor-not-allowed" : "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black"
            }`}
            disabled={isTyping}
          >
            <Send size={24} />
          </button>
          <button
            type="button"
            onClick={clearMessages}
            className={`p-3 bg-red-500 text-white rounded-full hover:bg-red-700 transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black`}
          >
            <Trash2 size={24} />
          </button>
        </form>
      </footer>
    </div>
  );
}
