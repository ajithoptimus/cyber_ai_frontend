import React, { useState, useEffect, useRef } from 'react';
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
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingText, isTyping]);

  // Typing effect function
  const typeMessage = (text: string, messageId: string) => {
    setIsTyping(true);
    setTypingText('');
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setTypingText(prev => prev + text[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        setTypingText('');
        
        // Add complete message
        const assistantMessage: Message = {
          id: messageId,
          type: 'assistant',
          content: text,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    }, 15); // Typing speed (lower = faster)
  };

  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('threat') || lowerQuery.includes('attack') || lowerQuery.includes('vulnerability')) {
      return "Based on your security analysis, I recommend immediate attention to the critical vulnerabilities identified. These pose significant risks to your infrastructure. I can help you prioritize remediation efforts based on CVSS scores and exploit availability.";
    } else if (lowerQuery.includes('compliance') || lowerQuery.includes('framework') || lowerQuery.includes('nist') || lowerQuery.includes('iso')) {
      return "Your compliance dashboard shows you're at 85% for NIST CSF. The main gaps are in Access Control (AC-2) and Incident Response (IR-4). I can generate a detailed remediation plan with timeline and resource estimates. Would you like me to proceed?";
    } else if (lowerQuery.includes('incident') || lowerQuery.includes('breach') || lowerQuery.includes('malware')) {
      return "I see you have 1 open incident. The malware containment playbook has been executed successfully. All affected systems have been isolated. The MTTR for this incident is 12.5 minutes. Would you like to review the detailed timeline and forensic data?";
    } else if (lowerQuery.includes('risk') || lowerQuery.includes('score')) {
      return "Your overall risk score is 72/100 (Medium-High). The primary risk factors are: unpatched vulnerabilities (35%), weak access controls (25%), insufficient logging (18%), and missing security controls (22%). I recommend focusing on patch management first for maximum risk reduction.";
    } else if (lowerQuery.includes('dashboard') || lowerQuery.includes('summary')) {
      return "Here's your security posture summary: 12 findings analyzed, 3 critical issues detected, compliance at 85%, 1 active incident. Your GitHub security integration detected 2 high-severity vulnerabilities in recent commits. Infrastructure scan shows 6 configuration issues requiring attention.";
    } else if (lowerQuery.includes('help') || lowerQuery.includes('what can') || lowerQuery.includes('assist')) {
      return "I can help you with: threat analysis, compliance gap assessment, incident investigation, risk scoring, security recommendations, and report generation. I also provide context-aware insights based on your current security posture. What would you like assistance with?";
    } else if (lowerQuery.includes('playbook') || lowerQuery.includes('automat') || lowerQuery.includes('soar')) {
      return "Your SOAR platform has 4 active playbooks: Malware Containment, DDoS Mitigation, Data Breach Response, and Account Compromise Response. All playbooks have 0% success rate currently as they haven't been triggered yet. Would you like to test a playbook with a simulated incident?";
    } else if (lowerQuery.includes('github') || lowerQuery.includes('code')) {
      return "The GitHub Security Integration is actively monitoring your repositories. Recent scans detected 2 potential security issues: hardcoded credentials in config files and outdated dependencies with known CVEs. I recommend immediate remediation for the credential exposure.";
    } else {
      return "I'm analyzing your question. Based on your current security environment, I suggest reviewing the compliance dashboard for control gaps, checking the incident response system for any open incidents, and verifying your infrastructure scan results. How can I provide more specific assistance?";
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || disabled || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    // Simulate processing delay (like real AI)
    setTimeout(() => {
      setLoading(false);
      const messageId = (Date.now() + 1).toString();
      const responseText = getAIResponse(currentInput);
      typeMessage(responseText, messageId);
    }, 800); // Thinking delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 flex-shrink-0">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <Bot className="w-5 h-5 mr-2 text-blue-400" />
          AI Assistant
          <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">LIVE</span>
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          {disabled ? 'Complete analysis to enable AI assistant' : 'Ask me anything about your security analysis'}
        </p>
      </div>

      {/* Messages Container with HIDDEN scrollbar */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none',  /* IE and Edge */
        }}
      >
        <style>{`
          .flex-1.overflow-y-auto::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
        `}</style>

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`flex items-start space-x-3 max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
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
              
              <div className={`rounded-lg px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Typing effect message */}
        {isTyping && typingText && (
          <div className="flex justify-start animate-fadeIn">
            <div className="flex items-start space-x-3 max-w-md">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
              <div className="bg-gray-700 text-gray-100 rounded-lg px-4 py-3">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {typingText}<span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse">|</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {loading && !isTyping && (
          <div className="flex justify-start animate-fadeIn">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-400 animate-pulse" />
              </div>
              <div className="bg-gray-700 rounded-lg px-4 py-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700 flex-shrink-0">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "Complete analysis first..." : "Ask me anything about security..."}
            disabled={disabled || loading}
            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={disabled || !input.trim() || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg px-4 py-2 transition-colors disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
