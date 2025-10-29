// ============================================
// STUDENT DATA
// ============================================

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
      { name: "Computer Networks", percentage: 58, status: "danger" },
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
    { id: 1, title: "DSA Assessment", date: "2025-11-05", type: "College", duration: "90 mins" },
    { id: 2, title: "Aptitude Test", date: "2025-11-08", type: "Placement", duration: "60 mins" },
    { id: 3, title: "Python Programming", date: "2025-11-12", type: "College", duration: "120 mins" },
  ],
  recentJobs: [
    { 
      id: 1, 
      company: "Microsoft", 
      role: "SDE Intern", 
      deadline: "2025-11-10",
      ctc: "₹8 LPA",
      status: "Applied",
      location: "Bangalore"
    },
    { 
      id: 2, 
      company: "Amazon", 
      role: "Software Engineer", 
      deadline: "2025-11-20",
      ctc: "₹12 LPA",
      status: "Not Applied",
      location: "Hyderabad"
    },
    { 
      id: 3, 
      company: "Flipkart", 
      role: "Full Stack Developer", 
      deadline: "2025-11-18",
      ctc: "₹10 LPA",
      status: "Not Applied",
      location: "Bangalore"
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
  ],
  trendData: [
    { month: "Jun", score: 65 },
    { month: "Jul", score: 70 },
    { month: "Aug", score: 75 },
    { month: "Sep", score: 78 },
    { month: "Oct", score: 82 },
  ]
};

