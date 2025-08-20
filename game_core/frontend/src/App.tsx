import { Link, Outlet } from 'react-router-dom'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import { ThemeToggle } from '@/components/theme-toggle'

function App() {
  return (
    <div className="min-h-dvh bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center gap-6">
          <Link to="/" className="font-semibold text-lg">Game Hub</Link>
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/games" className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">Spiele</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/profile" className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">Profil</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/settings" className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">Einstellungen</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login" className="hover:underline">Login</Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

export default App
