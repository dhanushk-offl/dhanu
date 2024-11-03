"use client";
import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronDown, Copy, Check, Code2, Loader, Volume2, VolumeX } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function CodeExplainer() {
  // Existing state management
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('english');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  
  // Text-to-speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  
  // Animation states
  const [isHovered, setIsHovered] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  
  // Ref for the explanation content div
  const explanationRef = React.useRef<HTMLDivElement>(null);

  // Initialize speech synthesis and animation effects
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSpeechSynthesis(window.speechSynthesis);
    }

    // Glow animation effect
    const interval = setInterval(() => {
      setShowGlow(prev => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const languages = [
    { id: 'english', name: 'English', speechCode: 'en-US' },
    { id: 'tamil', name: 'தமிழ்', speechCode: 'ta-IN' },
    { id: 'hindi', name: 'हिन्दी', speechCode: 'hi-IN' },
    { id: 'telugu', name: 'తెలుగు', speechCode: 'te-IN' },
  ];

  // Function to extract readable text from HTML/Markdown content
  const getReadableText = (): string => {
    if (!explanationRef.current) return '';

    const walker = document.createTreeWalker(
      explanationRef.current,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          if (!node.parentElement) return NodeFilter.FILTER_ACCEPT;
          const tag = node.parentElement.tagName.toLowerCase();
          if (tag === 'script' || tag === 'style') {
            return NodeFilter.FILTER_REJECT;
          }
          if (!node.textContent?.trim()) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let text = '';
    let node;
    while (node = walker.nextNode()) {
      text += node.textContent + ' ';
    }

    return text.replace(/\s+/g, ' ').trim();
  };

  // Updated handleSpeak function with better error handling
  const handleSpeak = () => {
    if (!speechSynthesis) {
      setError('Speech synthesis not supported in your browser');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = getReadableText();
    
    if (!textToRead) {
      setError('No readable content found');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(textToRead);
      const currentLang = languages.find(lang => lang.id === language);
      utterance.lang = currentLang?.speechCode || 'en-US';
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        setIsSpeaking(false);
        if (event.error !== 'interrupted') {
          setError('Text-to-speech failed. Please try again.');
          setShowError(true);
          setTimeout(() => setShowError(false), 3000);
        }
      };

      setIsSpeaking(true);
      speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Speech synthesis error:', err);
      setError('Failed to initialize speech. Please try again.');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesis && isSpeaking) {
        speechSynthesis.cancel();
      }
    };
  }, [speechSynthesis, isSpeaking]);

  const handleClear = () => {
    if (speechSynthesis && isSpeaking) {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setCode('');
    setExplanation('');
    setError(null);
    setShowError(false);
  };

  // Existing functions remain the same
  const handleExplain = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://genai-tools.skcript.com/api/ullam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Please provide a detailed line-by-line explanation of the following code in ${language}, covering its functionality, logic, and purpose. Explain it like a friendly coding buddy who speaks ${language}. Make it fun, point out any bugs, suggest improvements, and wrap up with helpful tips. Act like a supportive friend! ${code}`,
          history: [],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();

      if (!data || !data.response) {
        throw new Error('Invalid response format from API');
      }

      const explanationText = typeof data.response === 'string'
        ? data.response
        : JSON.stringify(data.response);

      setExplanation(explanationText);
    } catch (error) {
      console.error('Error fetching response:', error);
      setError('Oops! An error occurred. Please try again.');
      setExplanation('');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(explanation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setError('Failed to copy to clipboard');
    }
  };

  const parseHTML = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;

    const traverseNodes = (node: Node): React.ReactNode => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const props: { [key: string]: any } = {};

        Array.from(element.attributes).forEach(attr => {
          props[attr.name === 'class' ? 'className' : attr.name] = attr.value;
        });

        const children = Array.from(element.childNodes).map(traverseNodes);

        return React.createElement(element.tagName.toLowerCase(), props, ...children);
      }

      return null;
    };

    return traverseNodes(div);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_500px_at_50%_50%,#1f2937,transparent)] animate-pulse" />
        <div className="absolute -inset-[10px] opacity-50">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-blue-500/10 to-transparent absolute transform -skew-y-12 animate-[gradient_8s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Header with hover effects */}
      <header className="border-b border-gray-800/50 sticky top-0 z-10 backdrop-blur-md bg-gray-900/80">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 transition-transform duration-300 hover:scale-105"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Code2 className={`w-8 h-8 text-blue-500 transition-all duration-300 ${isHovered ? 'rotate-12' : ''}`} />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent relative">
                  Code வாத்தி
                  {showGlow && (
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-lg -z-10" />
                  )}
                </h1>
                <p className="text-gray-400 animate-pulse">
                  Breaking Down Code, Line by Line, in Your Own Language. 🙌✨
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="appearance-none rounded-lg px-4 py-2 pr-8 bg-gray-800/80 border-gray-700/50 focus:border-blue-500 border focus:outline-none transition-all duration-300 hover:bg-gray-700/80 backdrop-blur-sm"
                >
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content with glass morphism and animations */}
      <main className="container mx-auto p-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4 transform transition-all duration-300 hover:scale-[1.01]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Source Code
              </h2>
              {code && (
                <button
                  onClick={handleClear}
                  className="text-sm text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-200"
                >
                  Clear
                </button>
              )}
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="relative w-full h-[calc(100vh-300px)] p-4 font-mono text-sm rounded-lg bg-gray-800/50 border-gray-700/50 focus:border-blue-500 border focus:outline-none transition-all duration-300 resize-none backdrop-blur-sm hover:bg-gray-800/80"
            />

            <button
              onClick={handleExplain}
              disabled={isLoading || !code.trim()}
              className={`w-full rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] ${
                isLoading || !code.trim()
                  ? 'bg-gray-700/50 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90'
              }`}
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 animate-pulse" />
              )}
              {isLoading ? 'Analyzing...' : 'Explain Code'}
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-4 transform transition-all duration-300 hover:scale-[1.01]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Explanation
              </h2>
              <div className="flex items-center gap-2">
                {explanation && (
                  <>
                    <button
                      onClick={handleSpeak}
                      className="flex items-center gap-1 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                      title={isSpeaking ? "Stop reading" : "Read aloud"}
                    >
                      {isSpeaking ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-1 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div 
              ref={explanationRef}
              className="relative h-[calc(100vh-300px)] rounded-lg p-4 overflow-auto bg-gray-800/50 border-gray-700/50 border backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/80"
            >
              {showError && error && (
                <div className="text-red-400 mb-4 p-2 rounded bg-red-900/20 border border-red-900/50 backdrop-blur-sm animate-fadeIn">
                  {error}
                </div>
              )}

              {explanation ? (
                <div className="animate-fadeIn">
                  {explanation.startsWith('<') ? (
                    parseHTML(explanation)
                  ) : (
                    <ReactMarkdown className="prose prose-invert max-w-none">
                      {explanation}
                    </ReactMarkdown>
                  )}
                </div>
              ) : (
                <div className="text-center mt-8 text-gray-400 animate-pulse">
                  Your code explanation will appear here
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer with animation */}
      <p className="text-gray-400 text-center py-4 animate-fadeIn">
        Crafted by{' '}
        <a 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent hover:scale-110 inline-block transition-transform duration-300"
        >
          Dhanu
        </a>
      </p>
    </div>
  );
}