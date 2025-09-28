// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages & Components
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Play from "./pages/play";
import Earn from "./pages/earn";
import Resolve from "./pages/resolve";

// Landing-details pages
import CommunityEngagement from "./pages/landing-details/CommunityEngagement";
import SmartSegregation from "./pages/landing-details/SmartSegregation";
import ProgressTracking from "./pages/landing-details/ProgressTracking";
import RewardsSystemLanding from "./pages/landing-details/RewardsSystem";
import Transparency from "./pages/landing-details/Transparency";
import DigitalFirst from "./pages/landing-details/DigitalFirst";

// Navbar-linked components
import UserProfile from "./components/UserProfile";
import Certifications from "./components/Certifications";
import RewardsSystem from "./components/RewardsSystem";
import Settings from "./components/settings";
import MapDashboard from "./components/MapDashboard";


// Learning Pages
import Learning from "./pages/Learning";
import { WasteBasicsModule } from "./components/learning/WasteBasicsModule";
import { WasteAdvancedModule } from "./components/learning/WasteAdvanceModule";
import WasteSortingGame from "./components/WasteSortingGame";

// Games
import WasteGame from "@/components/wastegame";
import EcoSorterGame from "@/components/EcoSorterGame";
import EcoRunner from "@/components/EcoRunner";
import EcoMario from "@/components/EcoMario"; // ✅ Import new game

// Auth & Protected
import UserTypeSelection from "./pages/UserTypeSelection";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Auth from "./pages/Auth";
import CDashboard from "./pages/Dashboard/CDashboard";
import EDashboard from "./pages/Dashboard/EDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Other Components
import { EcoEscapeRoom } from "./components/EcoEscapeRoom";
import NotFound from "./pages/NotFound";

// Context
import { PointsProvider } from "@/contexts/PointsContext";

// React Query Client
const queryClient = new QueryClient();

const App = () => (
  <PointsProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* All pages wrapped in Layout for Navbar + Footer */}
            <Route element={<Layout />}>
              {/* Landing Page */}
              <Route path="/" element={<Landing onUserTypeSelect={() => { }} />} />

              {/* Main Pages */}
              <Route path="/play" element={<Play />} />
              <Route path="/earn" element={<Earn />} />
              <Route path="/resolve" element={<Resolve />} />

              {/* Landing-details routes */}
              <Route path="/community-engagement" element={<CommunityEngagement />} />
              <Route path="/smart-segregation" element={<SmartSegregation />} />
              <Route path="/progress-tracking" element={<ProgressTracking />} />
              <Route path="/rewards-system" element={<RewardsSystemLanding />} />
              <Route path="/transparency" element={<Transparency />} />
              <Route path="/digital-first" element={<DigitalFirst />} />

              <Route path="/live-map" element={<MapDashboard />} /> {/* 2. ADD THE NEW ROUTE */}

              {/* Navbar-linked pages */}
              <Route path="/profile" element={<UserProfile userData={{}} />} />
              <Route path="/certifications" element={<Certifications />} />
              <Route path="/rewards" element={<RewardsSystem />} />
              <Route path="/settings" element={<Settings />} />

              {/* Learning Pages */}
              <Route path="/learning" element={<Learning />} />
              <Route path="/learning/waste-basics" element={<WasteBasicsModule />} />
              <Route path="/learning/waste-advance" element={<WasteAdvancedModule />} />
              <Route path="/learning/waste-sorting-game" element={<WasteSortingGame />} />

              {/* User Type & Auth */}
              <Route path="/get-started" element={<UserTypeSelection />} />
              <Route
                path="/login"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Login />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Signup />
                  </ProtectedRoute>
                }
              />
              <Route path="/auth" element={<Auth />} />

              {/* Dashboards */}
              <Route
                path="/dashboard/corporate"
                element={
                  <ProtectedRoute requireAuth={true}>
                    <CDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/enduser"
                element={
                  <ProtectedRoute requireAuth={true}>
                    <EDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Games */}
              <Route path="/manage-waste" element={<WasteGame />} />
              <Route path="/eco-sorter-game" element={<EcoSorterGame />} />
              <Route path="/eco-escape-room" element={<EcoEscapeRoom />} />
              <Route path="/eco-runner-game" element={<EcoRunner />} />
              <Route path="/eco-mario-game" element={<EcoMario />} />

              {/* Catch All */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </PointsProvider>
);

export default App;
