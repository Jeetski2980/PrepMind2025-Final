import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  User,
} from "lucide-react";
import Layout from "@/components/Layout";
import ApiKeyNotice from "@/components/ApiKeyNotice";
import { InlineMath, BlockMath } from 'react-katex';

const AppleTouchIcon = ({ className = "w-4 h-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    version="1.1"
    viewBox="0 0 158 156"
    width="60"
    height="60"
    className={className}
  >
    <path fill="#15A858" opacity="1.000000" stroke="none" d="M103.000000,157.000000 C89.645775,157.000000 76.291542,157.000000 62.478050,156.649521 C62.142796,155.351669 62.226795,154.404297 61.816788,153.676392 C58.354218,147.441238 57.095360,140.935867 57.787182,133.959747 C57.996826,131.828506 57.805286,129.598251 57.446373,127.456726 C56.267132,120.307343 55.611267,113.313423 62.143436,107.716682 C63.523159,106.556587 64.287148,104.514305 64.766655,102.707657 C65.305847,100.657631 65.188972,98.432632 65.443497,96.300316 C66.024048,91.327217 66.684944,86.361542 67.406288,81.406807 C67.585999,80.174706 68.019226,78.907104 68.642029,77.822784 C70.580376,74.509026 72.729919,71.327087 74.760895,68.072029 C75.124107,67.481461 75.725639,66.971817 75.892166,66.334816 C77.439240,60.415684 82.047966,57.119347 86.768730,54.089798 C91.171539,51.281399 95.553459,48.398388 99.657326,45.200378 C101.258614,43.936985 102.628708,41.946342 103.276207,39.997158 C104.324852,36.837151 104.434288,33.379604 105.243729,30.125565 C106.292885,25.846432 103.795380,22.385477 102.000565,18.973234 C100.975243,17.000858 99.563850,15.243118 98.328354,13.397339 C96.615120,10.870054 94.818428,8.391239 92.999146,5.532847 C96.218567,5.060964 97.646141,6.829448 98.886353,8.889469 C101.425842,13.109079 104.379662,17.125856 106.370285,21.581017 C107.436707,23.918325 108.189301,27.384663 107.183929,29.552910 C105.365501,33.488297 105.946609,36.905315 107.536018,40.559616 C108.316391,42.374691 108.535934,44.685059 108.550812,46.785309 C108.644722,60.530167 108.611038,74.275909 108.628159,88.021339 C108.631561,90.730461 108.766838,93.439453 108.811630,96.148529 C108.841988,97.972229 108.884499,99.796234 108.868469,101.619659 C108.853584,103.311417 108.747017,105.002396 108.672493,106.693047 C108.579742,108.829277 108.474411,110.965004 108.360016,113.100288 C108.243469,115.270332 108.013412,117.438705 108.007263,119.608345 C107.989159,125.845963 108.108353,132.084290 108.109451,138.322372 C108.109863,140.603897 107.973412,142.885422 107.894287,145.167343 C107.865616,145.999207 108.129387,146.976898 107.794205,147.640747 C106.272446,150.651505 104.574966,153.574936 103.000000,157.000000 z"/>
  </svg>
);

export default AppleTouchIcon;


export default function Tutor() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm here to help you understand SAT, ACT, and AP exam concepts. Try typing or using your voice to ask me anything about test prep!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Check if user is near bottom before auto-scrolling
  const checkScrollPosition = () => {
    if (!messagesContainerRef.current) return;
    
    const container = messagesContainerRef.current;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    setShouldAutoScroll(isNearBottom);
  };

  const scrollToBottom = () => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text) => {
    if (synthRef.current && !isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage = {
          id: Date.now() + 1,
          text: data.response,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error("Failed to get response");
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderMessageContent = (text) => {
    // Split text by highlight markers for explanation highlighting
    const parts = text.split(/(<highlight>.*?<\/highlight>)/g);

    return parts.map((part, index) => {
      // Handle highlighted explanations
      if (part.startsWith('<highlight>') && part.endsWith('</highlight>')) {
        const content = part.slice(11, -12); // Remove <highlight> tags
        return (
          <span key={index} className="bg-yellow-200 dark:bg-yellow-600/30 px-1 py-0.5 rounded">
            {renderTextWithMath(content)}
          </span>
        );
      }

      return <span key={index}>{renderTextWithMath(part)}</span>;
    });
  };

  const renderTextWithMath = (text) => {
    // Handle inline math expressions (single $) and display math (double $$)
    const mathRegex = /(\$\$[^$]+\$\$|\$[^$]+\$)/g;
    const parts = text.split(mathRegex);

    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        // Display math (block)
        const mathContent = part.slice(2, -2);
        try {
          return <BlockMath key={index} math={mathContent} />;
        } catch (error) {
          return <span key={index}>{part}</span>;
        }
      } else if (part.startsWith('$') && part.endsWith('$')) {
        // Inline math
        const mathContent = part.slice(1, -1);
        try {
          return <InlineMath key={index} math={mathContent} />;
        } catch (error) {
          return <span key={index}>{part}</span>;
        }
      } else {
        // Regular text with bold formatting
        return (
          <span
            key={index}
            dangerouslySetInnerHTML={{
              __html: part.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            }}
          />
        );
      }
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Your AI Tutor
            </h1>
            <p className="text-gray-600 dark:text-white/70">
              Ask me anything about test prep. Try typing or using your voice.
            </p>
          </div>

          <ApiKeyNotice />

          {/* Chat Container */}
          <Card className="bg-white dark:bg-black border dark:border-white/30 h-[600px] flex flex-col">
            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 p-6 overflow-y-auto space-y-4"
              onScroll={checkScrollPosition}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] flex items-start space-x-3 ${
                      message.isUser ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.isUser
                          ? "bg-white dark:bg-white text-emerald-600 dark:text-black"
                          : "bg-emerald-400 dark:bg-emerald-400 text-white dark:text-black"
                      }`}
                    >
                      {message.isUser ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <AppleTouchIcon className="w-4 h-4" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`p-4 rounded-2xl ${
                        message.isUser
                          ? "bg-emerald-600 dark:bg-white text-white dark:text-black rounded-br-md"
                          : "bg-white dark:bg-black border dark:border-white/30 text-gray-900 dark:text-white rounded-bl-md"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">
                        {renderMessageContent(message.text)}
                      </div>
                      {!message.isUser && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            isSpeaking
                              ? stopSpeaking()
                              : speakText(message.text)
                          }
                          className="mt-2 p-1 h-6 w-6 hover:bg-gray-100 dark:hover:bg-white/10"
                        >
                          {isSpeaking ? (
                            <VolumeX className="w-3 h-3" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-400 dark:bg-emerald-400 flex items-center justify-center">
                      <AppleTouchIcon className="w-4 h-4 text-white dark:text-black" />
                    </div>
                    <div className="bg-white dark:bg-black border dark:border-white/30 p-4 rounded-2xl rounded-bl-md">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 dark:bg-white/50 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-gray-400 dark:bg-white/50 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 dark:bg-white/50 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t dark:border-white/20">
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="min-h-[60px] pr-12 resize-none dark:bg-black dark:border-white/50 dark:text-white"
                    disabled={isLoading}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={isListening ? stopListening : startListening}
                    className={`absolute bottom-2 right-2 p-2 h-8 w-8 ${
                      isListening
                        ? "text-red-500 dark:text-red-400"
                        : "text-gray-500 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400"
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="h-[60px] bg-emerald-600 dark:bg-emerald-400 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white dark:text-black"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
