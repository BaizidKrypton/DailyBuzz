import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { BottomNav } from "./components/BottomNav";
import { TopBar } from "./components/TopBar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AlarmsList from "./pages/alarms/AlarmsList";
import CreateAlarm from "./pages/alarms/CreateAlarm";
import EditAlarm from "./pages/alarms/EditAlarm";
import AlarmChallenge from "./pages/alarms/AlarmChallenge";
import RemindersList from "./pages/reminders/RemindersList";
import CreateReminder from "./pages/reminders/CreateReminder";
import EditReminder from "./pages/reminders/EditReminder";
import NotesList from "./pages/notes/NotesList";
import CreateNote from "./pages/notes/CreateNote";
import EditNote from "./pages/notes/EditNote";
import Buzz from "./pages/Buzz";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <TopBar />
    <main className="flex-1 pb-16">{children}</main>
    <BottomNav />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/alarms" element={<ProtectedRoute><AppLayout><AlarmsList /></AppLayout></ProtectedRoute>} />
            <Route path="/alarms/create" element={<ProtectedRoute><AppLayout><CreateAlarm /></AppLayout></ProtectedRoute>} />
            <Route path="/alarms/edit/:id" element={<ProtectedRoute><AppLayout><EditAlarm /></AppLayout></ProtectedRoute>} />
            <Route path="/alarm-challenge/:id" element={<ProtectedRoute><AlarmChallenge /></ProtectedRoute>} />
            <Route path="/reminders" element={<ProtectedRoute><AppLayout><RemindersList /></AppLayout></ProtectedRoute>} />
            <Route path="/reminders/create" element={<ProtectedRoute><AppLayout><CreateReminder /></AppLayout></ProtectedRoute>} />
            <Route path="/reminders/edit/:id" element={<ProtectedRoute><AppLayout><EditReminder /></AppLayout></ProtectedRoute>} />
            <Route path="/notes" element={<ProtectedRoute><AppLayout><NotesList /></AppLayout></ProtectedRoute>} />
            <Route path="/notes/create" element={<ProtectedRoute><AppLayout><CreateNote /></AppLayout></ProtectedRoute>} />
            <Route path="/notes/edit/:id" element={<ProtectedRoute><AppLayout><EditNote /></AppLayout></ProtectedRoute>} />
            <Route path="/buzz" element={<ProtectedRoute><AppLayout><Buzz /></AppLayout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
