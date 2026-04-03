import { useState, useCallback, useEffect } from "react";
import { Menu } from "lucide-react";
import ConversationSidebar, {
  Conversation,
} from "@/components/ConversationSidebar";
import ChatArea, { ChatMessage } from "@/components/ChatArea";
import WelcomeScreen from "@/components/WelcomeScreen";
import MobileNav from "@/components/MobileNav";
import { askQuestion, getConversations, getMessages } from "@/services/chatApi";

const Index = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null,
  );
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [mobileTab, setMobileTab] = useState<
    "home" | "courses" | "ask" | "free" | "downloads"
  >("ask");

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

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await getConversations();

        const mapped = res.data.map((c: any) => ({
          id: c.id.toString(),
          title: c.title,
          preview: "Click to view messages...",
          pinned: false,
          timestamp: new Date(),
        }));

        setConversations(mapped);
      } catch (err) {
        console.error("Failed to load conversations");
      }
    };

    fetchConversations();
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
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

      setIsLoading(true);

      try {
        const res = await askQuestion({ question: text });
        console.log("API Response:", res.data); // ✅ log the response

        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: res.data, // ✅ typed as string
          timestamp: new Date(),
        };

        setMessages((prev) => ({
          ...prev,
          [activeConversation]: [...(prev[activeConversation] || []), aiMsg],
        }));
      } catch (error) {
        const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "⚠️ Server is busy. Please try again.",
          timestamp: new Date(),
        };

        setMessages((prev) => ({
          ...prev,
          [activeConversation]: [...(prev[activeConversation] || []), errorMsg],
        }));
      }

      setIsLoading(false);
    },
    [activeConversation],
  );

  const handleGetStarted = () => {
    setShowWelcome(false);
    handleNewChat();
  };

  const handleSelectConversation = async (id: string) => {
    const convId = Number(id); // convert properly

    setActiveConversation(id);
    setShowWelcome(false);

    try {
      const res = await getMessages(convId);

      setMessages((prev) => ({
        ...prev,
        [id]: res.data,
      }));
    } catch (err) {
      console.error("Failed to load messages");
    }
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
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-base font-bold text-foreground">EduNovaAI</h1>
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

      <div className="fixed bottom-0 left-0 flex">
        <MobileNav activeTab={mobileTab} onTabChange={setMobileTab} />
      </div>
    </div>
  );
};

export default Index;
