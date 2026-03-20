// src/components/AIWasteClassifier.tsx
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Upload,
  Loader2,
  Recycle,
  AlertTriangle,
  Leaf,
  Zap,
  X,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePoints } from "@/contexts/PointsContext";

interface ClassificationResult {
  category: "wet" | "dry" | "hazardous" | "e-waste" | "unknown";
  confidence: number;
  itemName: string;
  description: string;
  disposalInstructions: string;
  binColor: string;
  points: number;
}

interface AIWasteClassifierProps {
  isOpen: boolean;
  onClose: () => void;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const categoryConfig = {
  wet: {
    color: "bg-green-500",
    binColor: "Green Bin",
    icon: <Leaf className="h-6 w-6" />,
    badge: "bg-green-100 text-green-800 border-green-200",
    points: 20,
  },
  dry: {
    color: "bg-blue-500",
    binColor: "Blue Bin",
    icon: <Recycle className="h-6 w-6" />,
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    points: 15,
  },
  hazardous: {
    color: "bg-red-500",
    binColor: "Red Bin",
    icon: <AlertTriangle className="h-6 w-6" />,
    badge: "bg-red-100 text-red-800 border-red-200",
    points: 30,
  },
  "e-waste": {
    color: "bg-yellow-500",
    binColor: "Yellow Bin",
    icon: <Zap className="h-6 w-6" />,
    badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
    points: 35,
  },
  unknown: {
    color: "bg-gray-500",
    binColor: "Unknown",
    icon: <Recycle className="h-6 w-6" />,
    badge: "bg-gray-100 text-gray-800 border-gray-200",
    points: 10,
  },
};

export const AIWasteClassifier = ({ isOpen, onClose }: AIWasteClassifierProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { earn } = usePoints();

  if (!isOpen) return null;

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setResult(null);
      setPointsAwarded(false);
    };
    reader.readAsDataURL(file);
  };

  const analyzeWithGemini = async (base64Image: string) => {
    // Remove data URL prefix to get just the base64
    const base64Data = base64Image.split(",")[1];
    const mimeType = base64Image.split(";")[0].split(":")[1];

    const prompt = `You are a waste classification expert for India's Swachh Bharat mission.
    
Analyze this image and classify the waste item. Respond ONLY with a valid JSON object in this exact format:
{
  "category": "wet" | "dry" | "hazardous" | "e-waste",
  "confidence": <number 0-100>,
  "itemName": "<specific item name>",
  "description": "<one sentence description of the waste>",
  "disposalInstructions": "<specific disposal instruction for Indian citizens>",
  "binColor": "<Green/Blue/Red/Yellow> Bin"
}

Rules:
- wet: food waste, organic matter, garden waste (Green Bin)
- dry: paper, plastic, glass, metal, cardboard (Blue Bin)  
- hazardous: batteries, chemicals, paint, medical waste (Red Bin)
- e-waste: phones, computers, electronics, cables (Yellow Bin)

Only respond with the JSON, no other text.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data,
                },
              },
              { text: prompt },
            ],
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response format");

    const parsed = JSON.parse(jsonMatch[0]);
    const config = categoryConfig[parsed.category as keyof typeof categoryConfig] || categoryConfig.unknown;

    return {
      ...parsed,
      points: config.points,
    } as ClassificationResult;
  };

  const handleAnalyze = async () => {
    if (!image) return;

    if (!GEMINI_API_KEY) {
      // Demo mode - show mock result if no API key
      setIsAnalyzing(true);
      await new Promise(r => setTimeout(r, 2000));
      setResult({
        category: "dry",
        confidence: 94,
        itemName: "Plastic Bottle",
        description: "A used plastic water bottle made from PET plastic.",
        disposalInstructions: "Rinse the bottle, remove the cap, and place in the Blue (Dry Waste) bin for recycling.",
        binColor: "Blue Bin",
        points: 15,
      });
      setIsAnalyzing(false);
      return;
    }

    setIsAnalyzing(true);
    try {
      const classification = await analyzeWithGemini(image);
      setResult(classification);
    } catch (error) {
      console.error("Classification error:", error);
      toast({
        title: "Classification failed",
        description: "Could not analyze image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAwardPoints = () => {
    if (!result || pointsAwarded) return;
    earn(result.points, { source: "ai-classifier" });
    setPointsAwarded(true);
    toast({
      title: `+${result.points} points earned! 🎉`,
      description: `Great job correctly disposing ${result.itemName}!`,
    });
  };

  const handleReset = () => {
    setImage(null);
    setResult(null);
    setPointsAwarded(false);
  };

  const config = result ? categoryConfig[result.category] : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-auto">
      <Card className="w-full max-w-lg shadow-2xl border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Recycle className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">AI Waste Classifier</CardTitle>
                <CardDescription>Powered by Gemini Vision AI</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Upload Area */}
          {!image ? (
            <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center bg-primary/5">
              <Recycle className="h-12 w-12 text-primary/40 mx-auto mb-4" />
              <p className="text-lg font-medium mb-1">Upload Waste Image</p>
              <p className="text-sm text-muted-foreground mb-6">
                Take a photo or upload from gallery to classify your waste
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" /> Use Camera
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" /> Upload Photo
                </Button>
              </div>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={image}
                  alt="Waste to classify"
                  className="w-full h-56 object-cover"
                />
                {!result && (
                  <button
                    onClick={handleReset}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Analyze Button */}
              {!result && (
                <Button
                  className="w-full h-12 text-base"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 mr-2" />
                      Classify Waste with AI
                    </>
                  )}
                </Button>
              )}

              {/* Result */}
              {result && config && (
                <div className="space-y-3">
                  {/* Category Badge */}
                  <div className={`flex items-center gap-3 p-4 rounded-xl border ${config.badge}`}>
                    <div className={`w-12 h-12 rounded-full ${config.color} flex items-center justify-center text-white flex-shrink-0`}>
                      {config.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg capitalize">
                          {result.category === "e-waste" ? "E-Waste" : result.category.charAt(0).toUpperCase() + result.category.slice(1)} Waste
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {result.confidence}% confident
                        </Badge>
                      </div>
                      <p className="font-medium">{result.itemName}</p>
                      <p className="text-sm opacity-80">→ {result.binColor}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                    <p className="text-sm">{result.description}</p>
                    <div className="pt-2 border-t border-muted">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">DISPOSAL INSTRUCTIONS</p>
                      <p className="text-sm">{result.disposalInstructions}</p>
                    </div>
                  </div>

                  {/* Points */}
                  {!pointsAwarded ? (
                    <Button
                      className="w-full h-12"
                      onClick={handleAwardPoints}
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Confirm Disposal & Earn +{result.points} pts
                    </Button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 p-3 bg-success/10 rounded-xl border border-success/20 text-success">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">+{result.points} points awarded! 🎉</span>
                    </div>
                  )}

                  <Button variant="outline" className="w-full" onClick={handleReset}>
                    Classify Another Item
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Info Footer */}
          {!image && (
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {[
                { color: "bg-green-500", label: "Wet", bin: "Green" },
                { color: "bg-blue-500", label: "Dry", bin: "Blue" },
                { color: "bg-red-500", label: "Hazardous", bin: "Red" },
                { color: "bg-yellow-500", label: "E-Waste", bin: "Yellow" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full ${item.color} opacity-80`} />
                  <span className="font-medium">{item.label}</span>
                  <span className="text-muted-foreground">{item.bin}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
