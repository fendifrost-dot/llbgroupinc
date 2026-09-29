import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { RequireAuth } from "@/components/auth/RequireAuth";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Courses from "./pages/Courses";
import CourseSales from "./pages/CourseSales";
import SignIn from "./pages/SignIn";
import Account from "./pages/Account";
import Learn from "./pages/Learn";
import CoursePlayer from "./pages/CoursePlayer";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancelled from "./pages/CheckoutCancelled";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Learn platform: storefront, public */}
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:slug" element={<CourseSales />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/cancelled" element={<CheckoutCancelled />} />
            <Route path="/signin" element={<SignIn />} />

            {/* Student area — gated */}
            <Route
              path="/account"
              element={
                <RequireAuth>
                  <Account />
                </RequireAuth>
              }
            />
            <Route
              path="/learn"
              element={
                <RequireAuth>
                  <Learn />
                </RequireAuth>
              }
            />
            <Route
              path="/learn/:courseSlug"
              element={
                <RequireAuth>
                  <CoursePlayer />
                </RequireAuth>
              }
            />

            {/* Legal - linked from the footer on every page */}
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