export const codingProblems = [
  { id: 1, title: "Two Sum", difficulty: "Easy", tags: ["Array", "Hash Table"], solved: true, acceptance: 45 },
  { id: 2, title: "Add Two Numbers", difficulty: "Medium", tags: ["Linked List"], solved: true, acceptance: 38 },
  { id: 3, title: "Longest Substring", difficulty: "Medium", tags: ["String", "Sliding Window"], solved: false, acceptance: 33 },
  { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", tags: ["Array", "Binary Search"], solved: false, acceptance: 35 },
  { id: 5, title: "Valid Parentheses", difficulty: "Easy", tags: ["Stack", "String"], solved: true, acceptance: 40 },
  { id: 6, title: "Merge K Sorted Lists", difficulty: "Hard", tags: ["Linked List", "Heap"], solved: false, acceptance: 47 },
];

export const allJobs = [
  {
    id: 1,
    company: "Microsoft",
    logo: "M",
    role: "SDE Intern",
    location: "Bangalore",
    ctc: "₹8 LPA",
    type: "On-Campus",
    deadline: "2025-11-10",
    posted: "2025-10-20",
    description: "Looking for passionate developers with strong DSA skills",
    requirements: ["B.Tech/M.Tech", "CGPA > 7.5", "Strong coding skills"],
    status: "Applied",
    rounds: ["Aptitude", "Technical Round 1", "Technical Round 2", "HR"]
  },
  {
    id: 2,
    company: "Amazon",
    logo: "A",
    role: "Software Engineer",
    location: "Hyderabad",
    ctc: "₹12 LPA",
    type: "On-Campus",
    deadline: "2025-11-20",
    posted: "2025-10-22",
    description: "Join one of the world's most customer-centric companies",
    requirements: ["B.Tech/M.Tech", "CGPA > 7.0", "Problem solving"],
    status: "Not Applied",
    rounds: ["Online Test", "Technical Interview", "Bar Raiser", "HR"]
  },
  {
    id: 3,
    company: "Flipkart",
    logo: "F",
    role: "Full Stack Developer",
    location: "Bangalore",
    ctc: "₹10 LPA",
    type: "Aggregated",
    deadline: "2025-11-18",
    posted: "2025-10-25",
    description: "Build scalable e-commerce solutions",
    requirements: ["B.Tech", "CGPA > 7.0", "Full stack experience"],
    status: "Not Applied",
    rounds: ["Coding Test", "Technical Round", "Manager Round"]
  },
  {
    id: 4,
    company: "Google",
    logo: "G",
    role: "Software Engineer Intern",
    location: "Bangalore",
    ctc: "₹10 LPA",
    type: "On-Campus",
    deadline: "2025-11-25",
    posted: "2025-10-28",
    description: "Work on products used by billions",
    requirements: ["B.Tech/M.Tech", "CGPA > 8.0", "Strong fundamentals"],
    status: "Not Applied",
    rounds: ["Phone Screen", "Technical Interview 1", "Technical Interview 2", "Hiring Committee"]
  }
];

export const studentTests = [
  {
    id: 1,
    title: "DSA Assessment",
    type: "College",
    subject: "Data Structures",
    duration: "90 mins",
    totalMarks: 100,
    date: "2025-11-05",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    status: "Upcoming",
    description: "Covers arrays, linked lists, trees, and graphs"
  },
  {
    id: 2,
    title: "Aptitude Test",
    type: "Placement",
    subject: "Quantitative Aptitude",
    duration: "60 mins",
    totalMarks: 100,
    date: "2025-11-08",
    startTime: "2:00 PM",
    endTime: "3:00 PM",
    status: "Upcoming",
    description: "Logical reasoning, numerical ability, and verbal"
  },
  {
    id: 3,
    title: "Python Programming",
    type: "College",
    subject: "Programming",
    duration: "120 mins",
    totalMarks: 100,
    date: "2025-10-20",
    startTime: "9:00 AM",
    endTime: "11:00 AM",
    status: "Completed",
    score: 85,
    description: "Python basics, OOP, and data structures"
  }
];

export const attendanceData = [
  { subject: "Data Structures", total: 45, present: 41, percentage: 91, status: "good" },
  { subject: "Machine Learning", total: 38, present: 30, percentage: 79, status: "good" },
  { subject: "Web Development", total: 42, present: 27, percentage: 64, status: "warning" },
  { subject: "Database Systems", total: 40, present: 35, percentage: 88, status: "good" },
  { subject: "Computer Networks", total: 36, present: 21, percentage: 58, status: "danger" },
  { subject: "Software Engineering", total: 30, present: 25, percentage: 83, status: "good" },
];

// ============================================
// FACULTY DATA
// ============================================

export const facultyDashboardData = {
  totalStudents: 120,
  averageAttendance: 78,
  pendingTests: 3,
  submissionsToReview: 24,
  classPerformance: [
    { subject: "DSA", average: 75, students: 45 },
    { subject: "Web Dev", average: 68, students: 42 },
    { subject: "ML", average: 72, students: 38 },
  ],
  atRiskStudents: [
    { id: 1, name: "Rahul Sharma", attendance: 58, avgMarks: 45, department: "CSE" },
    { id: 2, name: "Priya Patel", attendance: 62, avgMarks: 52, department: "IT" },
    { id: 3, name: "Amit Kumar", attendance: 55, avgMarks: 48, department: "CSE" },
  ],
  recentActivity: [
    { type: "test", message: "DSA Assessment submitted by 35 students", time: "2 hours ago" },
    { type: "attendance", message: "Web Development attendance marked", time: "5 hours ago" },
  ]
};

export const facultyTests = [
  {
    id: 1,
    title: "DSA Mid-term Exam",
    subject: "Data Structures",
    department: "CSE",
    date: "2025-11-05",
    duration: "90 mins",
    totalMarks: 100,
    students: 45,
    submissions: 35,
    status: "Active"
  },
  {
    id: 2,
    title: "Python Programming Quiz",
    subject: "Programming",
    department: "IT",
    date: "2025-10-28",
    duration: "60 mins",
    totalMarks: 50,
    students: 42,
    submissions: 42,
    status: "Completed"
  }
];

export const facultyCodingProblems = [
  {
    id: 1,
    title: "Binary Search Implementation",
    difficulty: "Easy",
    topic: "Searching",
    testCases: 5,
    submissions: 89,
    successRate: 78
  },
  {
    id: 2,
    title: "Linked List Reversal",
    difficulty: "Medium",
    topic: "Linked Lists",
    testCases: 8,
    submissions: 72,
    successRate: 65
  }
];

// ============================================
// ADMIN DATA
// ============================================

export const adminDashboardData = {
  totalStudents: 850,
  totalFaculty: 45,
  departments: 4,
  placementRate: 76,
  departmentStats: [
    { name: "CSE", students: 320, placed: 245, percentage: 77 },
    { name: "IT", students: 280, placed: 215, percentage: 77 },
    { name: "ECE", students: 150, placed: 105, percentage: 70 },
    { name: "EEE", students: 100, placed: 72, percentage: 72 },
  ],
  yearlyTrend: [
    { year: "2021", placed: 68 },
    { year: "2022", placed: 72 },
    { year: "2023", placed: 74 },
    { year: "2024", placed: 76 },
  ],
  topCompanies: [
    { company: "Microsoft", students: 12 },
    { company: "Amazon", students: 15 },
    { company: "Google", students: 8 },
    { company: "Flipkart", students: 18 },
  ]
};

export const adminStudents = [
  {
    id: 1,
    name: "Rajesh Kumar",
    rollNo: "CS21001",
    department: "CSE",
    year: 3,
    cgpa: 8.5,
    resumeCompletion: 85,
    attendance: 88,
    status: "Active"
  },
  {
    id: 2,
    name: "Sneha Reddy",
    rollNo: "IT21045",
    department: "IT",
    year: 3,
    cgpa: 9.1,
    resumeCompletion: 95,
    attendance: 92,
    status: "Active"
  },
  {
    id: 3,
    name: "Vikram Singh",
    rollNo: "CS21089",
    department: "CSE",
    year: 2,
    cgpa: 7.8,
    resumeCompletion: 60,
    attendance: 75,
    status: "Active"
  }
];

export const adminJobs = [
  {
    id: 1,
    company: "Microsoft",
    role: "SDE Intern",
    ctc: "₹8 LPA",
    openDate: "2025-10-20",
    deadline: "2025-11-10",
    applicants: 45,
    status: "Active"
  },
  {
    id: 2,
    company: "Amazon",
    role: "Software Engineer",
    ctc: "₹12 LPA",
    openDate: "2025-10-22",
    deadline: "2025-11-20",
    applicants: 38,
    status: "Active"
  }
];

// ============================================
// SUPER ADMIN DATA
// ============================================

export const superAdminDashboardData = {
  totalColleges: 24,
  totalStudents: 12500,
  activeUsers: 8450,
  avgAtsScore: 74,
  platformUsage: [
    { month: "Jun", users: 6800 },
    { month: "Jul", users: 7200 },
    { month: "Aug", users: 7800 },
    { month: "Sep", users: 8100 },
    { month: "Oct", users: 8450 },
  ],
  collegePerformance: [
    { college: "IIT Delhi", students: 850, avgAts: 88, placement: 92 },
    { college: "NIT Warangal", students: 720, avgAts: 82, placement: 85 },
    { college: "BITS Pilani", students: 680, avgAts: 86, placement: 89 },
    { college: "VIT Vellore", students: 950, avgAts: 78, placement: 80 },
  ],
  featureUsage: {
    resumeBuilder: 8200,
    codingPractice: 6500,
    jobApplications: 7800,
    tests: 5400
  }
};

export const superAdminColleges = [
  {
    id: 1,
    name: "IIT Delhi",
    adminName: "Dr. Ramesh Kumar",
    adminEmail: "admin@iitd.ac.in",
    students: 850,
    faculty: 45,
    lastActive: "2025-10-28",
    status: "Active",
    subscription: "Enterprise"
  },
  {
    id: 2,
    name: "NIT Warangal",
    adminName: "Prof. Lakshmi Devi",
    adminEmail: "admin@nitw.ac.in",
    students: 720,
    faculty: 38,
    lastActive: "2025-10-27",
    status: "Active",
    subscription: "Pro"
  },
  {
    id: 3,
    name: "BITS Pilani",
    adminName: "Dr. Suresh Patel",
    adminEmail: "admin@bits.ac.in",
    students: 680,
    faculty: 42,
    lastActive: "2025-10-26",
    status: "Active",
    subscription: "Enterprise"
  }
];
