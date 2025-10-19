import { NavLink } from 'react-router-dom';
import { Home, Clock, CheckCircle2, StickyNote, MessageCircle } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/alarms', icon: Clock, label: 'Alarms' },
  { to: '/reminders', icon: CheckCircle2, label: 'Tasks' },
  { to: '/notes', icon: StickyNote, label: 'Notes' },
  { to: '/buzz', icon: MessageCircle, label: 'Buzz' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
