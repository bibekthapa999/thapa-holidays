"use client";

import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Phone,
  Mail,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ChatWidget: React.FC = () => {
  const siteConfig = {
    phone: "+91 9002660557",
    whatsapp: "+919002660557",
    email: "thapa.holidays09@gmail.com",
  };

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      message:
        "Hello! 👋 Welcome to Thapa Holidays. How can I help you plan your perfect trip today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickReplies = [
    "Show me popular packages",
    "What are your best destinations?",
    "I need help with booking",
    "Check availability",
  ];

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user" as const,
      message: message.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "";

      if (message.toLowerCase().includes("package")) {
        botResponse =
          "Great! We have amazing packages for Sikkim, Goa, Kerala, and Rajasthan. Which destination interests you the most? I can show you detailed itineraries and pricing. 🏔️🏖️";
      } else if (message.toLowerCase().includes("destination")) {
        botResponse =
          "Our most popular destinations are:\n\n🏔️ Sikkim - Mountain adventures\n🏖️ Goa - Beach paradise\n🌴 Kerala - Backwater cruises\n🏰 Rajasthan - Royal heritage\n\nWhich one would you like to explore?";
      } else if (
        message.toLowerCase().includes("booking") ||
        message.toLowerCase().includes("book")
      ) {
        botResponse = `I'd love to help you with booking! You can either:\n\n1. Use our quick booking form\n2. Call us at ${siteConfig.phone}\n3. WhatsApp us at ${siteConfig.phone}\n4. Continue chatting here\n\nWhat works best for you? 📞`;
      } else if (
        message.toLowerCase().includes("price") ||
        message.toLowerCase().includes("cost")
      ) {
        botResponse =
          "Our packages start from ₹18,999 per person. Prices vary based on:\n\n• Destination & duration\n• Hotel category\n• Group size\n• Travel dates\n\nShare your preferences and I will get you exact pricing! 💰";
      } else {
        botResponse = `Thanks for your message! Our travel experts are here to help. You can also reach us directly at:\n\n📞 ${siteConfig.phone}\n💬 WhatsApp: ${siteConfig.phone}\n📧 ${siteConfig.email}\n\nWhat specific information do you need about your trip?`;
      }

      const botMessage = {
        id: messages.length + 2,
        type: "bot" as const,
        message: botResponse,
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, botMessage]);
    }, 1500);
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-40 group"
          >
            <MessageCircle className="h-7 w-7" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-xs font-bold text-white">?</span>
            </div>
            <div className="absolute bottom-16 right-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              Chat with us!
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800 text-white p-4 rounded-t-2xl flex items-center justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-transparent"></div>
              <div className="flex items-center space-x-3 relative z-10">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-2 ring-white/30">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Travel Assistant</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-xs text-teal-100">
                      Online • Typically responds instantly
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1 transition-all duration-200 relative z-10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-sm rounded-2xl p-3 shadow-sm ${
                      msg.type === "user"
                        ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white ml-12"
                        : "bg-white text-gray-800 mr-12 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {msg.type === "bot" && (
                        <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bot className="h-3 w-3 text-teal-600" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-line leading-relaxed">
                          {msg.message}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.type === "user"
                              ? "text-teal-100"
                              : "text-gray-500"
                          }`}
                        >
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-200 mr-12">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                        <Bot className="h-3 w-3 text-teal-600" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Replies */}
            {messages.length === 1 && !isTyping && (
              <div className="px-4 pb-2 bg-gray-50/50">
                <p className="text-xs text-gray-600 mb-2 text-center">
                  Quick questions:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickReplies.map((reply, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs bg-white hover:bg-teal-50 text-gray-700 p-3 rounded-xl border border-gray-200 hover:border-teal-300 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {reply}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-gray-200 bg-white"
            >
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-sm transition-all duration-200"
                    disabled={isTyping}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none"
                >
                  <Send className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Contact Options */}
              <div className="flex justify-center items-center space-x-6 mt-4 pt-3 border-t border-gray-100">
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 text-xs font-medium transition-colors group"
                >
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                    <Phone className="h-3 w-3" />
                  </div>
                  <span>Call</span>
                </a>
                <div className="w-px h-6 bg-gray-300"></div>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-green-600 hover:text-green-700 text-xs font-medium transition-colors group"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <MessageCircle className="h-3 w-3" />
                  </div>
                  <span>WhatsApp</span>
                </a>
                <div className="w-px h-6 bg-gray-300"></div>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors group"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Mail className="h-3 w-3" />
                  </div>
                  <span>Email</span>
                </a>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
