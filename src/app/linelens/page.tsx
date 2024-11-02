"use client";
import React, { useState } from 'react';
import { Sparkles, ChevronDown, Copy, Check, Code2, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function CodeExplainer() {
  // State management
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('english');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Language options
  const languages = [
    { id: 'english', name: 'English' },
    { id: 'tamil', name: 'தமிழ்' },
    { id: 'hindi', name: 'हिन्दी' },
    { id: 'telugu', name: 'తెలుగు' },
  ];

  // Main function to handle code explanation
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

      // Validate response data
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

  // Function to handle copying explanation to clipboard
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

  // Clear function to reset the form
  const handleClear = () => {
    setCode('');
    setExplanation('');
    setError(null);
  };

 // Function to safely parse and render HTML
const parseHTML = (html: string) => {
  const div = document.createElement('div');
  div.innerHTML = html;

  // Sanitize and convert the HTML elements to React elements
  const traverseNodes = (node: Node): React.ReactNode => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const props: { [key: string]: any } = {};

      // Handle attributes, converting 'class' to 'className'
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


  // Render component
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 sticky top-0 z-10 backdrop-blur-md bg-opacity-80 bg-gray-900">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Code2 className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  LineLens
                </h1>
                <p className="text-gray-400">
                Code Explanation Made Simple in our own language by lines. 🙌✨
                </p>

              </div>
            </div>

            {/* Language Selector */}
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

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
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

          {/* Output Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Explanation</h2>
              {explanation && (
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
              )}
            </div>

            <div className="relative h-[calc(100vh-300px)] rounded-lg p-4 overflow-auto bg-gray-800 border-gray-700 border">
              {error && (
                <div className="text-red-400 mb-4 p-2 rounded bg-red-900/20 border border-red-900">
                  {error}
                </div>
              )}

              {explanation ? (
                // Determine if the explanation is HTML or Markdown and render accordingly
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
      <p className="text-gray-400 text-center">
                  Crafted by <a href="/" target="_blank" rel="noopener noreferrer" className='text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent'>Dhanu</a>
                </p>
    </div>
  );
}
