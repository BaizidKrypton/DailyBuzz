import { NavLink } from 'react-router-dom';
import { Home, Clock, Droplets, Wallet, MessageCircle } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/alarms', icon: Clock, label: 'Alarms' },
  { to: '/reminders', icon: Droplets, label: 'Tasks' },
  { to: '/finance', icon: Wallet, label: 'Finance' },
  { to: '/buzz', icon: MessageCircle, label: 'Buzz' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-card to-card/95 border-t-2 border-primary/10 z-50 backdrop-blur-sm">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${
                isActive
                  ? 'text-primary scale-110'
                  : 'text-muted-foreground hover:text-foreground hover:scale-105'
              }`
            }
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
