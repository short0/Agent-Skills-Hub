import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRESETS } from "@/lib/data";
import { useStudioStore } from "@/hooks/use-studio-store";
import { ArrowRight, Bot, BrainCircuit, Play, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [, setLocation] = useLocation();
  const { setPreset, resetSession } = useStudioStore();

  const handleLaunchPreset = (presetId: string) => {
    setPreset(presetId);
    setLocation("/studio");
  };

  const handleBlankStudio = () => {
    resetSession();
    setLocation("/studio");
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      <main className="flex-1 flex flex-col items-center py-12 px-4 sm:px-8 space-y-24">
        {/* Hero Section */}
        <section className="max-w-4xl text-center space-y-6 pt-12">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Badge className="mb-4">v1.0 Developer Preview</Badge>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-foreground">
              Master the art of <span className="text-primary">Agent Skills</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-6">
              A calm, precise playground to explore how specialist skills fundamentally change a base AI agent's behavior. See the difference between generic outputs and skilled execution.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="flex justify-center gap-4 pt-8">
            <Button size="lg" className="h-14 px-8 text-base gap-2" onClick={handleBlankStudio} data-testid="button-open-blank-studio">
              <Bot className="w-5 h-5" />
              Open Blank Studio
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base gap-2" asChild data-testid="link-how-it-works">
              <a href="#how-it-works">
                How it works
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </motion.div>
        </section>

        {/* Presets Grid */}
        <section className="w-full max-w-6xl space-y-8" id="presets">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Try a Preset Demo</h2>
            <p className="text-muted-foreground">Instantly see the impact of specialized skills on real-world tasks.</p>
          </div>
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {PRESETS.map((preset) => (
              <motion.div key={preset.id} variants={item}>
                <Card className="h-full flex flex-col hover:border-primary/50 transition-colors duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Sparkles className="w-5 h-5 text-primary" />
                      {preset.name}
                    </CardTitle>
                    <CardDescription className="text-base">{preset.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Example Task</p>
                      <p className="text-sm bg-muted/50 p-3 rounded-md line-clamp-2 italic">"{preset.task}"</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {preset.skills.map(s => (
                        <Badge key={s.id} variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10">
                          {s.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full gap-2" 
                      onClick={() => handleLaunchPreset(preset.id)}
                      data-testid={`button-launch-${preset.id}`}
                    >
                      <Play className="w-4 h-4" fill="currentColor" />
                      Launch Demo
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="w-full max-w-5xl py-24 border-t">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight">How Skills Transform Agents</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A tool lets an agent perform an action (like calling an API). A skill changes how the agent reasons, analyzes, and approaches a problem entirely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted mx-auto flex items-center justify-center">
                <Bot className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">1. Base Agent</h3>
              <p className="text-muted-foreground">Starts as a general-purpose LLM capable of basic text generation but lacking domain expertise.</p>
            </div>
            <div className="space-y-4 text-center relative">
              <div className="hidden md:block absolute top-8 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent -z-10" />
              <div className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">2. Attach Skills</h3>
              <p className="text-muted-foreground">Inject highly specialized reasoning patterns, frameworks, and domain knowledge.</p>
            </div>
            <div className="space-y-4 text-center relative">
              <div className="w-16 h-16 rounded-2xl bg-primary mx-auto flex items-center justify-center shadow-lg shadow-primary/20">
                <BrainCircuit className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">3. Expert Execution</h3>
              <p className="text-muted-foreground">The agent now thinks and responds like a specialist, providing structured, nuanced outcomes.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

