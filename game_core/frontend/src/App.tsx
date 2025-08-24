import { Link, Outlet } from 'react-router-dom'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuthStore } from '@/stores'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

function App() {
  const { user, logout, initialize } = useAuthStore()
  
  // Initialize auth on app start
  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="header-enhanced sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-6">
          <Link to="/" className="font-bold text-xl relative group">
            <span className="bg-gradient-to-r from-blue-500 via-primary to-purple-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-400 group-hover:via-primary group-hover:to-purple-500">
              Game Hub
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-primary/20 to-purple-600/20 rounded-lg blur-lg -z-10 opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
          </Link>
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/games" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 px-3 py-2 rounded-md hover:bg-accent">
                    Spiele
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 px-3 py-2 rounded-md hover:bg-accent">
                    Profil
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 px-3 py-2 rounded-md hover:bg-accent">
                    Einstellungen
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">
                  {user.displayName}
                </span>
                <Button variant="outline" size="sm" onClick={logout} className="btn-enhanced">
                  Logout
                </Button>
              </div>
            ) : (
              <Button asChild variant="default" size="sm" className="btn-enhanced">
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default App
