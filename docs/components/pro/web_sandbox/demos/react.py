import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms
import modelscope_studio.components.pro as pro

with gr.Blocks() as demo, ms.Application(), antd.ConfigProvider():
    pro.WebSandbox(value={
        "./index.tsx":
        """import Demo from './demo.tsx'
import "@tailwindcss/browser"

export default Demo
""",
        "./demo.tsx":
        """import { useState, useEffect } from 'react';

export default function App() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', content: 'Hello! I am your AI assistant. How can I help you today?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Simulate AI typing effect
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response after delay
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        sender: 'ai',
        content: 'I am processing your request and will respond shortly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const app = document.documentElement;
    if (darkMode) {
      app.classList.add('dark');
    } else {
      app.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={"min-h-screen flex flex-col transition-colors duration-300 " + (darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900')}>
      {/* Header */}
      <header className={"px-6 py-4 shadow-md flex justify-between items-center " + (darkMode ? 'bg-gray-800' : 'bg-white')}>
        <div className="flex items-center space-x-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
            <path d="M12 4L4 8V16L12 20L20 16V8L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15L9 12H15L12 9V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 className="text-xl font-bold">Chatbot</h1>
        </div>
        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          {darkMode ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2"/>
              <path d="M12 2V4M12 20V22M4 12H2M6.31 6.31L4.9 4.9M17.69 6.31L19.1 4.9M6.31 17.69L4.9 19.1M17.69 17.69L19.1 19.1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={"flex " + (message.sender === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={"max-w-xs sm:max-w-md px-4 py-2 rounded-lg " +
                (message.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : (darkMode ? 'bg-gray-700' : 'bg-white') + ' rounded-bl-none')
              }
            >
              <p>{message.content}</p>
              <span className={"text-xs mt-1 block " + (message.sender === 'user' ? 'text-blue-100' : 'text-gray-500')}>
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className={"px-4 py-2 rounded-lg " + (darkMode ? 'bg-gray-700' : 'bg-white') + ' rounded-bl-none'}>
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className={"p-4 border-t " + (darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className={"flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 " +
              (darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500')
            }
          />
          <button
            onClick={handleSendMessage}
            disabled={inputValue.trim() === ''}
            className={"px-4 py-2 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors " +
              (inputValue.trim() === '' ? 'opacity-50 cursor-not-allowed' : '')
            }
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}"""
    },
                   height=600,
                   template="react",
                   imports={
                       "@tailwindcss/browser":
                       "https://esm.sh/@tailwindcss/browser",
                   })

if __name__ == "__main__":
    demo.queue().launch()
