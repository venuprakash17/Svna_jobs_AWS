export const studentDashboardData = {
  resumeCompletion: 78,
  atsScore: 82,
  nextPlacementDrive: {
    company: "Google India",
    date: "2025-11-15",
    role: "Software Engineer",
    status: "Registered"
  },
  attendance: {
    overall: 84,
    subjects: [
      { name: "Data Structures", percentage: 92, status: "good" },
      { name: "Machine Learning", percentage: 78, status: "good" },
      { name: "Web Development", percentage: 65, status: "warning" },
      { name: "Database Systems", percentage: 88, status: "good" },
    ]
  },
  codingStats: {
    totalSolved: 145,
    easyCount: 67,
    mediumCount: 58,
    hardCount: 20,
    weeklyStreak: 12
  },
  upcomingTests: [
    { id: 1, title: "DSA Assessment", date: "2025-11-05", type: "College" },
    { id: 2, title: "Aptitude Test", date: "2025-11-08", type: "Placement" },
  ],
  recentJobs: [
    { 
      id: 1, 
      company: "Microsoft", 
      role: "SDE Intern", 
      deadline: "2025-11-10",
      ctc: "₹8 LPA",
      status: "Applied"
    },
    { 
      id: 2, 
      company: "Amazon", 
      role: "Software Engineer", 
      deadline: "2025-11-20",
      ctc: "₹12 LPA",
      status: "Not Applied"
    },
  ]
};

export const resumeAnalytics = {
  atsScore: 82,
  improvements: [
    { category: "Keywords", score: 75, suggestions: "Add more domain-specific keywords" },
    { category: "Format", score: 90, suggestions: "Good formatting structure" },
    { category: "Experience", score: 80, suggestions: "Quantify achievements with numbers" },
    { category: "Skills", score: 85, suggestions: "Add certification dates" },
  ],
  aiSuggestions: [
    "Highlight leadership roles in project descriptions",
    "Add metrics to quantify impact (e.g., improved performance by 40%)",
    "Include relevant coursework for target role"
  ]
};
