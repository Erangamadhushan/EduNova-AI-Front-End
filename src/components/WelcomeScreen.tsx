import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Sparkles, BookOpen, Brain, GraduationCap } from "lucide-react";
import { assets } from "@/assets/assets";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const suggestions = [
  { icon: BookOpen, text: "Explain photosynthesis step by step" },
  { icon: Brain, text: "Help me solve quadratic equations" },
  { icon: GraduationCap, text: "Summarize the French Revolution" },
  { icon: Sparkles, text: "Quiz me on organic chemistry" },
];

const WelcomeScreen = ({ onGetStarted }: WelcomeScreenProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-6"
      >
        <img src={assets.robotMascot} alt="AI Study Assistant" className="w-40 h-40 object-contain" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Welcome to <span className="text-primary">StudyAI</span>
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-md">
          Your personal AI study companion. Ask questions, get explanations, and ace your exams!
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mb-8"
      >
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={onGetStarted}
            className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-sidebar-accent transition-all text-left group"
          >
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <s.icon className="h-4 w-4" />
            </div>
            <span className="text-sm text-foreground">{s.text}</span>
          </button>
        ))}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Button
          onClick={onGetStarted}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 rounded-full text-base font-semibold shadow-lg shadow-primary/25"
        >
          Get Started
        </Button>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
