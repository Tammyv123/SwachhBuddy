import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Copy,
    Share2,
    Users,
    Gift,
    CheckCircle,
    ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { generateReferralCode, getReferralStats } from "@/services/referral";
import { testFirebaseConnection } from "@/lib/firebase-test";

interface ReferAndEarnProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ReferralStats {
    totalReferrals: number;
    totalEarnings: number;
    pendingReferrals: number;
}

const ReferAndEarn = ({ isOpen, onClose }: ReferAndEarnProps) => {
    const [referralCode, setReferralCode] = useState("");
    const [referralLink, setReferralLink] = useState("");
    const [stats, setStats] = useState<ReferralStats>({
        totalReferrals: 0,
        totalEarnings: 0,
        pendingReferrals: 0
    });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        const loadReferralData = async () => {
            console.log("Loading referral data...", { isOpen, user: !!user });
            try {
                setLoading(true);

                if (!user) {
                    console.log("No user found");
                    return;
                }

                // Test Firebase connection first
                console.log("Testing Firebase connection...");
                const connectionTest = await testFirebaseConnection();
                console.log("Firebase connection test result:", connectionTest);

                // Generate or get existing referral code
                console.log("Generating referral code for user:", user.uid);
                const code = await generateReferralCode(user.uid);
                console.log("Generated referral code:", code);

                if (code && code.trim()) {
                    setReferralCode(code);

                    // Create referral link
                    const baseUrl = window.location.origin;
                    const link = `${baseUrl}/signup?ref=${code}`;
                    console.log("Generated referral link:", link);
                    setReferralLink(link);
                } else {
                    console.log("No code generated, using fallback");
                    const fallbackCode = `TEMP${user.uid.substring(0, 4).toUpperCase()}`;
                    setReferralCode(fallbackCode);
                    setReferralLink(`${window.location.origin}/signup?ref=${fallbackCode}`);
                }

                // Load referral stats
                const referralStats = await getReferralStats(user.uid);
                console.log("Loaded referral stats:", referralStats);
                setStats(referralStats);
            } catch (error) {
                console.error("Error loading referral data:", error);

                // Fallback for offline mode
                if (user && (error.message.includes('offline') || error.message.includes('Failed to get document'))) {
                    console.log("Using offline fallback for referral data");
                    const fallbackCode = `TEMP${user.uid.substring(0, 4).toUpperCase()}`;
                    setReferralCode(fallbackCode);
                    setReferralLink(`${window.location.origin}/signup?ref=${fallbackCode}`);
                    setStats({ totalReferrals: 0, totalEarnings: 0, pendingReferrals: 0 });

                    toast({
                        title: "Offline Mode",
                        description: "Using temporary referral code. Full features available when online.",
                        variant: "default"
                    });
                } else {
                    toast({
                        title: "Error",
                        description: "Failed to load referral information",
                        variant: "destructive"
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && user) {
            loadReferralData();
        }
    }, [isOpen, user, toast]);

    const copyToClipboard = async (text: string, type: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast({
                title: "Copied!",
                description: `${type} copied to clipboard`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to copy ${type.toLowerCase()}`,
                variant: "destructive"
            });
        }
    };

    const shareReferralLink = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Join Swachh Bharat - Gamified Waste Management",
                    text: `Join me on Swachh Bharat and help make India cleaner! Use my referral code: ${referralCode}`,
                    url: referralLink,
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            copyToClipboard(referralLink, "Referral link");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-primary" />
                        Refer & Earn
                    </DialogTitle>
                    <DialogDescription>
                        Invite friends and earn 10 coins for each successful referral!
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* How it works */}
                        <Card>
                            <CardContent className="p-4">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    How it works
                                </h3>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                        <span>Share your referral code with friends</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                        <span>They sign up using your code</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                        <span>Both of you get 10 coins instantly!</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Referral Code */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium">Your Referral Code</label>
                            <div className="flex gap-2">
                                <Input
                                    value={referralCode || "Loading..."}
                                    readOnly
                                    className="font-mono text-center text-lg font-bold"
                                    placeholder="Generating code..."
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => copyToClipboard(referralCode, "Referral code")}
                                    disabled={!referralCode}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            {!referralCode && !loading && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        if (user) {
                                            const fallbackCode = `TEMP${user.uid.substring(0, 4).toUpperCase()}${Math.random().toString(36).substring(2, 4).toUpperCase()}`;
                                            setReferralCode(fallbackCode);
                                            setReferralLink(`${window.location.origin}/signup?ref=${fallbackCode}`);
                                            toast({
                                                title: "Code Generated",
                                                description: "Temporary referral code created",
                                            });
                                        }
                                    }}
                                    className="w-full"
                                >
                                    Generate Backup Code
                                </Button>
                            )}
                        </div>

                        {/* Referral Link */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium">Referral Link</label>
                            <div className="flex gap-2">
                                <Input
                                    value={referralLink || "Generating link..."}
                                    readOnly
                                    className="text-xs"
                                    placeholder="Your referral link will appear here"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => copyToClipboard(referralLink, "Referral link")}
                                    disabled={!referralLink}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Share Button */}
                        <Button
                            onClick={shareReferralLink}
                            className="w-full"
                            size="lg"
                        >
                            <Share2 className="mr-2 h-4 w-4" />
                            Share with Friends
                        </Button>

                        {/* Test Button */}
                        <Button
                            onClick={() => window.open(referralLink, '_blank')}
                            variant="outline"
                            className="w-full"
                            size="sm"
                        >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Test Referral Link
                        </Button>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{stats.totalReferrals}</div>
                                <div className="text-xs text-muted-foreground">Total Referrals</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{stats.totalEarnings}</div>
                                <div className="text-xs text-muted-foreground">Coins Earned</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">{stats.pendingReferrals}</div>
                                <div className="text-xs text-muted-foreground">Pending</div>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="text-xs text-muted-foreground text-center">
                            Coins are awarded when your referred friend completes their first QR scan.
                            <br />
                            <a href="#" className="text-primary hover:underline inline-flex items-center gap-1 mt-1">
                                Terms & Conditions
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ReferAndEarn;