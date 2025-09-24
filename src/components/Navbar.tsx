import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Settings,
  LogOut,
  Home,
  GraduationCap,
  Trophy,
  Award,
  Gift,
  LayoutDashboard,
  Gamepad,
  Leaf,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useLocation } from "react-router-dom";
import ReferAndEarn from "./ReferAndEarn";
import { motion } from "framer-motion";

interface NavbarProps {
  onNavigate?: (path: string) => void;
}

const Navbar = ({ onNavigate }: NavbarProps) => {
  const [showReferModal, setShowReferModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const { user, userData, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Load dark mode preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
    setMobileOpen(false); // close drawer on mobile nav
  };

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    {
      path: user ? "/dashboard" : "/signup",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    { path: "/play", label: "Play", icon: Gamepad },
    { path: "/learning", label: "Learn", icon: GraduationCap },
    { path: "/earn", label: "Earn", icon: Trophy },
    { path: "/resolve", label: "Resolve", icon: Leaf },
  ];

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 🔥 Animated Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavigation("/")}
          >
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-full bg-gradient-to-r from-green-600 to-emerald-400 flex items-center justify-center shadow-md"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              >
                <Leaf className="w-5 h-5 text-white" />
              </motion.div>
            </motion.div>

            <motion.span
              className="font-extrabold text-xl bg-gradient-to-r from-green-700 to-emerald-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              SwachhBuddy
            </motion.span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Button
                key={path}
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation(path)}
                className={`flex items-center gap-2 ${
                  location.pathname === path ? "text-primary font-semibold" : ""
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <motion.button
              whileTap={{ rotate: 90, scale: 0.9 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-accent"
            >
              {darkMode ? (
                <Moon className="h-5 w-5 text-yellow-400" />
              ) : (
                <Sun className="h-5 w-5 text-orange-500" />
              )}
            </motion.button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded hover:bg-accent"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 px-2 flex items-center gap-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userData?.displayName?.charAt(0)?.toUpperCase() ||
                          user.email?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {userData?.displayName || user.displayName || "User"}
                      </span>
                      <Badge variant="secondary" className="text-xs h-4">
                        {userData?.role === "municipal-employee"
                          ? "Municipal"
                          : "Citizen"}
                      </Badge>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">
                      {userData?.displayName || user.displayName || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigation("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavigation("/certifications")}
                  >
                    <Award className="mr-2 h-4 w-4" />
                    Certifications
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation("/rewards")}>
                    <Trophy className="mr-2 h-4 w-4" />
                    Rewards
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowReferModal(true)}>
                    <Gift className="mr-2 h-4 w-4" />
                    Refer & Earn
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation("/login")}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => handleNavigation("/signup")}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed top-16 right-0 w-64 h-full bg-background shadow-lg z-40 p-4 flex flex-col gap-4 md:hidden"
        >
          {navLinks.map(({ path, label, icon: Icon }) => (
            <Button
              key={path}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(path)}
              className={`flex items-center gap-2 justify-start ${
                location.pathname === path ? "text-primary font-semibold" : ""
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}

          {!user && (
            <div className="flex gap-2 mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation("/login")}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90"
                onClick={() => handleNavigation("/signup")}
              >
                Sign Up
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Refer and Earn Modal */}
      <ReferAndEarn
        isOpen={showReferModal}
        onClose={() => setShowReferModal(false)}
      />
    </nav>
  );
};

export default Navbar;
