import { useState, useCallback } from "react";
import { Menu } from "lucide-react";
import ConversationSidebar, { Conversation } from "@/components/ConversationSidebar";
import ChatArea, { ChatMessage } from "@/components/ChatArea";
import WelcomeScreen from "@/components/WelcomeScreen";
import MobileNav from "@/components/MobileNav";

const mockConversations: Conversation[] = [
  { id: "1", title: "What is the value of g on moon?", preview: "The acceleration due to gravity on...", pinned: true, timestamp: new Date() },
  { id: "2", title: "Formula of nickel iodide", preview: "The chemical formula of nickel (II) io...", pinned: true, timestamp: new Date() },
  { id: "3", title: "Earth size and shape", preview: "The Earth is an oblate spheroid...", pinned: false, timestamp: new Date() },
  { id: "4", title: "Quadratic formula explained", preview: "The quadratic formula is x = -b ± √(b²-4ac)/2a...", pinned: false, timestamp: new Date() },
];

const Index = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [mobileTab, setMobileTab] = useState<"home" | "courses" | "ask" | "free" | "downloads">("ask");

  const handleNewChat = useCallback(() => {
    const id = Date.now().toString();
    const newConv: Conversation = {
      id,
      title: "New Chat",
      preview: "Start a conversation...",
      pinned: false,
      timestamp: new Date(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversation(id);
    setMessages((prev) => ({ ...prev, [id]: [] }));
    setShowWelcome(false);
  }, []);

  const handleSend = useCallback(
    (text: string) => {
      if (!activeConversation) return;

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: text,
        timestamp: new Date(),
      };

      setMessages((prev) => ({
        ...prev,
        [activeConversation]: [...(prev[activeConversation] || []), userMsg],
      }));

      // Update conversation title if first message
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation && c.title === "New Chat"
            ? { ...c, title: text.slice(0, 40), preview: text.slice(0, 60) }
            : c
        )
      );

      // Simulate AI response
      setIsLoading(true);
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `That's a great question about "${text.slice(0, 30)}..." Let me help you understand this topic. This is a mock response — connect the AI backend to get real answers!`,
          timestamp: new Date(),
        };
        setMessages((prev) => ({
          ...prev,
          [activeConversation]: [...(prev[activeConversation] || []), aiMsg],
        }));
        setIsLoading(false);
      }, 1200);
    },
    [activeConversation]
  );

  const handleGetStarted = () => {
    setShowWelcome(false);
    handleNewChat();
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
    setShowWelcome(false);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex min-h-0">
        <ConversationSidebar
          conversations={conversations}
          activeId={activeConversation}
          onSelect={handleSelectConversation}
          onNewChat={handleNewChat}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 flex flex-col min-h-0 bg-background">
          {/* Mobile top bar */}
          <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
            <button onClick={() => setSidebarOpen(true)} className="text-foreground">
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-base font-bold text-foreground">StudyAI</h1>
          </div>

          {showWelcome ? (
            <WelcomeScreen onGetStarted={handleGetStarted} />
          ) : activeConversation ? (
            <ChatArea
              messages={messages[activeConversation] || []}
              onSend={handleSend}
              isLoading={isLoading}
              onBack={() => setSidebarOpen(true)}
            />
          ) : (
            <WelcomeScreen onGetStarted={handleGetStarted} />
          )}
        </main>
      </div>

      <MobileNav activeTab={mobileTab} onTabChange={setMobileTab} />
    </div>
  );
};

export default Index;
