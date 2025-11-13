import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Plus } from "lucide-react";
import useHandleStreamResponse from "@/utils/useHandleStreamResponse";

export function ChatInterface({ user }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  // Handle streaming response
  const handleFinish = useCallback(
    (message) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: message, sender: "ai" },
      ]);
      setStreamingMessage("");
      setLoading(false);
      saveCurrentConversation([
        ...messages,
        { role: "user", content: inputValue, sender: "user" },
        { role: "assistant", content: message, sender: "ai" },
      ]);
    },
    [messages, inputValue],
  );

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: handleFinish,
  });

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await fetch("/api/conversations");
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);

        // Load the most recent conversation if exists
        if (data.conversations && data.conversations.length > 0) {
          loadConversation(data.conversations[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  const loadConversation = async (conversationId) => {
    try {
      const response = await fetch(
        `/api/conversations/${conversationId}/messages`,
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setCurrentConversationId(conversationId);
      }
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  };

  const saveCurrentConversation = async (allMessages) => {
    try {
      if (!currentConversationId) {
        // Create new conversation
        const response = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title:
              allMessages[0]?.content.substring(0, 50) + "..." ||
              "New Conversation",
            messages: allMessages,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentConversationId(data.conversation.id);
          loadConversations(); // Refresh conversations list
        }
      } else {
        // Update existing conversation
        await fetch(`/api/conversations/${currentConversationId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: allMessages,
          }),
        });
      }
    } catch (error) {
      console.error("Failed to save conversation:", error);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setStreamingMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: inputValue.trim(),
      sender: "user",
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);

    const conversationMessages = newMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add system message for IGCSE context
    const systemMessage = {
      role: "system",
      content:
        "You are Lunos AI, a helpful study companion specifically designed for IGCSE students. Provide clear, accurate, and educational responses to help students understand their subjects better. Focus on Physics and Mathematics as these are the primary subjects supported. When answering, break down complex concepts into understandable parts and provide examples when helpful.",
    };

    try {
      const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [systemMessage, ...conversationMessages],
          stream: true,
        }),
      });

      setInputValue("");
      handleStreamResponse(response);
    } catch (error) {
      console.error("Chat error:", error);
      setLoading(false);
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          sender: "ai",
        },
      ]);
    }
  };

  const formatMessage = (content) => {
    // Simple formatting for better readability
    return content.split("\n").map((line, index) => (
      <div key={index} className={index > 0 ? "mt-2" : ""}>
        {line}
      </div>
    ));
  };

  return (
    <div className="flex h-full">
      {/* Chat History Sidebar */}
      <div className="hidden sm:block w-64 bg-[#1A1A1A] border-r border-gray-800">
        <div className="p-4">
          <button
            onClick={startNewConversation}
            className="w-full flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black rounded-lg hover:scale-105 transition-all duration-300 font-jetbrains-mono"
          >
            <Plus size={16} />
            <span>New Chat</span>
          </button>
        </div>

        <div className="px-4 pb-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3 font-jetbrains-mono">
            Recent Conversations
          </h3>
          <div className="space-y-1">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => loadConversation(conv.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-jetbrains-mono transition-colors ${
                  currentConversationId === conv.id
                    ? "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black"
                    : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
                }`}
              >
                <div className="truncate">{conv.title}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(conv.updated_at).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-[#1A1A1A] border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white font-jetbrains-mono">
                Ask Lunos
              </h2>
              <p className="text-sm text-gray-400 font-jetbrains-mono">
                Your AI study companion for IGCSE
              </p>
            </div>
            <button
              onClick={startNewConversation}
              className="sm:hidden flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black rounded-lg hover:scale-105 transition-all duration-300"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0A0A0A]">
          {messages.length === 0 && !streamingMessage && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-black font-bold">L</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 font-jetbrains-mono">
                Welcome to Lunos AI!
              </h3>
              <p className="text-gray-400 font-jetbrains-mono">
                Ask me anything about your IGCSE studies. I'm here to help with
                Physics, Mathematics, and more!
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-3xl p-4 rounded-2xl font-jetbrains-mono ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black"
                    : "bg-[#1A1A1A] border border-gray-800 text-white shadow-sm"
                }`}
              >
                {formatMessage(message.content)}
              </div>
            </div>
          ))}

          {streamingMessage && (
            <div className="flex justify-start">
              <div className="max-w-3xl p-4 rounded-2xl bg-[#1A1A1A] border border-gray-800 text-white shadow-sm font-jetbrains-mono">
                {formatMessage(streamingMessage)}
                <span className="inline-block w-2 h-5 bg-[#F59E0B] ml-1 animate-pulse"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-[#1A1A1A] border-t border-gray-800 p-6">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about any IGCSE topic..."
              disabled={loading}
              className="flex-1 px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] disabled:opacity-50 font-jetbrains-mono"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="px-6 py-3 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black rounded-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
