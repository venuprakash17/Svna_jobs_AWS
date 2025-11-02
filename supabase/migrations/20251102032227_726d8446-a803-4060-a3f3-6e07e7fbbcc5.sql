-- Create companies table for placement training
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create company_quizzes table
CREATE TABLE IF NOT EXISTS public.company_quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  questions JSONB NOT NULL,
  difficulty TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create company_coding_problems table
CREATE TABLE IF NOT EXISTS public.company_coding_problems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  sample_input TEXT,
  sample_output TEXT,
  constraints TEXT,
  test_cases JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create company_gd_topics table
CREATE TABLE IF NOT EXISTS public.company_gd_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  description TEXT,
  key_points JSONB,
  dos_and_donts JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create company_interview_questions table
CREATE TABLE IF NOT EXISTS public.company_interview_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  category TEXT,
  expected_answer TEXT,
  tips JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_coding_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_gd_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_interview_questions ENABLE ROW LEVEL SECURITY;

-- Create policies for students to read all company materials
CREATE POLICY "Students can view all companies"
  ON public.companies FOR SELECT
  USING (is_active = true);

CREATE POLICY "Students can view company quizzes"
  ON public.company_quizzes FOR SELECT
  USING (true);

CREATE POLICY "Students can view company coding problems"
  ON public.company_coding_problems FOR SELECT
  USING (true);

CREATE POLICY "Students can view company GD topics"
  ON public.company_gd_topics FOR SELECT
  USING (true);

CREATE POLICY "Students can view company interview questions"
  ON public.company_interview_questions FOR SELECT
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_company_quizzes_company_id ON public.company_quizzes(company_id);
CREATE INDEX idx_company_coding_problems_company_id ON public.company_coding_problems(company_id);
CREATE INDEX idx_company_gd_topics_company_id ON public.company_gd_topics(company_id);
CREATE INDEX idx_company_interview_questions_company_id ON public.company_interview_questions(company_id);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_quizzes_updated_at
  BEFORE UPDATE ON public.company_quizzes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_coding_problems_updated_at
  BEFORE UPDATE ON public.company_coding_problems
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_gd_topics_updated_at
  BEFORE UPDATE ON public.company_gd_topics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_interview_questions_updated_at
  BEFORE UPDATE ON public.company_interview_questions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();