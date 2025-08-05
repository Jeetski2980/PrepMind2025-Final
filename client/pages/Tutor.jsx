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
  <span
    className={className}
    dangerouslySetInnerHTML={{
      __html: `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     width="100%" viewBox="0 0 158 156" enable-background="new 0 0 158 156" xml:space="preserve">
<path fill="#15A858" opacity="1.000000" stroke="none" 
    d="
M103.000000,157.000000 
    C89.645775,157.000000 76.291542,157.000000 62.538467,156.654449 
    C64.704575,153.138580 67.089706,149.799927 69.869354,146.830582 
    C77.194603,139.005432 84.691208,131.340683 92.558411,123.603378 
    C106.421623,124.563599 115.007309,118.066345 117.368752,105.208290 
    C117.567474,104.126236 117.784225,102.701050 118.527603,102.121483 
    C123.489571,98.252953 125.001488,92.761810 126.393494,86.929153 
    C128.751984,85.475807 131.014755,84.348167 132.742462,82.669739 
    C139.979980,75.638695 147.019089,68.403770 154.226532,61.341167 
    C155.595016,60.000195 157.397675,59.102322 159.000000,58.000004 
    C159.000000,72.020897 159.000000,86.041786 158.639572,100.556404 
    C156.402267,102.326485 154.275925,103.350349 152.688126,104.919266 
    C140.273697,117.185989 127.850647,129.448303 115.677505,141.952667 
    C111.114311,146.640030 107.206581,151.965485 103.000000,157.000000 
z"/>
<path fill="#12B372" opacity="1.000000" stroke="none" 
    d="
M1.000000,99.000000 
    C1.000000,89.979103 1.000000,80.958214 1.345908,71.398666 
    C4.269099,68.858780 7.014689,67.037079 9.384937,64.815010 
    C13.111993,61.320942 16.547857,57.518566 20.175776,53.915977 
    C27.092640,47.047398 34.079395,40.249203 40.997169,33.381527 
    C47.787373,26.640507 54.662010,19.976368 61.236382,13.029395 
    C64.775894,9.289287 67.763420,5.026795 71.000000,1.000000 
    C79.687561,1.000000 88.375130,1.000000 97.461464,1.345440 
    C96.488144,3.712402 95.371132,5.980341 93.698608,7.711628 
    C87.377327,14.255024 80.820778,20.570873 74.483406,27.099186 
    C73.047546,28.578310 72.138466,30.568804 70.560043,32.340244 
    C60.539062,31.994377 55.298515,35.342430 51.535034,44.138313 
    C51.105045,45.143276 50.525085,46.384853 49.656601,46.854313 
    C42.008057,50.988758 38.940910,57.835941 37.639595,66.078674 
    C35.759125,67.383965 34.078693,68.478355 32.682899,69.860252 
    C24.038296,78.418793 15.517627,87.103577 6.800293,95.586624 
    C5.238559,97.106384 2.951931,97.881218 1.000000,99.000000 
z"/>
<path fill="#15AC60" opacity="1.000000" stroke="none" 
    d="
M159.000000,57.531345 
    C157.397675,59.102322 155.595016,60.000195 154.226532,61.341167 
    C147.019089,68.403770 139.979980,75.638695 132.742462,82.669739 
    C131.014755,84.348167 128.751984,85.475807 126.295876,86.531578 
    C124.634613,82.351089 123.385460,78.504143 122.204834,74.636269 
    C121.754440,73.160721 120.884720,71.505150 121.193382,70.157806 
    C122.753189,63.349060 120.462288,57.554115 117.087845,51.637398 
    C117.682251,50.474548 118.063187,49.508125 118.735687,48.831474 
    C128.977722,38.526203 139.241074,28.241859 149.558884,18.012569 
    C150.452042,17.127060 151.763672,16.663626 153.048935,16.316883 
    C155.144638,20.419750 157.072327,24.209873 159.000000,27.999998 
    C159.000000,37.687561 159.000000,47.375122 159.000000,57.531345 
z"/>
<path fill="#11B576" opacity="1.000000" stroke="none" 
    d="
M70.531349,1.000000 
    C67.763420,5.026795 64.775894,9.289287 61.236382,13.029395 
    C54.662010,19.976368 47.787373,26.640507 40.997169,33.381527 
    C34.079395,40.249203 27.092640,47.047398 20.175776,53.915977 
    C16.547857,57.518566 13.111993,61.320942 9.384937,64.815010 
    C7.014689,67.037079 4.269099,68.858780 1.345908,70.930008 
    C1.000000,62.312435 1.000000,53.624874 1.359918,44.443581 
    C3.003362,43.271778 4.547101,42.855110 5.530834,41.875862 
    C17.589491,29.872250 29.586309,17.806149 41.536026,5.693960 
    C42.887814,4.323792 43.854656,2.573843 45.000000,1.000000 
    C53.354233,1.000000 61.708466,1.000000 70.531349,1.000000 
z"/>
<!-- ...rest of your SVG paths... -->
</svg>
      `,
    }}
  />
);


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
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  
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
