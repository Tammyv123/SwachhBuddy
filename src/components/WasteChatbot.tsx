import { useState, useRef, useEffect, MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, User, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const BUBBLE_SIZE = 56;
const CHATBOX_WIDTH = 384;
const CHATBOX_HEIGHT = 500;
const VIEWPORT_PADDING = 24;

const WasteChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your waste management assistant. I can help you with segregation guidelines, disposal methods, recycling tips, and any other waste-related questions. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [chatboxPosition, setChatboxPosition] = useState({ x: 0, y: 0 });
  
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const wasDragged = useRef(false);

  useEffect(() => {
    const initialX = window.innerWidth - BUBBLE_SIZE - VIEWPORT_PADDING;
    const initialY = window.innerHeight - BUBBLE_SIZE - VIEWPORT_PADDING;
    setPosition({ x: initialX, y: initialY });
  }, []);
  
  useEffect(() => {
    if (isOpen) {
        let idealX = position.x - CHATBOX_WIDTH + BUBBLE_SIZE;
        let idealY = position.y - CHATBOX_HEIGHT + BUBBLE_SIZE;
        const finalX = Math.max(
          VIEWPORT_PADDING,
          Math.min(idealX, window.innerWidth - CHATBOX_WIDTH - VIEWPORT_PADDING)
        );
        const finalY = Math.max(
          VIEWPORT_PADDING,
          Math.min(idealY, window.innerHeight - CHATBOX_HEIGHT - VIEWPORT_PADDING)
        );
        setChatboxPosition({ x: finalX, y: finalY });
    }
  }, [isOpen, position]);

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
        wasDragged.current = true;
        const newX = e.clientX - dragOffset.current.x;
        const newY = e.clientY - dragOffset.current.y;
        setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setTimeout(() => {
            if (!wasDragged.current) {
                setIsOpen(true);
            }
        }, 0);
    };

    if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }
  }, [isDragging]);

  const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    wasDragged.current = false;
    dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
    };
    setIsDragging(true);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), content: inputMessage, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // New, more powerful instructions for the AI for  precise answer
    
    const instructions = `
      You are EcoBuddy, an expert assistant for waste management. 
      Your primary rules are:
      1.  **Always answer in short, use crisp 2-3 bullet points to explain.** Do not use paragraphs.
      2.  **You must connect every prompt to waste management,** recycling, or disposal, no matter how random it seems. 
      For example, if asked about "momo chutney", you should provide bullet points on how to dispose of its ingredients (food scraps, containers).
      3.  Only if a topic is absolutely impossible to connect to waste (e.g., abstract concepts), briefly state that you specialize in waste management.
    `;

    try {
      const { data, error } = await supabase.functions.invoke('waste-chatbot', { 
        body: { 
          message: inputMessage, 
          instructions: instructions 
        } 
      });

      if (error) throw error;
      
      const botMessage: Message = { id: (Date.now() + 1).toString(), content: data.response || "I'm sorry, I couldn't process your request right now. Please try again.", sender: 'bot', timestamp: new Date() };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
      const errorMessage: Message = { id: (Date.now() + 1).toString(), content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.", sender: 'bot', timestamp: new Date() };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "How do I segregate wet and dry waste?",
    "Where can I dispose of electronic waste?",
    "What items can be recycled?",
    "How to compost at home?"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  if (!isOpen) {
    return (
      <Button
        onMouseDown={handleMouseDown}
        className="fixed h-14 w-14 rounded-full shadow-lg z-50 p-0 cursor-grab active:cursor-grabbing"
        size="icon"
        variant="ghost"
        style={{
          top: position.y,
          left: position.x,
        }}
      >
        <img
          src="/chatbot.png"
          alt="EcoBuddy Chat Icon"
          className="h-20 w-20 rounded-full object-cover"
          style={{ pointerEvents: 'none' }}
        />
      </Button>
    );
  }

  return (
    <Card 
        className="fixed w-96 max-h-[80vh] h-[500px] shadow-xl z-50 flex flex-col"
        style={{
          top: chatboxPosition.y,
          left: chatboxPosition.x,
        }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <img
            src="/chatbot.png"
            alt="EcoBuddy Logo"
            className="h-10 w-10"
          />
          EcoBuddy
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent 
        className="flex-1 flex flex-col space-y-4 p-4 overflow-y-auto"
        ref={scrollAreaRef}
      >
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
                  }`}
              >
                <div className="flex items-start gap-2">
                  {message.sender === 'bot' && (
                    <img
                      src="/chatbot.png"
                      alt="Bot Icon"
                      className="h-10 w-10 mt-0.5 rounded-full"
                    />
                  )}
                  {message.sender === 'user' && (
                    <User className="h-4 w-4 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
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
                  <img
                    src="/chatbot.png"
                    alt="Bot Icon"
                    className="h-10 w-10 rounded-full"
                  />
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
              {quickQuestions.map((question, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted text-xs block text-left"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
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
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default WasteChatbot;