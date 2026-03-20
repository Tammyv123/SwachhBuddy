import { useState, useRef, useEffect, MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, User, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const BUBBLE_SIZE = 56;
const CHATBOX_WIDTH = 384;
const CHATBOX_HEIGHT = 500;
const VIEWPORT_PADDING = 24;

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const SYSTEM_PROMPT = `You are EcoBuddy, an expert waste management assistant for India's Swachh Bharat mission.

Your rules:
1. Always answer in short, crisp 2-3 bullet points. No long paragraphs.
2. Connect every prompt to waste management, recycling, or disposal.
3. For example, if asked about "momo chutney", explain how to dispose of its ingredients (food scraps, containers).
4. Only if a topic is impossible to connect to waste, briefly say you specialize in waste management.
5. Be friendly, use occasional emojis, keep it practical for Indian citizens.`;

const FALLBACK_RESPONSES: Record<string, string> = {
  plastic: "• Plastic bottles go in the **Blue (Dry Waste)** bin ♻️\n• Rinse before disposing to avoid contamination\n• Earn +15 pts per verified dry waste disposal on Swachh Buddy!",
  wet: "• Food scraps, peels, and organic waste → **Green (Wet Waste)** bin 🌱\n• Can be composted at home to make fertilizer\n• Never mix wet and dry waste — it ruins recycling!",
  compost: "• Collect fruit/vegetable peels, tea leaves, garden waste 🌿\n• Add dry leaves, turn weekly in a covered container\n• Ready in 60 days — great natural fertilizer for plants!",
  points: "• QR scan: +25 pts | Learning module: +100 pts 🏆\n• Report issue: +50 pts | E-Waste drive: +75 pts\n• Redeem points for rewards in the Earn section!",
  ewaste: "• Phones, cables, batteries → **Yellow (E-Waste)** bin ⚡\n• Never throw in regular garbage — causes soil pollution\n• Join our monthly E-Waste Day drive for +75 pts!",
  hazardous: "• Chemicals, paint, medical waste → **Red (Hazardous)** bin ☣️\n• Keep separate from all other waste categories\n• Dispose at designated collection centers only",
  default: "• I specialize in waste management and recycling tips ♻️\n• Ask me about segregation, composting, or how to earn points\n• Or ask about disposing any specific item!",
};

const getFallback = (query: string) => {
  const q = query.toLowerCase();
  if (q.includes("plastic") || q.includes("dry") || q.includes("recycl")) return FALLBACK_RESPONSES.plastic;
  if (q.includes("compost") || q.includes("food") || q.includes("organic") || q.includes("vegetable")) return FALLBACK_RESPONSES.compost;
  if (q.includes("wet") || q.includes("fruit") || q.includes("kitchen")) return FALLBACK_RESPONSES.wet;
  if (q.includes("point") || q.includes("earn") || q.includes("reward") || q.includes("coin")) return FALLBACK_RESPONSES.points;
  if (q.includes("ewaste") || q.includes("e-waste") || q.includes("phone") || q.includes("battery") || q.includes("electronic")) return FALLBACK_RESPONSES.ewaste;
  if (q.includes("hazard") || q.includes("chemical") || q.includes("paint") || q.includes("medical")) return FALLBACK_RESPONSES.hazardous;
  return FALLBACK_RESPONSES.default;
};

const WasteChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your waste management assistant. I can help you with segregation guidelines, disposal methods, recycling tips, and any other waste-related questions. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [chatboxPosition, setChatboxPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const wasDragged = useRef(false);
  const [showGreetingBubble, setShowGreetingBubble] = useState(false);
  const [showMessageDot, setShowMessageDot] = useState(false);

  useEffect(() => {
    const initialX = window.innerWidth - BUBBLE_SIZE - VIEWPORT_PADDING;
    const initialY = window.innerHeight - BUBBLE_SIZE - VIEWPORT_PADDING;
    setPosition({ x: initialX, y: initialY });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreetingBubble(true);
      setShowMessageDot(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showGreetingBubble) {
      const dismissTimer = setTimeout(() => setShowGreetingBubble(false), 60000);
      return () => clearTimeout(dismissTimer);
    }
  }, [showGreetingBubble]);

  useEffect(() => {
    if (isOpen) {
      const idealX = position.x - CHATBOX_WIDTH + BUBBLE_SIZE;
      const idealY = position.y - CHATBOX_HEIGHT + BUBBLE_SIZE;
      setChatboxPosition({
        x: Math.max(VIEWPORT_PADDING, Math.min(idealX, window.innerWidth - CHATBOX_WIDTH - VIEWPORT_PADDING)),
        y: Math.max(VIEWPORT_PADDING, Math.min(idealY, window.innerHeight - CHATBOX_HEIGHT - VIEWPORT_PADDING)),
      });
    }
  }, [isOpen, position]);

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      wasDragged.current = true;
      setPosition({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    };
    const handleMouseUp = () => {
      setIsDragging(false);
      setTimeout(() => {
        if (!wasDragged.current) {
          setIsOpen(true);
          setShowMessageDot(false);
          setShowGreetingBubble(false);
        }
      }, 0);
    };
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    wasDragged.current = false;
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    setIsDragging(true);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), content: inputMessage, sender: "user", timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    const query = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      if (!GEMINI_API_KEY) {
        await new Promise(r => setTimeout(r, 800));
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          content: getFallback(query),
          sender: "bot",
          timestamp: new Date(),
        }]);
        return;
      }

      // Build conversation for Gemini
      const history = messages.slice(-6).map(m => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));
      history.push({ role: "user", parts: [{ text: query }] });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: history,
            generationConfig: { temperature: 0.7, maxOutputTokens: 200 },
          }),
        }
      );

      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || getFallback(query);

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: reply,
        sender: "bot",
        timestamp: new Date(),
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: getFallback(query),
        sender: "bot",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "How do I segregate wet and dry waste?",
    "Where can I dispose of electronic waste?",
    "What items can be recycled?",
    "How to compost at home?",
  ];

  if (!isOpen) {
    return (
      <div className="fixed z-50" style={{ top: position.y, left: position.x }}>
        {showGreetingBubble && (
          <div className="absolute bottom-0 right-full mr-4 w-max max-w-[250px] bg-card text-card-foreground p-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-left-2 duration-500">
            <p className="text-sm font-medium">Hello! 👋</p>
            <p className="text-sm text-muted-foreground">Need help with waste management?</p>
            <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-card" />
          </div>
        )}
        <Button
          onMouseDown={handleMouseDown}
          className="relative h-14 w-14 rounded-full shadow-lg p-0 cursor-grab active:cursor-grabbing"
          size="icon"
          variant="ghost"
        >
          {showMessageDot && (
            <span className="absolute top-0 right-0 block h-3.5 w-3.5 rounded-full bg-red-500 ring-2 ring-white" />
          )}
          <img
            src="/chatbot.png"
            alt="EcoBuddy Chat Icon"
            className="h-20 w-20 rounded-full object-cover"
            style={{ pointerEvents: "none" }}
          />
        </Button>
      </div>
    );
  }

  return (
    <Card
      className="fixed w-96 max-h-[80vh] h-[500px] shadow-xl z-50 flex flex-col"
      style={{ top: chatboxPosition.y, left: chatboxPosition.x }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <img src="/chatbot.png" alt="EcoBuddy Logo" className="h-10 w-10" />
          EcoBuddy
          <span className="text-xs font-normal text-muted-foreground ml-1">· Gemini AI</span>
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 p-4 overflow-y-auto" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <div className="flex items-start gap-2">
                  {message.sender === "bot" && (
                    <img src="/chatbot.png" alt="Bot" className="h-10 w-10 mt-0.5 rounded-full" />
                  )}
                  {message.sender === "user" && <User className="h-4 w-4 mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <img src="/chatbot.png" alt="Bot" className="h-10 w-10 rounded-full" />
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {messages.length === 1 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Quick questions:</p>
            <div className="space-y-1">
              {quickQuestions.map((q, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted text-xs block text-left"
                  onClick={() => setInputMessage(q)}
                >
                  {q}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-2">
        <div className="flex gap-2 w-full">
          <Input
            placeholder="Ask about waste management..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={!inputMessage.trim() || isLoading} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default WasteChatbot;
