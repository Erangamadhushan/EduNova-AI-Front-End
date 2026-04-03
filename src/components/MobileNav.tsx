import { Home, BookOpen, MessageSquareText, GraduationCap, Download } from "lucide-react";
import { cn } from "../lib/utils";

type Tab = "home" | "courses" | "ask" | "free" | "downloads";

interface MobileNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; icon: typeof Home; label: string }[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "courses", icon: BookOpen, label: "My Courses" },
  { id: "ask", icon: MessageSquareText, label: "Ask Now" },
  { id: "free", icon: GraduationCap, label: "Free Courses" },
  { id: "downloads", icon: Download, label: "Downloads" },
];

const MobileNav = ({ activeTab, onTabChange }: MobileNavProps) => {
  return (
    <nav className="lg:hidden border-t border-border bg-card flex items-center justify-around py-1.5 px-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-lg transition-colors min-w-0",
            activeTab === tab.id
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <tab.icon className="h-5 w-5" />
          <span className="text-[10px] font-medium truncate">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default MobileNav;
