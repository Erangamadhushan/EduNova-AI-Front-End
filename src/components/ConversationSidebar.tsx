import { Plus, Pin, Clock, MessageSquare, Search, BookOpen, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  pinned: boolean;
  timestamp: Date;
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const ConversationSidebar = ({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  isOpen,
  onClose,
}: ConversationSidebarProps) => {
  const pinned = conversations.filter((c) => c.pinned);
  const recent = conversations.filter((c) => !c.pinned);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-80 bg-card border-r border-sidebar-border flex flex-col transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-bold text-foreground">EduNovaAI</h1>
            </div>
            <button onClick={onClose} className="lg:hidden text-muted-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
          <Button onClick={onNewChat} className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-9 bg-secondary border-none text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          {pinned.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Pin className="h-3 w-3" />
                Pinned
              </div>
              {recent ? pinned.map((c) => (
                <ConversationItem
                  key={c.id}
                  conversation={c}
                  active={c.id === activeId}
                  onClick={() => { onSelect(c.id); onClose(); }}
                />
              )) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">No pinned conversations </div>
              )}
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Clock className="h-3 w-3" />
              Recent
            </div>
            {recent.map((c) => (
              <ConversationItem
                key={c.id}
                conversation={c}
                active={c.id === activeId}
                onClick={() => { onSelect(c.id); onClose(); }}
              />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

const ConversationItem = ({
  conversation,
  active,
  onClick,
}: {
  conversation: Conversation;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full text-left px-3 py-2.5 rounded-lg mb-0.5 transition-colors group",
      active
        ? "bg-sidebar-accent text-sidebar-accent-foreground"
        : "hover:bg-secondary text-foreground"
    )}
  >
    <div className="flex items-start gap-2.5">
      <MessageSquare className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{conversation.title}</p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {conversation.preview}
        </p>
      </div>
    </div>
  </button>
);

export default ConversationSidebar;
