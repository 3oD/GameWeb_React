import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, updateTheme, resolved } = useTheme()
  let icon: React.ReactNode
  if (theme === 'system') {
    icon = resolved === 'dark' ? <Moon className="size-4" /> : <Sun className="size-4" />
  } else {
    icon = theme === 'dark' ? <Moon className="size-4" /> : <Sun className="size-4" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 w-9 p-0" aria-label="Toggle theme">
          {icon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
  <DropdownMenuItem onClick={() => updateTheme('system')}>
          <Monitor className="mr-2 size-4" /> System
        </DropdownMenuItem>
  <DropdownMenuItem onClick={() => updateTheme('light')}>
          <Sun className="mr-2 size-4" /> Hell
        </DropdownMenuItem>
  <DropdownMenuItem onClick={() => updateTheme('dark')}>
          <Moon className="mr-2 size-4" /> Dunkel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
