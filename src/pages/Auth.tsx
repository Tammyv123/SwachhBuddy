import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmail, signUpWithEmail } from "@/lib/auth";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userType } = (location.state as { userType: string }) || { userType: "citizen" };

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const { toast } = useToast();

  // IMPORTANT: matches App.tsx routing
  // citizen    → /dashboard/corporate (CDashboard - has Scan QR)
  // employee   → /dashboard/enduser  (EDashboard - has Generate QR)
  const getDashboardRoute = () => {
    return userType === "employee" ? "/dashboard/enduser" : "/dashboard/corporate";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        const { user, error: authError } = await signInWithEmail(
          formData.email,
          formData.password
        );

        if (authError) {
          setError(authError);
          return;
        }

        if (user) {
          toast({
            title: "Welcome back! 👋",
            description: `Logged in as ${userType === "employee" ? "Municipal Employee" : "Citizen"}.`,
          });
          navigate(getDashboardRoute(), { replace: true });
        }
      } else {
        if (formData.password.length < 8) {
          setError("Password must be at least 8 characters.");
          return;
        }

        const role = userType === "employee" ? "municipal-employee" : "citizen";
        const nameParts = formData.name.trim().split(" ");

        const { user, error: authError } = await signUpWithEmail(
          formData.email,
          formData.password,
          {
            displayName: formData.name,
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            role: role as "citizen" | "municipal-employee",
          }
        );

        if (authError) {
          setError(authError);
          return;
        }

        if (user) {
          toast({
            title: "Account created! 🎉",
            description: `Welcome to Swachh Buddy as ${userType === "employee" ? "Municipal Employee" : "Citizen"}!`,
          });
          navigate(getDashboardRoute(), { replace: true });
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl">{userType === "employee" ? "👷" : "🌱"}</span>
          </div>
          <CardTitle className="text-2xl">
            {isLogin ? "Welcome Back!" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? `Sign in as ${userType === "employee" ? "Municipal Employee" : "Citizen"}`
              : `Register as ${userType === "employee" ? "Municipal Employee" : "Citizen"}`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="h-11 mt-1"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-11 mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={isLogin ? "Enter your password" : "Min. 8 characters"}
                value={formData.password}
                onChange={handleChange}
                required
                className="h-11 mt-1"
              />
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </Button>
          </form>

          <div className="text-center mt-4">
            <Button
              variant="link"
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="text-primary"
            >
              {isLogin
                ? "Need an account? Sign Up"
                : "Already have an account? Sign In"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
