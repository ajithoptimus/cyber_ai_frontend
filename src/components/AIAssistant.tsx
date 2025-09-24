import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface AIAssistantProps {
  disabled?: boolean;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ disabled = false }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Welcome to Cyber.AI Assistant! I can help you analyze threats, explain security findings, and provide actionable recommendations. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || disabled || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input; // Store input before clearing
    setInput('');
    setLoading(true);

    try {
      console.log('🤖 Sending message to backend:', currentInput); // DEBUG LOG
      
      // REAL API CALL TO YOUR BACKEND
      const response = await fetch('http://localhost:8000/api/v1/dashboard/frontend/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: currentInput,
          history: messages.slice(-5).map(m => ({ role: m.type, content: m.content }))
        }),
      });

      console.log('🤖 Backend response status:', response.status); // DEBUG LOG
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🤖 Backend response data:', data); // DEBUG LOG
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response || 'Sorry, I\'m having trouble processing your request right now.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('❌ AI Assistant error:', error);
      
      // Fallback to mock response if backend fails
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I'm having trouble connecting to the AI service right now. Here's what I can tell you about "${currentInput}": ${getAIResponse(currentInput)}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Keep the fallback function for error cases
  const getAIResponse = (query: string): string => {
    const responses = [
      "Based on your security analysis, I recommend immediate attention to the critical vulnerabilities identified. These pose significant risks to your infrastructure.",
      "The high risk score indicates several security concerns that require executive-level decision making. Would you like me to prioritize these threats?", 
      "I can help you understand the threat landscape for your organization. The current findings suggest focusing on application security and network monitoring.",
      "The breach check results show potential exposure. I recommend implementing additional monitoring and updating your incident response procedures.",
      "Your DNS configuration has some security implications. I can provide specific recommendations to improve your security posture."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <Bot className="w-5 h-5 mr-2 text-blue-400" />
          AI Assistant
          <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">LIVE</span>
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          {disabled ? 'Complete analysis to enable AI assistant' : 'Ask me anything about your security analysis'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-3 max-w-xs ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-blue-600' 
                  : 'bg-gray-700'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-blue-400" />
                )}
              </div>
              
              <div className={`rounded-lg px-4 py-2 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
              <div className="bg-gray-700 rounded-lg px-4 py-2">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Analyzing with AI...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "Complete analysis first..." : "Ask me anything about security..."}
            disabled={disabled}
            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={sendMessage}
            disabled={disabled || !input.trim() || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg px-4 py-2 transition-colors disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
