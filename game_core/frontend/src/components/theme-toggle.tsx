import { Moon, Sun, Monitor } from 'lucide-react';
import { useThemeStore } from '@/stores';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect } from 'react';

export function ThemeToggle() {
  const { theme, resolved, updateTheme, initializeTheme } = useThemeStore();
  
  // Initialize theme on mount
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);
  
  // Get display value and icon for current theme
  const getThemeDisplay = (currentTheme: string) => {
    switch (currentTheme) {
      case 'light':
        return { label: 'Hell', icon: <Sun className="size-4" /> };
      case 'dark':
        return { label: 'Dunkel', icon: <Moon className="size-4" /> };
      case 'system':
      default: {
        const systemIcon = resolved === 'dark' ? <Moon className="size-4" /> : <Sun className="size-4" />;
        return { label: 'System', icon: systemIcon };
      }
    }
  };

  const currentDisplay = getThemeDisplay(theme);

  return (
    <Select value={theme} onValueChange={updateTheme}>
      <SelectTrigger className="h-9 w-auto px-3 gap-2" aria-label="Toggle theme">
        {currentDisplay.icon}
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="system">
          <div className="flex items-center gap-2">
            <Monitor className="size-4" />
            System
          </div>
        </SelectItem>
        <SelectItem value="light">
          <div className="flex items-center gap-2">
            <Sun className="size-4" />
            Hell
          </div>
        </SelectItem>
        <SelectItem value="dark">
          <div className="flex items-center gap-2">
            <Moon className="size-4" />
            Dunkel
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
