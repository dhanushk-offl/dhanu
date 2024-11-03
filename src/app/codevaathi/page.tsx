"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ChevronDown, Copy, Check, Code2, Loader, Volume2, VolumeX, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function CodeExplainer() {
  // State management
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('english');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Enhanced text-to-speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Ref for the explanation content div
  const explanationRef = useRef<HTMLDivElement>(null);

  const languages = [
    { id: 'english', name: 'English', speechCode: 'en-US', fallbackCode: 'en' },
    { id: 'tamil', name: 'தமிழ்', speechCode: 'ta-IN', fallbackCode: 'ta' },
    { id: 'hindi', name: 'हिन्दी', speechCode: 'hi-IN', fallbackCode: 'hi' },
    { id: 'telugu', name: 'తెలుగు', speechCode: 'te-IN', fallbackCode: 'te' },
  ];

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthesisRef.current = window.speechSynthesis;
      
      const updateVoices = () => {
        const voices = speechSynthesisRef.current?.getVoices() || [];
        setAvailableVoices(voices);
      };

      updateVoices();
      speechSynthesisRef.current?.addEventListener('voiceschanged', updateVoices);

      return () => {
        speechSynthesisRef.current?.removeEventListener('voiceschanged', updateVoices);
        stopSpeaking();
      };
    }
  }, []);

  // Check if voice is available for current language
  const isVoiceAvailable = (languageId: string): boolean => {
    const lang = languages.find(l => l.id === languageId);
    if (!lang) return false;

    return availableVoices.some(voice => 
      voice.lang.toLowerCase() === lang.speechCode.toLowerCase() ||
      voice.lang.toLowerCase().startsWith(lang.fallbackCode.toLowerCase())
    );
  };

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isSpeaking) {
        stopSpeaking();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isSpeaking]);

  const findBestVoiceMatch = (targetLang: string): SpeechSynthesisVoice | null => {
    const currentLang = languages.find(lang => lang.id === targetLang);
    if (!currentLang) return null;

    return availableVoices.find(v => 
      v.lang.toLowerCase() === currentLang.speechCode.toLowerCase() ||
      v.lang.toLowerCase().startsWith(currentLang.fallbackCode.toLowerCase())
    ) || null;
  };

  const getReadableText = (): string => {
    if (!explanationRef.current) return '';

    const walker = document.createTreeWalker(
      explanationRef.current,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parentTag = node.parentElement?.tagName.toLowerCase();
          return (!parentTag || (parentTag !== 'script' && parentTag !== 'style') && node.textContent?.trim())
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      }
    );

    const nodes: Node[] = [];
    let currentNode: Node | null = walker.nextNode();
    while (currentNode) {
      nodes.push(currentNode);
      currentNode = walker.nextNode();
    }

    return nodes
      .map(node => node.textContent)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
    }
  };

  const handleSpeak = () => {
    if (!speechSynthesisRef.current || !explanation || !isVoiceAvailable(language)) return;

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const textToRead = getReadableText();
    if (!textToRead) return;

    try {
      utteranceRef.current = new SpeechSynthesisUtterance(textToRead);
      const voice = findBestVoiceMatch(language);
      if (voice) {
        utteranceRef.current.voice = voice;
      }

      const currentLang = languages.find(lang => lang.id === language);
      utteranceRef.current.lang = currentLang?.speechCode || 'en-US';
      
      utteranceRef.current.rate = 0.9;
      utteranceRef.current.pitch = 1.0;
      utteranceRef.current.volume = 1.0;

      utteranceRef.current.onend = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
      };

      setIsSpeaking(true);
      speechSynthesisRef.current.cancel();
      speechSynthesisRef.current.speak(utteranceRef.current);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
    }
  };

  const handleExplain = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    setError(null);
    stopSpeaking();

    try {
      const response = await fetch(`https://genai-tools.skcript.com/api/ullam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Please break down each line of the following code in ${language} with a friendly, step-by-step explanation. Describe the functionality, purpose, and any interesting logic in easy-to-read bullet points. Imagine you're a coding buddy, guiding someone through the code. Make it fun, point out any bugs or potential improvements, and wrap it up with helpful tips to make the code even better. Here’s the code: ${code}`,
          history: [],
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const explanationText = typeof data.response === 'string'
        ? data.response
        : JSON.stringify(data.response);

      setExplanation(explanationText);
    } catch (error) {
      console.error('Error fetching response:', error);
      setError('Failed to get explanation. Please try again.');
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
    }
  };

  const handleClear = () => {
    setCode('');
    setExplanation('');
    setError(null);
    stopSpeaking();
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
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-800 sticky top-0 z-10 backdrop-blur-md bg-opacity-80 bg-gray-900">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Code2 className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Code வாத்தி
                </h1>
                <p className="text-gray-400">
                  Breaking Down Code, Line by Line, in Your Own Language. 🙌✨
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="appearance-none rounded-lg px-4 py-2 pr-8 bg-gray-800 border-gray-700 focus:border-blue-500 border focus:outline-none transition-colors"
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

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Source Code</h2>
              {code && (
                <button
                  onClick={handleClear}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="relative w-full h-[calc(100vh-300px)] p-4 font-mono text-sm rounded-lg bg-gray-800 border-gray-700 focus:border-blue-500 border focus:outline-none transition-colors resize-none"
            />

            <button
              onClick={handleExplain}
              disabled={isLoading || !code.trim()}
              className={`w-full rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-all duration-300 ${
                isLoading || !code.trim()
                  ? 'bg-gray-700 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90'
              }`}
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isLoading ? 'Analyzing...' : 'Explain Code'}
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Explanation</h2>
              <div className="flex items-center gap-2">
                {explanation && (
                  <>
                    {isVoiceAvailable(language) ? (
                      <button
                        onClick={handleSpeak}
                        className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                        title={isSpeaking ? "Stop reading" : "Read aloud"}
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                    ) : (
                      <div className="relative group">
                        <Info className="w-4 h-4 text-gray-400" />
                        <div className="absolute hidden group-hover:block left-0 top-full mt-1 w-48 p-2 bg-gray-800 rounded-lg shadow-lg text-xs z-50">
                          Text-to-speech is not available for this language in your browser
                        </div>
                      </div>
                    )}
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
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
              className="relative h-[calc(100vh-300px)] rounded-lg p-4 overflow-auto bg-gray-800 border-gray-700 border"
            >
              {error && (
                <div className="text-red-400 mb-4 p-2 rounded bg-red-900/20 border border-red-900">
                  {error}
                </div>
              )}

              {explanation ? (
                <div>
                  {explanation.startsWith('<') ? (
                    parseHTML(explanation)
                  ) : (
                    <ReactMarkdown className="prose prose-invert max-w-none">
                      {explanation}
                    </ReactMarkdown>
                  )}
                </div>
              ) : (
                <div className="text-center mt-8 text-gray-400">
                  Your code explanation will appear here
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4">
        <p className="text-gray-400 text-center">
          Crafted by <a href="/" target="_blank" rel="noopener noreferrer" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Dhanu</a>
        </p>
      </footer>
    </div>
  );
}