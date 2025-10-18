import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alarms"
            element={
              <ProtectedRoute>
                <AlarmsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alarms/create"
            element={
              <ProtectedRoute>
                <CreateAlarm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alarms/edit/:id"
            element={
              <ProtectedRoute>
                <EditAlarm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alarm-challenge/:id"
            element={
              <ProtectedRoute>
                <AlarmChallenge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reminders"
            element={
              <ProtectedRoute>
                <RemindersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reminders/create"
            element={
              <ProtectedRoute>
                <CreateReminder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reminders/edit/:id"
            element={
              <ProtectedRoute>
                <EditReminder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <NotesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/create"
            element={
              <ProtectedRoute>
                <CreateNote />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/edit/:id"
            element={
              <ProtectedRoute>
                <EditNote />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
