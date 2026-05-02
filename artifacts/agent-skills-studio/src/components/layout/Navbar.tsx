import { Link, useLocation } from "wouter";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, ArrowLeft, RotateCcw, Redo, Undo } from "lucide-react";
import { useStudioStore } from "@/hooks/use-studio-store";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();
  const { mode, undo, redo, resetSession, history } = useStudioStore();
  const isStudio = location === "/studio";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-4">
          {isStudio && (
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Home</span>
              </Link>
            </Button>
          )}
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-primary">
            Agent Skills Studio
          </Link>
          {isStudio && (
            <Badge variant={mode === "live" ? "destructive" : "secondary"} className="ml-4 tracking-wider uppercase text-[10px]">
              {mode} MODE
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isStudio && (
            <div className="flex items-center gap-1 mr-4 border-r pr-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={undo}
                disabled={history.past.length === 0}
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={redo}
                disabled={history.future.length === 0}
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetSession}
                title="Reset Session"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
