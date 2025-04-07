import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import diyKeywords from "./diyKeywords";
import { MessageCircle, X } from "lucide-react";

const DIYChatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! Ask me anything about DIY projects!", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatboxRef = useRef(null);

  // Enhanced greeting responses
  const greetingResponses = [
    "Hi there! How can I help with your DIY project today?",
    "Hey! What DIY project are you working on?",
    "Hey! Looking for DIY advice? I'm here to help!",
  ];

  // Common DIY questions and prepared responses
  const commonQuestions = {
    "how can you help":
      "I can help you with:\n\n1. Step-by-step project instructions\n2. Tool recommendations\n3. Material lists\n4. Safety tips\n5. Troubleshooting advice\n\nWhat project are you working on?",
    "what can you do":
      "I'm your DIY expert! I can guide you through:\n\n- Home improvements\n- Crafts and decor\n- Furniture building\n- Repairs and maintenance\n- Woodworking projects\n\nJust ask about any DIY project you have in mind!",
    "what projects":
      "I can help with all kinds of DIY projects:\n\n- **Home repairs**: Fixing leaks, patching walls, electrical work\n- **Furniture**: Building or refinishing pieces\n- **Crafts**: Decorations, gifts, upcycling\n- **Gardening**: Planters, irrigation, landscaping\n- **Electronics**: Basic circuits, smart home setups\n\nWhat are you interested in making?",
    tools:
      "I can help with tools in several ways:\n\n1. Recommend the right tools for specific projects\n2. Explain safe tool usage techniques\n3. Suggest budget-friendly alternatives\n4. Provide tool maintenance tips\n\n**Safety reminder**: Always wear appropriate protective equipment!",
    materials:
      "For materials guidance, I can:\n\n- Help choose optimal materials for durability and function\n- Estimate quantities needed for your project\n- Suggest cost-effective alternatives\n- Explain proper material handling\n- Recommend where to source quality supplies",
  };

  const isDIYRelated = (text) => {
    const lowerText = text.toLowerCase();
    return (
      diyKeywords.some((keyword) => lowerText.includes(keyword)) ||
      /(how to|make|build|create|fix)/i.test(text)
    );
  };

  const isGreeting = (text) => {
    const greetings = ["hello", "hi", "hey", "greetings", "howdy"];
    return greetings.some((greet) => text.toLowerCase().includes(greet));
  };

  const getCommonResponse = (text) => {
    const lowerText = text.toLowerCase();

    for (const [key, response] of Object.entries(commonQuestions)) {
      if (lowerText.includes(key)) {
        return response;
      }
    }
    return null;
  };

  const cleanResponseText = (text) => {
    return text
      .replace(/<li>(.*?)<\/li>/gi, "\n- $1") // Convert <li> to bullet points
      .replace(/<\/?(ul|ol)>/gi, "") // Remove list tags
      .replace(/<h[1-6]>(.*?)<\/h[1-6]>/gi, "**$1**\n") // Convert headers to markdown
      .replace(/<[^>]+>/g, "") // Remove all remaining HTML tags
      .replace(/^\s*\?+\s*/g, "") // Remove unnecessary leading symbols
      .trim();
  };

  const toggleChatbot = () => {
    if (showChatbot) {
      // Closing animation
      setIsAnimating(true);
      setTimeout(() => {
        setShowChatbot(false);
        setIsAnimating(false);
      }, 100);
    } else {
      // Opening with animation
      setShowChatbot(true);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userInput = input.trim();
    setMessages((prev) => [...prev, { text: userInput, sender: "user" }]);
    setInput("");
    setLoading(true);

    try {
      // Handle greetings with variety
      if (isGreeting(userInput)) {
        const randomGreeting =
          greetingResponses[
            Math.floor(Math.random() * greetingResponses.length)
          ];
        setMessages((prev) => [
          ...prev,
          { text: randomGreeting, sender: "bot" },
        ]);
        setLoading(false);
        return;
      }

      // Handle common DIY questions
      const commonResponse = getCommonResponse(userInput);
      if (commonResponse) {
        setMessages((prev) => [
          ...prev,
          { text: commonResponse, sender: "bot" },
        ]);
        setLoading(false);
        return;
      }

      // Check if DIY related
      if (!isDIYRelated(userInput)) {
        setMessages((prev) => [
          ...prev,
          {
            text: "I'm designed to help specifically with DIY projects and home improvements. Could you ask something related to building, making, fixing, or creating?",
            sender: "bot",
          },
        ]);
        setLoading(false);
        return;
      }

      // Using Open Router API with a faster model
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              import.meta.env.VITE_OPENROUTER_API_KEY ||
              "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"
            }`,
            "HTTP-Referer": window.location.origin, // Required by OpenRouter
            "X-Title": "DIY Assistant", // Optional but good practice
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.1-8b-instruct", // Fast and effective for this use case
            messages: [
              {
                role: "system",
                content:
                  "You are a DIY expert assistant who gives concise, helpful, and practical advice. Focus on safety, best practices, and step-by-step solutions. Format your responses with clear structure using markdown formatting where appropriate. Break complex processes into numbered steps. Highlight safety warnings in bold.",
              },
              {
                role: "user",
                content: userInput,
              },
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        }
      );

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      let botResponse =
        data.choices?.[0]?.message?.content ||
        "Sorry, I couldn't process that request.";
      botResponse = cleanResponseText(botResponse);

      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I couldn't connect to my knowledge base. Please try again.",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatboxRef.current &&
        !chatboxRef.current.contains(event.target) &&
        !event.target.closest('[data-chatbot-button="true"]')
      ) {
        if (showChatbot) {
          toggleChatbot();
        }
      }
    };

    if (showChatbot) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showChatbot]);

  useEffect(() => {
    if (showChatbot && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [showChatbot]);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={toggleChatbot}
        className={`fixed bottom-6 right-6 cursor-pointer bg-emerald-500 p-4 rounded-full shadow-lg hover:bg-emerald-600 transition-all duration-300 z-50 ${
          showChatbot ? "rotate-180 scale-90" : "rotate-0 scale-100"
        }`}
        data-chatbot-button='true'
      >
        {showChatbot ? (
          <X className='h-6 w-6 text-white' />
        ) : (
          <MessageCircle className='h-6 w-6 text-white' />
        )}
      </button>

      {/* Chatbot Popup */}
      {(showChatbot || isAnimating) && (
        <div
          ref={chatboxRef}
          className={`fixed bottom-24 right-6 z-40 ${
            showChatbot ? "animate-spring-in" : "animate-spring-out"
          }`}
          style={{
            width: "400px",
            maxWidth: "90vw",
            transformOrigin: "bottom right",
          }}
        >
          <div className='flex flex-col bg-gray-800 rounded-2xl shadow-xl overflow-hidden'>
            {/* Chat Header */}
            <div className='flex justify-between items-center p-4 bg-gradient-to-r from-emerald-600 to-emerald-500'>
              <h3 className='text-white font-mono font-bold'>DIY Assistant</h3>
              <button
                onClick={toggleChatbot}
                className='text-white cursor-pointer transition-transform hover:scale-110'
              >
                <X size={22} />
              </button>
            </div>

            {/* Chat Messages Area */}
            <div className='h-96 overflow-y-auto p-4 bg-gray-900'>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 p-3 max-w-[80%] transition-all duration-200 ${
                    msg.sender === "bot"
                      ? "bg-gray-700 text-white rounded-tr-lg rounded-br-lg rounded-bl-lg self-start"
                      : "bg-emerald-600 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg self-end ml-auto"
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      ul: ({ children }) => (
                        <ul className='list-disc pl-5'>{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className='list-decimal pl-5'>{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className='mb-1'>{children}</li>
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              ))}
              {loading && (
                <div className='bg-gray-700 text-white p-3 rounded-tr-lg rounded-br-lg rounded-bl-lg self-start inline-block'>
                  <div className='flex space-x-2'>
                    <div
                      className='w-2 h-2 bg-emerald-400 rounded-full animate-bounce'
                      style={{ animationDelay: "0s" }}
                    ></div>
                    <div
                      className='w-2 h-2 bg-emerald-400 rounded-full animate-bounce'
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className='w-2 h-2 bg-emerald-400 rounded-full animate-bounce'
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef}></div>
            </div>

            {/* Input Area */}
            <div className='flex items-center bg-gray-700 p-3 gap-2'>
              <textarea
                ref={inputRef}
                className='flex-1 h-10 min-h-10 px-3 py-2 max-h-24 overflow-hidden resize-none rounded-md bg-gray-600 text-white focus:outline-none transition-all duration-200'
                placeholder='Ask about DIY projects...'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                className={`rounded-full p-2 cursor-pointer text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none transition-all duration-200 ${
                  !input.trim() || loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-110"
                }`}
                onClick={handleSendMessage}
                disabled={!input.trim() || loading}
              >
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 32 32'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z'
                    fill='white'
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add these to your global CSS or Tailwind config */}
      <style jsx global>{`
        @keyframes spring-in {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
          }
          50% {
            opacity: 1;
            transform: translateY(-10px) scale(1.05);
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }

        @keyframes spring-out {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translateY(10px) scale(0.95);
          }
          100% {
            opacity: 0;
            transform: translateY(30px) scale(0.8);
          }
        }

        .animate-spring-in {
          animation: spring-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)
            forwards;
        }

        .animate-spring-out {
          animation: spring-out 0.4s cubic-bezier(0.6, -0.28, 0.735, 0.045)
            forwards;
        }
      `}</style>
    </>
  );
};

export default DIYChatbot;
