import { useEffect, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStudioStore } from "@/hooks/use-studio-store";
import { PRESETS, Skill } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Bot, Play, Info, CheckCircle2, ChevronRight, Wand2, Lightbulb, Beaker, BrainCircuit, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Studio() {
  const {
    currentPreset,
    taskText,
    activeSkills,
    mode,
    hasRun,
    setPreset,
    setTaskText,
    toggleSkill,
    setMode,
    runComparison
  } = useStudioStore();

  const [activeTab, setActiveTab] = useState<"side-by-side" | "trace">("side-by-side");

  const allSkillsAvailable = currentPreset ? currentPreset.skills : PRESETS.flatMap(p => p.skills).reduce((acc, curr) => {
    if (!acc.find(s => s.id === curr.id)) acc.push(curr);
    return acc;
  }, [] as Skill[]);

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-background overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="flex-1 w-full h-full">
        {/* Left Panel: Settings & Skills */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="border-r bg-muted/20">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              <div className="space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Bot className="w-3 h-3" />
                  Configuration
                </Label>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="preset-select">Load Preset Demo</Label>
                    <Select value={currentPreset?.id || "custom"} onValueChange={(val) => {
                      if (val !== "custom") setPreset(val);
                    }}>
                      <SelectTrigger id="preset-select">
                        <SelectValue placeholder="Custom Setup" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom">Custom Setup</SelectItem>
                        {PRESETS.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Live LLM Mode</Label>
                      <p className="text-[10px] text-muted-foreground">Uses real API (Simulated only for this demo)</p>
                    </div>
                    <Switch 
                      checked={mode === "live"} 
                      onCheckedChange={(c) => setMode(c ? "live" : "simulated")} 
                      disabled // Disabled in this specific demo build since no backend
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Wand2 className="w-3 h-3" />
                  Skill Library
                </Label>
                <div className="space-y-2">
                  {allSkillsAvailable.map((skill) => {
                    const isActive = activeSkills.some(s => s.id === skill.id);
                    return (
                      <div 
                        key={skill.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${isActive ? 'bg-primary/5 border-primary/30 shadow-sm' : 'bg-card hover:bg-muted/50'}`}
                        onClick={() => toggleSkill(skill)}
                        data-testid={`skill-toggle-${skill.id}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-medium ${isActive ? 'text-primary' : ''}`}>{skill.name}</p>
                              {isActive && <CheckCircle2 className="w-3 h-3 text-primary" />}
                            </div>
                            <p className="text-xs text-muted-foreground">{skill.description}</p>
                          </div>
                          <Switch checked={isActive} onCheckedChange={() => toggleSkill(skill)} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollArea>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Center Panel: Task Input */}
        <ResizablePanel defaultSize={35} minSize={25}>
          <div className="h-full flex flex-col bg-background">
            <div className="flex-1 p-4 sm:p-6 space-y-6 flex flex-col">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Bot className="w-3 h-3" />
                  Base Agent Context
                </Label>
                <div className="p-3 rounded-md bg-muted text-sm text-muted-foreground italic border">
                  {currentPreset?.baseAgent || "General-purpose assistant with no domain expertise."}
                </div>
              </div>

              <div className="flex-1 flex flex-col space-y-2 min-h-[200px]">
                <Label htmlFor="task-input" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" />
                  Task Instruction
                </Label>
                <Textarea 
                  id="task-input"
                  className="flex-1 resize-none font-mono text-sm p-4 bg-card focus-visible:ring-1" 
                  placeholder="Enter a task for the agent..."
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  data-testid="input-task-text"
                />
                
                {currentPreset && currentPreset.quickPrompts && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {currentPreset.quickPrompts.map((qp, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-1 font-normal"
                        onClick={() => setTaskText(qp)}
                      >
                        {qp}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Skills Attached</Label>
                  <div className="flex flex-wrap gap-2 min-h-[2rem]">
                    <AnimatePresence>
                      {activeSkills.length === 0 ? (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-muted-foreground italic">
                          No skills attached. Running as base agent.
                        </motion.span>
                      ) : (
                        activeSkills.map(skill => (
                          <motion.div
                            key={skill.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                          >
                            <Badge className="bg-primary/10 text-primary border-primary/20 gap-1.5 py-1 px-3">
                              <Wand2 className="w-3 h-3" />
                              {skill.name}
                            </Badge>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full h-12 text-base shadow-lg hover:shadow-xl transition-all" 
                  onClick={runComparison}
                  disabled={!taskText.trim()}
                  data-testid="button-run-task"
                >
                  <Play className="w-4 h-4 mr-2" fill="currentColor" />
                  Run Agent Execution
                </Button>
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel: Output & Analysis */}
        <ResizablePanel defaultSize={45} minSize={30} className="bg-muted/10">
          <div className="h-full flex flex-col">
            <div className="border-b px-4 py-3 bg-background flex items-center justify-between sticky top-0 z-10">
              <h2 className="font-semibold flex items-center gap-2">
                <Beaker className="w-4 h-4 text-primary" />
                Execution Results
              </h2>
              <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-[240px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="side-by-side">Comparison</TabsTrigger>
                  <TabsTrigger value="trace" disabled={!hasRun || activeSkills.length === 0}>Skill Trace</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <ScrollArea className="flex-1 p-4 sm:p-6">
              {!hasRun ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground opacity-60 min-h-[400px]">
                  <Bot className="w-16 h-16 mb-2" />
                  <p className="text-lg font-medium">Ready to Execute</p>
                  <p className="text-sm max-w-sm">Configure your agent context, attach skills, and run the task to see the results here.</p>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {activeTab === "side-by-side" && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {/* Without Skills Card */}
                      <Card className="border-muted bg-card shadow-sm h-fit">
                        <CardHeader className="pb-3 border-b bg-muted/20">
                          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                            <Bot className="w-4 h-4" />
                            Base Agent Output
                          </CardTitle>
                          <CardDescription className="text-xs">Without any specialized skills</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                            {currentPreset ? currentPreset.outputWithoutSkills : "I am a generic assistant. I can provide a basic response to your task based on my pre-training data, but I lack specific domain reasoning frameworks to give you an expert-level answer."}
                          </p>
                        </CardContent>
                      </Card>

                      {/* With Skills Card */}
                      <Card className="border-primary/20 shadow-md ring-1 ring-primary/10 h-fit relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                          <BrainCircuit className="w-24 h-24 text-primary" />
                        </div>
                        <CardHeader className="pb-3 border-b bg-primary/5">
                          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
                            <Sparkles className="w-4 h-4" />
                            Skilled Agent Output
                          </CardTitle>
                          <CardDescription className="text-xs">With {activeSkills.length} active skill(s)</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          {activeSkills.length === 0 ? (
                            <div className="text-sm text-muted-foreground italic flex items-center justify-center h-24 bg-muted/30 rounded-md border border-dashed">
                              Attach skills in the left panel to see how the output transforms.
                            </div>
                          ) : (
                            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-medium">
                              {currentPreset ? currentPreset.outputWithSkills : "Applying attached skills to process your request... Note: This is a custom input. In a live system, the LLM would dynamically use the attached skills to formulate a highly specific, reasoned response. For this demo, try loading a Preset from the left panel to see a detailed realistic output."}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {activeTab === "trace" && currentPreset && activeSkills.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <ChevronRight className="w-5 h-5 text-primary" />
                          Skill Influence Trace
                        </CardTitle>
                        <CardDescription>How the attached skills modified the agent's reasoning process.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="p-4 bg-muted/30 rounded-md font-mono text-sm text-primary/80 border border-primary/20">
                          {currentPreset.trace.split('→').map((step, i, arr) => (
                            <div key={i} className="flex items-start gap-2 py-2">
                              <span className="text-muted-foreground w-6 text-right shrink-0">{i + 1}.</span>
                              <span>{step.trim()}</span>
                              {i < arr.length - 1 && <div className="absolute left-[38px] w-px h-6 bg-border translate-y-6" />}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {currentPreset && activeSkills.length > 0 && (
                    <Accordion type="single" collapsible className="w-full mt-8">
                      <AccordionItem value="explanation" className="border-primary/20 bg-primary/5 px-4 rounded-lg">
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center gap-2 text-primary font-semibold">
                            <Lightbulb className="w-5 h-5" />
                            Explain this result
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed text-sm pb-4">
                          {currentPreset.explanation}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </motion.div>
              )}
            </ScrollArea>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
