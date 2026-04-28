import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import ExamsList from "./pages/ExamsList";
import ExamBuilder from "./pages/ExamBuilder";
import StudentExam from "./pages/StudentExam";
import Results from "./pages/Results";
import ReviewWriting from "./pages/ReviewWriting";
import TeacherProfile from "./pages/TeacherProfile";
import StudentPortal from "./pages/StudentPortal";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isBlocked } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (isBlocked) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md space-y-4">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <span className="text-3xl">🚫</span>
        </div>
        <h1 className="text-2xl font-bold text-destructive">تم حظر حسابك</h1>
        <p className="text-muted-foreground">تواصل مع المشرف الرئيسي لمزيد من المعلومات</p>
        <p className="text-muted-foreground text-sm">Your account has been blocked. Contact the admin for more information.</p>
      </div>
    </div>
  );
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <AdminProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/student" element={<StudentPortal />} />
              <Route path="/exam/:token" element={<StudentExam />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/exams" element={<ProtectedRoute><ExamsList /></ProtectedRoute>} />
              <Route path="/dashboard/exams/new" element={<ProtectedRoute><ExamBuilder /></ProtectedRoute>} />
              <Route path="/dashboard/exams/:id" element={<ProtectedRoute><ExamBuilder /></ProtectedRoute>} />
              <Route path="/dashboard/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
              <Route path="/dashboard/review" element={<ProtectedRoute><ReviewWriting /></ProtectedRoute>} />
              <Route path="/dashboard/profile" element={<ProtectedRoute><TeacherProfile /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </AdminProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
