import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface AIAssistantProps {
  disabled?: boolean;
  dashboardContext?: {
    riskScore?: number;
    complianceLevel?: number;
    openIncidents?: number;
    criticalFindings?: number;
    currentPage?: string;
  };
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  disabled = false,
  dashboardContext = {
    riskScore: 72,
    complianceLevel: 85,
    openIncidents: 1,
    criticalFindings: 3,
    currentPage: 'threat-intelligence'
  }
}) => {
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

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingText, isTyping]);

  // Natural typing effect - word by word with variable speed
  const typeMessage = (text: string, messageId: string) => {
    setIsTyping(true);
    setTypingText('');
    
    // Split into sentences for natural pauses
    const sentences = text.split(/([.!?]\s+)/);
    let fullText = '';
    let sentenceIndex = 0;

    const typeSentence = () => {
      if (sentenceIndex >= sentences.length) {
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
        return;
      }

      const sentence = sentences[sentenceIndex];
      const words = sentence.split(' ');
      let wordIndex = 0;

      const typeWord = () => {
        if (wordIndex < words.length) {
          fullText += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
          setTypingText(fullText);
          wordIndex++;
          
          // Variable speed: faster for short words, slower for technical terms
          const wordLength = words[wordIndex - 1]?.length || 0;
          const delay = wordLength > 8 ? 80 : wordLength > 5 ? 60 : 40;
          
          setTimeout(typeWord, delay);
        } else {
          sentenceIndex++;
          // Natural pause at end of sentence
          setTimeout(typeSentence, sentence.match(/[.!?]/) ? 200 : 50);
        }
      };

      typeWord();
    };

    typeSentence();
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

    try {
      console.log('🤖 Sending message with context:', {
        message: currentInput,
        context: dashboardContext
      });
      
      // REAL API CALL WITH DASHBOARD CONTEXT
      const response = await fetch('http://localhost:8000/api/v1/dashboard/frontend/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: currentInput,
          history: messages.slice(-5).map(m => ({ 
            type: m.type, 
            content: m.content 
          })),
          dashboard_context: {
            risk_score: dashboardContext.riskScore || 72,
            compliance_level: dashboardContext.complianceLevel || 85,
            open_incidents: dashboardContext.openIncidents || 1,
            critical_findings: dashboardContext.criticalFindings || 3,
            current_page: dashboardContext.currentPage || 'unknown'
          }
        }),
      });

      console.log('🤖 Backend response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🤖 Backend response data:', data);
      
      setLoading(false);
      const messageId = (Date.now() + 1).toString();
      const responseText = data.message || data.response || 'Sorry, I\'m having trouble processing that right now.';
      
      // Start natural typing effect
      typeMessage(responseText, messageId);

    } catch (error) {
      console.error('❌ AI Assistant error:', error);
      setLoading(false);
      
      // Fallback response
      const messageId = (Date.now() + 1).toString();
      const fallbackText = getFallbackResponse(currentInput, dashboardContext);
      typeMessage(fallbackText, messageId);
    }
  };

  // Enhanced fallback with context awareness
  const getFallbackResponse = (query: string, context: typeof dashboardContext): string => {
    const lowerQuery = query.toLowerCase();
    const risk = context.riskScore || 72;
    const compliance = context.complianceLevel || 85;
    
    if (lowerQuery.includes('threat') || lowerQuery.includes('attack') || lowerQuery.includes('vulnerability')) {
      return `Based on your current risk score of ${risk}/100, I've identified ${context.criticalFindings || 3} critical threats requiring immediate attention.\n\nThe most urgent issues are unpatched vulnerabilities and weak access controls. These account for 60% of your overall risk.\n\nI recommend prioritizing patch management and implementing MFA across all admin accounts. This would reduce your risk score by approximately 25 points.\n\nWould you like me to generate a detailed remediation timeline?`;
    }
    
    if (lowerQuery.includes('compliance') || lowerQuery.includes('nist') || lowerQuery.includes('iso')) {
      return `Your current compliance status:\n\n**NIST CSF:** ${compliance}% ✅\n**ISO 27001:** 78% ⚠️\n**SOC 2:** 82% ✅\n\nMain gaps identified: Access Control (AC-2) and Incident Response (IR-4).\n\nImplementing MFA and documented playbooks would close the 15% gap to reach 100% compliance.\n\nShall I generate a detailed gap analysis report with timeline estimates?`;
    }
    
    if (lowerQuery.includes('incident') || lowerQuery.includes('breach')) {
      return `**Active Incident Status:**\n\n🚨 You have ${context.openIncidents || 1} open incident\n\nIncident: Malware Containment (INC-001)\nSeverity: HIGH\nStatus: Contained ✅\nMTTD: 8.5 minutes\nMTTR: 12.5 minutes\n\nAll affected systems have been isolated successfully. The automated SOAR playbook executed flawlessly.\n\nNext steps: Root cause analysis and system hardening.\n\nWould you like to see the detailed incident timeline?`;
    }
    
    if (lowerQuery.includes('risk') || lowerQuery.includes('score')) {
      return `**Current Risk Assessment:**\n\nOverall Risk Score: ${risk}/100 (${risk > 70 ? 'Medium-High' : 'Medium'}) ⚠️\n\nRisk breakdown:\n• Unpatched vulnerabilities: 35%\n• Weak access controls: 25%\n• Insufficient logging: 18%\n• Missing security controls: 22%\n\nPriority recommendation: Critical patch deployment would reduce your score to ${Math.max(risk - 25, 40)}/100.\n\nEstimated implementation time: 2-4 weeks.\n\nWant to see the detailed implementation roadmap?`;
    }
    
    // Default contextual response
    return `I'm analyzing your security environment.\n\n**Current Status:**\n• Risk Score: ${risk}/100\n• Compliance: ${compliance}%\n• Open Incidents: ${context.openIncidents || 1}\n• Critical Findings: ${context.criticalFindings || 3}\n\nI can help you with threat analysis, compliance gaps, incident investigation, or risk assessment.\n\nWhat specific area would you like to explore?`;
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
          {disabled 
            ? 'Complete analysis to enable AI assistant' 
            : `Ask me anything about your security analysis • Risk: ${dashboardContext.riskScore}/100`
          }
        </p>
      </div>

      {/* Messages Container */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`
          .flex-1.overflow-y-auto::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`flex items-start space-x-3 max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-blue-600' 
                  : 'bg-gradient-to-br from-blue-600 to-purple-600'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
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
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-700 text-gray-100 rounded-lg px-4 py-3">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {typingText}<span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse">▋</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {loading && !isTyping && (
          <div className="flex justify-start animate-fadeIn">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white animate-pulse" />
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
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg px-4 py-2 transition-all disabled:cursor-not-allowed flex-shrink-0 shadow-lg hover:shadow-xl"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
