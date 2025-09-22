import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Recycle, AlertCircle, Users, Building2, CheckCircle, Gift } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { signUpWithEmail, signInWithGoogle } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { validateReferralCode, processReferralSignup } from "@/services/referral";

const Signup = () => {
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        employeeId: "",
        department: "",
        referralCode: searchParams.get('ref') || "",
        agreeToTerms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [referralValidation, setReferralValidation] = useState<{
        isValid: boolean;
        message: string;
    }>({ isValid: false, message: "" });
    const navigate = useNavigate();
    const { toast } = useToast();

    const roles = [
        {
            id: "citizen",
            title: "Citizen",
            description: "Join as a community member to contribute to waste management",
            icon: <Users className="h-6 w-6" />,
            features: ["Report waste issues", "Learn waste segregation", "Earn rewards", "Track progress"]
        },
        {
            id: "municipal-employee",
            title: "Municipal Employee",
            description: "Official waste management personnel and administrators",
            icon: <Building2 className="h-6 w-6" />,
            features: ["Manage waste collection", "Monitor operations", "Generate reports", "Admin dashboard"]
        }
    ];

    // Validate referral code when it changes
    useEffect(() => {
        const validateReferral = async () => {
            if (formData.referralCode.trim()) {
                try {
                    const validation = await validateReferralCode(formData.referralCode);
                    if (validation.isValid) {
                        setReferralValidation({
                            isValid: true,
                            message: "Valid referral code! You'll both earn 10 coins."
                        });
                    } else {
                        setReferralValidation({
                            isValid: false,
                            message: "Invalid referral code."
                        });
                    }
                } catch (error) {
                    setReferralValidation({
                        isValid: false,
                        message: "Could not validate referral code."
                    });
                }
            } else {
                setReferralValidation({ isValid: false, message: "" });
            }
        };

        const debounceTimer = setTimeout(validateReferral, 500);
        return () => clearTimeout(debounceTimer);
    }, [formData.referralCode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        if (!formData.role) {
            setError("Please select a role");
            return;
        }

        if (!formData.agreeToTerms) {
            setError("Please agree to the terms and conditions");
            return;
        }

        if (formData.role === "municipal-employee" && !formData.employeeId) {
            setError("Employee ID is required for municipal employees");
            return;
        }

        setIsLoading(true);

        try {
            // Prepare user data
            const userData = {
                displayName: `${formData.firstName} ${formData.lastName}`,
                firstName: formData.firstName,
                lastName: formData.lastName,
                role: formData.role as 'citizen' | 'municipal-employee',
                ...(formData.role === "municipal-employee" && {
                    employeeId: formData.employeeId,
                    department: formData.department
                })
            };

            const { user, error: authError } = await signUpWithEmail(
                formData.email,
                formData.password,
                userData
            );

            if (authError) {
                setError(authError);
                return;
            }

            if (user) {
                // Process referral if code was provided
                if (formData.referralCode.trim()) {
                    const referralProcessed = await processReferralSignup(user.uid, formData.referralCode);
                    if (referralProcessed) {
                        toast({
                            title: "Welcome to Swachh Bharat!",
                            description: "Account created successfully! Referral bonus will be awarded after your first QR scan.",
                        });
                    } else {
                        toast({
                            title: "Welcome to Swachh Bharat!",
                            description: "Account created successfully, but there was an issue with the referral code.",
                        });
                    }
                } else {
                    toast({
                        title: "Welcome to Swachh Bharat!",
                        description: "Your account has been created successfully.",
                    });
                }
                navigate('/dashboard');
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            setIsLoading(true);
            const { user, error } = await signInWithGoogle();

            if (error) {
                setError(error);
                return;
            }

            if (user) {
                toast({
                    title: "Welcome to Swachh Bharat!",
                    description: "Your account has been created successfully with Google.",
                });
                navigate('/dashboard');
            }
        } catch (err) {
            setError("Failed to sign up with Google. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRoleChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            role: value
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
           

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4">
                            <Recycle className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Join Swachh Bharat</h1>
                        <p className="text-muted-foreground">
                            Create your account and start contributing to a cleaner India
                        </p>
                    </div>

                    {/* Signup Form */}
                    <Card className="shadow-xl border-0">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl text-center text-foreground">Create Account</CardTitle>
                            <CardDescription className="text-center">
                                Choose your role and fill in your details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Referral Welcome Message */}
                            {searchParams.get('ref') && (
                                <Alert className="mb-6 bg-green-50 border-green-200">
                                    <Gift className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800">
                                        🎉 You've been referred by a friend! Complete your signup and both of you will earn 10 coins.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                {/* Role Selection */}
                                <div className="space-y-4">
                                    <Label className="text-base font-medium">Select Your Role</Label>
                                    <RadioGroup value={formData.role} onValueChange={handleRoleChange}>
                                        <div className="grid gap-4">
                                            {roles.map((role) => (
                                                <div key={role.id} className="relative">
                                                    <RadioGroupItem
                                                        value={role.id}
                                                        id={role.id}
                                                        className="peer sr-only"
                                                    />
                                                    <Label
                                                        htmlFor={role.id}
                                                        className="flex flex-col space-y-3 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <div className="text-primary">{role.icon}</div>
                                                            <div className="flex-1">
                                                                <div className="font-medium">{role.title}</div>
                                                                <div className="text-sm text-muted-foreground">{role.description}</div>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                                            {role.features.map((feature, index) => (
                                                                <div key={index} className="flex items-center space-x-1">
                                                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                                                    <span>{feature}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Personal Information */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            placeholder="John"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            placeholder="Doe"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            className="h-11"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="h-11"
                                    />
                                </div>

                                {/* Municipal Employee Additional Fields */}
                                {formData.role === "municipal-employee" && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="employeeId">Employee ID</Label>
                                            <Input
                                                id="employeeId"
                                                name="employeeId"
                                                placeholder="EMP001"
                                                value={formData.employeeId}
                                                onChange={handleInputChange}
                                                required
                                                className="h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="department">Department</Label>
                                            <Input
                                                id="department"
                                                name="department"
                                                placeholder="Waste Management"
                                                value={formData.department}
                                                onChange={handleInputChange}
                                                className="h-11"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Password Fields */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a strong password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                            className="h-11 pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Password must be at least 8 characters long
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            required
                                            className="h-11 pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {/* Referral Code Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="referralCode" className="flex items-center gap-2">
                                        <Gift className="h-4 w-4 text-primary" />
                                        Referral Code (Optional)
                                    </Label>
                                    <Input
                                        id="referralCode"
                                        name="referralCode"
                                        placeholder="Enter referral code"
                                        value={formData.referralCode}
                                        onChange={handleInputChange}
                                        className="h-11"
                                    />
                                    {referralValidation.message && (
                                        <p className={`text-xs ${referralValidation.isValid
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                            }`}>
                                            {referralValidation.message}
                                        </p>
                                    )}
                                </div>

                                {/* Terms and Conditions */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onCheckedChange={(checked) =>
                                            setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                                        }
                                    />
                                    <Label htmlFor="agreeToTerms" className="text-sm">
                                        I agree to the{" "}
                                        <Link to="/terms" className="text-primary hover:text-primary/80">
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link to="/privacy" className="text-primary hover:text-primary/80">
                                            Privacy Policy
                                        </Link>
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Creating Account..." : "Create Account"}
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-11"
                                    onClick={handleGoogleSignUp}
                                    disabled={isLoading}
                                >
                                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Continue with Google
                                </Button>
                            </form>

                            <div className="mt-6 text-center text-sm">
                                <span className="text-muted-foreground">Already have an account? </span>
                                <Link
                                    to="/login"
                                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                                >
                                    Sign in here
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Signup;