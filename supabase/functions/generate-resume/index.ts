import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.77.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const { targetRole } = await req.json();

    // Fetch all student data
    const [profileRes, educationRes, projectsRes, skillsRes, certificationsRes, achievementsRes, extracurricularRes, hobbiesRes] = await Promise.all([
      supabase.from("student_profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("student_education").select("*").eq("user_id", user.id).order("display_order"),
      supabase.from("student_projects").select("*").eq("user_id", user.id).order("display_order"),
      supabase.from("student_skills").select("*").eq("user_id", user.id),
      supabase.from("student_certifications").select("*").eq("user_id", user.id).order("display_order"),
      supabase.from("student_achievements").select("*").eq("user_id", user.id).order("display_order"),
      supabase.from("student_extracurricular").select("*").eq("user_id", user.id).order("display_order"),
      supabase.from("hobbies").select("*").eq("user_id", user.id).order("display_order"),
    ]);

    if (profileRes.error) throw profileRes.error;
    if (!profileRes.data) {
      throw new Error("Profile not found. Please complete your profile first.");
    }

    const profile = profileRes.data;
    const education = educationRes.data || [];
    const projects = projectsRes.data || [];
    const skills = skillsRes.data || [];
    const certifications = certificationsRes.data || [];
    const achievements = achievementsRes.data || [];
    const extracurricular = extracurricularRes.data || [];
    const hobbies = hobbiesRes.data || [];

    // Prepare data for AI
    const resumeData = {
      profile,
      education,
      projects,
      skills,
      certifications,
      achievements,
      extracurricular,
      hobbies,
    };

    // Use Lovable AI to enhance and format resume content
    const systemPrompt = `You are an expert resume writer and ATS optimization specialist. 
Your task is to create an ATS-friendly resume in a structured format that can be easily converted to PDF.

CRITICAL INSTRUCTIONS FOR PROJECTS:
1. For EVERY project, generate a professional, detailed description even if the student didn't provide one
2. Based on the project title and technologies, infer the likely features and create 3-5 compelling bullet points
3. Use strong action verbs (Developed, Implemented, Architected, Optimized, Engineered, Built)
4. Add quantifiable metrics where logical (e.g., "Improved performance by 40%", "Reduced load time by 2 seconds")
5. Highlight technical skills and technologies used
6. Make the description sound professional and impressive while remaining truthful to the project scope
7. If technologies are missing, infer them based on the project title and common tech stacks
8. Format each project with:
   - project_title: Keep original
   - description: 2-3 sentence compelling overview
   - technologies_used: Array of relevant technologies (infer if not provided)
   - contributions: Array of 3-5 bullet points describing what was built/achieved
   - duration_start and duration_end: Keep original
   - github_demo_link: Keep original

Focus on:
- Clear, concise bullet points with action verbs
- Quantifiable achievements
- Keywords relevant to ${targetRole || "the student's field"}
- Professional formatting
- ATS-compatible structure
- Making projects sound impressive and professional

Return ONLY a valid JSON object with the following structure:
{
  "summary": "Professional summary paragraph",
  "formattedEducation": [enhanced education entries],
  "formattedProjects": [
    {
      "project_title": "original title",
      "description": "compelling 2-3 sentence overview",
      "technologies_used": ["tech1", "tech2", ...],
      "contributions": ["bullet point 1", "bullet point 2", ...],
      "duration_start": "original date",
      "duration_end": "original date",
      "github_demo_link": "original link"
    }
  ],
  "formattedSkills": {organized skills by category},
  "formattedCertifications": [formatted certifications],
  "formattedAchievements": [formatted achievements],
  "formattedExtracurricular": [formatted activities],
  "formattedHobbies": [formatted hobbies as strings - only include if provided],
  "atsScore": estimated ATS score (0-100),
  "recommendations": [list of improvement suggestions]
}

EXAMPLE PROJECT ENHANCEMENT:
Input: { "project_title": "AI Resume Builder", "description": "", "technologies_used": [] }
Output: {
  "project_title": "AI Resume Builder",
  "description": "Developed an intelligent resume builder application leveraging AI to optimize resumes for ATS systems. Implemented real-time content enhancement and automated formatting features.",
  "technologies_used": ["React", "Node.js", "TypeScript", "OpenAI API", "Tailwind CSS"],
  "contributions": [
    "Architected and developed a full-stack web application with React frontend and Node.js backend",
    "Integrated OpenAI API to provide AI-powered resume optimization and content suggestions",
    "Implemented ATS scoring algorithm that analyzes resumes against industry standards",
    "Built responsive UI with Tailwind CSS ensuring seamless experience across all devices",
    "Deployed application handling 100+ concurrent users with 99.9% uptime"
  ]
}`;

    const userPrompt = `Create an ATS-optimized resume ${targetRole ? `tailored for ${targetRole} role` : ""} using this data:\n\n${JSON.stringify(resumeData, null, 2)}`;

    console.log("Calling Lovable AI for resume generation...");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      if (response.status === 429) {
        throw new Error("Rate limits exceeded, please try again later.");
      }
      if (response.status === 402) {
        throw new Error("Payment required, please add credits to Lovable AI workspace.");
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const enhancedContent = data.choices?.[0]?.message?.content || "";

    if (!enhancedContent) {
      throw new Error("No content in AI response");
    }
    
    console.log("AI Response received");

    // Parse AI response
    let resumeContent;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = enhancedContent.match(/```json\n([\s\S]*?)\n```/) || 
                       enhancedContent.match(/```\n([\s\S]*?)\n```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : enhancedContent;
      resumeContent = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", e);
      // Fallback: return structured data with AI content as text
      resumeContent = {
        summary: enhancedContent,
        formattedEducation: education,
        formattedProjects: projects,
        formattedSkills: skills,
        formattedCertifications: certifications,
        formattedAchievements: achievements,
        formattedExtracurricular: extracurricular,
        formattedHobbies: hobbies,
        atsScore: 75,
        recommendations: ["Complete profile review recommended"],
      };
    }

    // Save resume version
    const { data: resumeVersion, error: saveError } = await supabase
      .from("resume_versions")
      .insert({
        user_id: user.id,
        resume_type: targetRole ? "role-based" : "general",
        target_role: targetRole || null,
        ats_score: resumeContent.atsScore || null,
        metadata: resumeContent,
      })
      .select()
      .single();

    if (saveError) {
      console.error("Error saving resume version:", saveError);
    }

    // Track analytics
    await supabase.from("resume_analytics").insert({
      user_id: user.id,
      action_type: "generate",
      action_details: { targetRole, atsScore: resumeContent.atsScore },
    });

    return new Response(
      JSON.stringify({
        success: true,
        resumeContent,
        resumeId: resumeVersion?.id,
        profile,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-resume:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate resume";
    const errorDetails = error instanceof Error ? error.toString() : String(error);
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorDetails,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
