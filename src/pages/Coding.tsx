import { useState } from "react";
import { Code2, Play, Check, X, Filter, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { codingProblems } from "@/lib/mockData";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Coding() {
  const [selectedProblem, setSelectedProblem] = useState(codingProblems[0]);
  const [code, setCode] = useState("// Write your code here\n\n");
  const [language, setLanguage] = useState("python");
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const filteredProblems = codingProblems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === "all" || p.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "bg-success text-success-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      case "hard": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted";
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Executing...");
    
    try {
      const { data, error } = await supabase.functions.invoke('execute-code', {
        body: { code, language, stdin: "" }
      });

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        setOutput(`Error: ${error.message}`);
        return;
      }

      // Format Judge0 response
      if (data.status?.description === "Accepted") {
        setOutput(`✓ Success\n\nOutput:\n${data.stdout || '(no output)'}\n\nExecution Time: ${data.time}s\nMemory: ${data.memory} KB`);
        toast({ title: "Success", description: "Code executed successfully!" });
      } else if (data.compile_output) {
        setOutput(`✗ Compilation Error\n\n${data.compile_output}`);
        toast({ title: "Compilation Error", variant: "destructive" });
      } else if (data.stderr) {
        setOutput(`✗ Runtime Error\n\n${data.stderr}`);
        toast({ title: "Runtime Error", variant: "destructive" });
      } else {
        setOutput(data.stdout || data.message || 'No output');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      toast({ title: "Error", description: errorMsg, variant: "destructive" });
      setOutput(`Error: ${errorMsg}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    await handleRun();
    toast({
      title: "Code Submitted",
      description: "Your solution has been recorded.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Coding Practice</h1>
        <p className="text-muted-foreground mt-1">Sharpen your programming skills</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
        {/* Problem List */}
        <Card className="shadow-card h-[calc(100vh-200px)] overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle>Problems</CardTitle>
            <CardDescription>Select a problem to solve</CardDescription>
            <div className="space-y-2 pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-2">
            {filteredProblems.map((problem) => (
              <div
                key={problem.id}
                onClick={() => setSelectedProblem(problem)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted ${
                  selectedProblem.id === problem.id ? 'border-primary bg-muted' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{problem.title}</h4>
                  {problem.solved && (
                    <Check className="h-4 w-4 text-success flex-shrink-0 ml-2" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(problem.difficulty)} variant="secondary">
                    {problem.difficulty}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {problem.acceptance}% acceptance
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {problem.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Code Editor */}
        <Card className="shadow-card h-[calc(100vh-200px)] overflow-hidden flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedProblem.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Badge className={getDifficultyColor(selectedProblem.difficulty)}>
                    {selectedProblem.difficulty}
                  </Badge>
                  {selectedProblem.tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
            <Tabs defaultValue="description" className="flex-1 flex flex-col">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="solution">Solution</TabsTrigger>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Problem Description</h3>
                    <p className="text-muted-foreground">
                      Solve the problem using your preferred programming language. 
                      The problem involves {selectedProblem.tags.join(", ").toLowerCase()} concepts.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Example</h3>
                    <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                      <p>Input: [2, 7, 11, 15], target = 9</p>
                      <p>Output: [0, 1]</p>
                      <p className="text-muted-foreground mt-2">
                        Explanation: nums[0] + nums[1] = 2 + 7 = 9
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Constraints</h3>
                    <ul className="space-y-1 text-muted-foreground text-sm list-disc list-inside">
                      <li>2 ≤ nums.length ≤ 10^4</li>
                      <li>-10^9 ≤ nums[i] ≤ 10^9</li>
                      <li>-10^9 ≤ target ≤ 10^9</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="solution" className="flex-1">
                <p className="text-muted-foreground">
                  Solution will be available after you submit your code.
                </p>
              </TabsContent>

              <TabsContent value="submissions" className="flex-1">
                <p className="text-muted-foreground">
                  Your submission history will appear here.
                </p>
              </TabsContent>
            </Tabs>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Code Editor</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRun} 
                    disabled={isRunning}
                    className="gap-2"
                  >
                    <Play className="h-4 w-4" />
                    {isRunning ? "Running..." : "Run"}
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSubmit} 
                    disabled={isRunning}
                    className="gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Submit
                  </Button>
                </div>
              </div>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono text-sm min-h-[300px] resize-none"
                placeholder="Write your code here..."
              />
              <div className="bg-muted p-3 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Output</h4>
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {output || "Run your code to see the output here..."}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
