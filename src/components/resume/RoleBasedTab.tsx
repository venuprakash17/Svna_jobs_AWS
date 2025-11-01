import { useState } from "react";
import { Briefcase, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ResumePreviewDialog } from "./ResumePreviewDialog";
import { pdf } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { useStudentProfile } from "@/hooks/useStudentProfile";

export function RoleBasedTab() {
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeContent, setResumeContent] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const {
    profile,
    education,
    projects,
    skills,
    certifications,
    achievements,
    extracurricular,
    isLoading,
  } = useStudentProfile();

  const handleGenerateTailoredResume = async () => {
    if (!targetRole.trim()) {
      toast.error("Please enter a target role");
      return;
    }

    if (!profile) {
      toast.error("Please complete your profile first");
      return;
    }

    setIsGenerating(true);

    try {
      // Call generate-resume function with target role and job description
      const { data, error } = await supabase.functions.invoke("generate-resume", {
        body: {
          targetRole,
          jobDescription: jobDescription || undefined
        }
      });

      if (error) throw error;

      if (data.success && data.resumeContent) {
        setResumeContent(data.resumeContent);
        setShowPreview(true);
        toast.success("Tailored resume generated successfully!");
      } else {
        throw new Error(data.error || "Failed to generate resume");
      }
    } catch (error) {
      console.error("Error generating tailored resume:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate resume");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!resumeContent || !profile) return;

    try {
      const styles = StyleSheet.create({
        page: { padding: 30, fontFamily: "Helvetica", fontSize: 11 },
        header: { marginBottom: 20, textAlign: "center", borderBottom: 1, paddingBottom: 10 },
        name: { fontSize: 24, fontWeight: "bold", marginBottom: 5 },
        contact: { fontSize: 10, color: "#666", marginBottom: 2 },
        section: { marginBottom: 15 },
        sectionTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 8, borderBottom: 1, paddingBottom: 3 },
        text: { fontSize: 11, marginBottom: 5, lineHeight: 1.5 },
        item: { marginBottom: 10 },
        itemHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
        itemTitle: { fontSize: 12, fontWeight: "bold" },
        itemDate: { fontSize: 10, color: "#666" },
        itemSubtitle: { fontSize: 10, color: "#666", marginBottom: 3 },
        list: { marginLeft: 10 },
      });

      const MyDocument = () => (
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.header}>
              <Text style={styles.name}>{profile.full_name}</Text>
              <Text style={styles.contact}>{profile.email}</Text>
              {profile.phone_number && <Text style={styles.contact}>{profile.phone_number}</Text>}
              {profile.linkedin_profile && <Text style={styles.contact}>{profile.linkedin_profile}</Text>}
            </View>

            {resumeContent.summary && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Professional Summary</Text>
                <Text style={styles.text}>{resumeContent.summary}</Text>
              </View>
            )}

            {resumeContent.formattedEducation?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {resumeContent.formattedEducation.map((edu: any, idx: number) => {
                  const institution = edu.institution_name || edu.institution || edu.school || edu.university || edu.college;
                  const degree = edu.degree || edu.degree_title || edu.title;
                  const field = edu.field_of_study || edu.major || edu.specialization;
                  const start = edu.start_date || edu.start || edu.startDate;
                  const endRaw = edu.end_date || edu.end || edu.endDate;
                  const isCurrent = (edu.is_current ?? edu.current) ?? (typeof endRaw === 'string' && /present/i.test(endRaw));
                  const end = isCurrent ? 'Present' : endRaw;
                  const cgpa = edu.cgpa_percentage || edu.cgpa || edu.gpa || edu.score;
                  
                  return (
                    <View key={idx} style={styles.item}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle}>{degree || institution}</Text>
                        {(start || end) && <Text style={styles.itemDate}>{start} - {end}</Text>}
                      </View>
                      {(institution || field) && <Text style={styles.itemSubtitle}>{institution || field}</Text>}
                      {cgpa && <Text style={styles.text}>CGPA: {cgpa}</Text>}
                    </View>
                  );
                })}
              </View>
            )}

            {resumeContent.formattedSkills && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                {Object.entries(resumeContent.formattedSkills).map(([category, skills]: [string, any]) => (
                  <Text key={category} style={styles.text}>
                    <Text style={{ fontWeight: "bold" }}>{category}: </Text>
                    {Array.isArray(skills) ? skills.join(", ") : skills}
                  </Text>
                ))}
              </View>
            )}

            {resumeContent.formattedProjects?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Projects</Text>
                {resumeContent.formattedProjects.map((project: any, idx: number) => (
                  <View key={idx} style={styles.item}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{project.project_title}</Text>
                      {(project.duration_start || project.duration_end) && (
                        <Text style={styles.itemDate}>
                          {project.duration_start} - {project.duration_end}
                        </Text>
                      )}
                    </View>
                    {project.description && <Text style={styles.text}>{project.description}</Text>}
                    {project.technologies_used && project.technologies_used.length > 0 && (
                      <Text style={styles.text}>
                        <Text style={{ fontWeight: "bold" }}>Technologies: </Text>
                        {Array.isArray(project.technologies_used)
                          ? project.technologies_used.join(", ")
                          : project.technologies_used}
                      </Text>
                    )}
                    {project.contributions && project.contributions.length > 0 && (
                      <View style={{ marginTop: 4 }}>
                        {project.contributions.map((contribution: string, cIdx: number) => (
                          <Text key={cIdx} style={[styles.text, { marginLeft: 10 }]}>
                            • {contribution}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {resumeContent.formattedCertifications?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                {resumeContent.formattedCertifications.map((cert: any, idx: number) => (
                  <Text key={idx} style={styles.text}>
                    • {cert.certification_name} - {cert.issuing_organization}
                  </Text>
                ))}
              </View>
            )}

            {resumeContent.formattedAchievements?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Achievements</Text>
                {resumeContent.formattedAchievements.map((achievement: any, idx: number) => (
                  <Text key={idx} style={styles.text}>
                    • {achievement.title}
                  </Text>
                ))}
              </View>
            )}

            {resumeContent.formattedExtracurricular?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Extracurricular Activities</Text>
                {resumeContent.formattedExtracurricular.map((activity: any, idx: number) => (
                  <View key={idx} style={styles.item}>
                    <Text style={styles.itemTitle}>
                      {activity.activity_organization}
                      {activity.role && ` - ${activity.role}`}
                    </Text>
                    {activity.description && <Text style={styles.text}>{activity.description}</Text>}
                  </View>
                ))}
              </View>
            )}

            {resumeContent.formattedHobbies?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Hobbies & Interests</Text>
                <Text style={styles.text}>
                  {resumeContent.formattedHobbies
                    .map((hobby: any) => typeof hobby === 'string' ? hobby : (hobby.hobby_name || hobby.name || hobby.title || ''))
                    .filter((s: string) => s && s.trim())
                    .join(' • ')}
                </Text>
              </View>
            )}
          </Page>
        </Document>
      );

      const blob = await pdf(<MyDocument />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${profile.full_name.replace(/\s+/g, "_")}_${targetRole.replace(/\s+/g, "_")}_Resume.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Resume downloaded successfully!");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF");
    }
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Generate Role-Specific Resume
          </CardTitle>
          <CardDescription>
            Tailor your resume to match specific job roles and increase your chances of getting hired
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="targetRole">Target Role *</Label>
            <Input
              id="targetRole"
              placeholder="e.g., Software Engineer, Data Scientist, Product Manager"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              disabled={isGenerating}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description (Optional)</Label>
            <Textarea
              id="jobDescription"
              placeholder="Paste the job description here to optimize your resume for specific requirements and keywords..."
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={isGenerating}
            />
          </div>
          <Button
            className="w-full bg-gradient-primary"
            onClick={handleGenerateTailoredResume}
            disabled={isGenerating || !targetRole.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Tailored Resume...
              </>
            ) : (
              <>
                <Briefcase className="h-4 w-4 mr-2" />
                Generate Tailored Resume
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {resumeContent && profile && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Generated Resume</CardTitle>
            <CardDescription>
              Your resume has been tailored for: {targetRole}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={() => setShowPreview(true)} variant="outline" className="flex-1">
                Preview Resume
              </Button>
              <Button onClick={handleDownloadPDF} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <ResumePreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        resumeContent={resumeContent}
        profile={profile}
        onDownload={handleDownloadPDF}
      />
    </div>
  );
}
