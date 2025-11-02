import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building2, FileQuestion, Code, MessageSquare, Briefcase, ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Company {
  id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
}

interface CompanyMaterial {
  id: string;
  title?: string;
  question?: string;
  topic?: string;
  description?: string;
  difficulty?: string;
  expected_answer?: string;
  key_points?: any;
  dos_and_donts?: any;
}

export default function CompanyTraining() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [quizzes, setQuizzes] = useState<CompanyMaterial[]>([]);
  const [codingProblems, setCodingProblems] = useState<CompanyMaterial[]>([]);
  const [gdTopics, setGdTopics] = useState<CompanyMaterial[]>([]);
  const [interviewQuestions, setInterviewQuestions] = useState<CompanyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchCompanyMaterials(selectedCompany.id);
    }
  }, [selectedCompany]);

  const fetchCompanies = async () => {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setCompanies(data || []);
      if (data && data.length > 0) {
        setSelectedCompany(data[0]);
      }
    }
    setLoading(false);
  };

  const fetchCompanyMaterials = async (companyId: string) => {
    const [quizzesRes, codingRes, gdRes, interviewRes] = await Promise.all([
      supabase.from("company_quizzes").select("*").eq("company_id", companyId).order("created_at", { ascending: false }),
      supabase.from("company_coding_problems").select("*").eq("company_id", companyId).order("created_at", { ascending: false }),
      supabase.from("company_gd_topics").select("*").eq("company_id", companyId).order("created_at", { ascending: false }),
      supabase.from("company_interview_questions").select("*").eq("company_id", companyId).order("created_at", { ascending: false })
    ]);

    if (quizzesRes.error) toast({ title: "Error loading quizzes", description: quizzesRes.error.message, variant: "destructive" });
    else setQuizzes(quizzesRes.data || []);

    if (codingRes.error) toast({ title: "Error loading coding problems", description: codingRes.error.message, variant: "destructive" });
    else setCodingProblems(codingRes.data || []);

    if (gdRes.error) toast({ title: "Error loading GD topics", description: gdRes.error.message, variant: "destructive" });
    else setGdTopics(gdRes.data || []);

    if (interviewRes.error) toast({ title: "Error loading interview questions", description: interviewRes.error.message, variant: "destructive" });
    else setInterviewQuestions(interviewRes.data || []);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy": return "bg-success text-success-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      case "hard": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted";
    }
  };

  if (loading) {
    return <div className="p-6">Loading companies...</div>;
  }

  if (companies.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No companies available yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Company Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Select Company</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {companies.map((company) => (
            <Card
              key={company.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedCompany?.id === company.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedCompany(company)}
            >
              <CardContent className="p-4 text-center">
                {company.logo_url ? (
                  <img src={company.logo_url} alt={company.name} className="h-12 w-12 mx-auto mb-2 object-contain" />
                ) : (
                  <Building2 className="h-12 w-12 mx-auto mb-2 text-primary" />
                )}
                <p className="font-medium text-sm">{company.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Company Materials */}
      {selectedCompany && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              {selectedCompany.name} - Placement Materials
            </CardTitle>
            {selectedCompany.description && (
              <CardDescription>{selectedCompany.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="quizzes" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="quizzes" className="gap-2">
                  <FileQuestion className="h-4 w-4" />
                  Quizzes ({quizzes.length})
                </TabsTrigger>
                <TabsTrigger value="coding" className="gap-2">
                  <Code className="h-4 w-4" />
                  Coding ({codingProblems.length})
                </TabsTrigger>
                <TabsTrigger value="gd" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  GD ({gdTopics.length})
                </TabsTrigger>
                <TabsTrigger value="interview" className="gap-2">
                  <Briefcase className="h-4 w-4" />
                  Interview ({interviewQuestions.length})
                </TabsTrigger>
              </TabsList>

              {/* Quizzes Tab */}
              <TabsContent value="quizzes" className="mt-4 space-y-3">
                {quizzes.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No quizzes available for this company yet</p>
                ) : (
                  quizzes.map((quiz) => (
                    <Card key={quiz.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{quiz.title}</CardTitle>
                            <CardDescription>{quiz.description}</CardDescription>
                            {quiz.difficulty && (
                              <Badge className={`mt-2 ${getDifficultyColor(quiz.difficulty)}`}>
                                {quiz.difficulty}
                              </Badge>
                            )}
                          </div>
                          <Button size="sm">Practice Quiz</Button>
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Coding Problems Tab */}
              <TabsContent value="coding" className="mt-4 space-y-3">
                {codingProblems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No coding problems available for this company yet</p>
                ) : (
                  codingProblems.map((problem) => (
                    <Card key={problem.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">{problem.title}</CardTitle>
                              <Badge className={getDifficultyColor(problem.difficulty || '')}>
                                {problem.difficulty}
                              </Badge>
                            </div>
                            <CardDescription className="mt-2 line-clamp-2">{problem.description}</CardDescription>
                          </div>
                          <Button size="sm">Solve Problem</Button>
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Group Discussion Tab */}
              <TabsContent value="gd" className="mt-4">
                {gdTopics.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No GD topics available for this company yet</p>
                ) : (
                  <Accordion type="single" collapsible className="space-y-3">
                    {gdTopics.map((topic) => (
                      <AccordionItem key={topic.id} value={topic.id} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <span className="font-semibold">{topic.topic}</span>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          {topic.description && (
                            <div>
                              <h4 className="font-semibold mb-2">Description</h4>
                              <p className="text-muted-foreground">{topic.description}</p>
                            </div>
                          )}
                          {topic.key_points && topic.key_points.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Key Points</h4>
                              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                {topic.key_points.map((point, idx) => (
                                  <li key={idx}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {topic.dos_and_donts && (
                            <div className="grid md:grid-cols-2 gap-4">
                              {topic.dos_and_donts.dos && (
                                <div>
                                  <h4 className="font-semibold mb-2 text-success">Do's</h4>
                                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                    {topic.dos_and_donts.dos.map((item, idx) => (
                                      <li key={idx}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {topic.dos_and_donts.donts && (
                                <div>
                                  <h4 className="font-semibold mb-2 text-destructive">Don'ts</h4>
                                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                    {topic.dos_and_donts.donts.map((item, idx) => (
                                      <li key={idx}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </TabsContent>

              {/* Interview Questions Tab */}
              <TabsContent value="interview" className="mt-4">
                {interviewQuestions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No interview questions available for this company yet</p>
                ) : (
                  <Accordion type="single" collapsible className="space-y-3">
                    {interviewQuestions.map((item) => (
                      <AccordionItem key={item.id} value={item.id} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-2 text-left">
                            <span className="font-semibold">{item.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          {item.expected_answer && (
                            <div>
                              <h4 className="font-semibold mb-2">Expected Answer</h4>
                              <p className="text-muted-foreground whitespace-pre-wrap">{item.expected_answer}</p>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
