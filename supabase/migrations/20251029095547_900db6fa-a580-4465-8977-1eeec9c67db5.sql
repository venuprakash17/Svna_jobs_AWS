-- Create app roles enum
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'faculty', 'student');

-- Create colleges table (managed by super admin)
CREATE TABLE public.colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  college_id UUID REFERENCES public.colleges(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  college_id UUID REFERENCES public.colleges(id),
  UNIQUE (user_id, role, college_id)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create notifications table (admin can create)
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  college_id UUID REFERENCES public.colleges(id),
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create quizzes table (faculty creates)
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  total_marks INTEGER NOT NULL DEFAULT 100,
  college_id UUID REFERENCES public.colleges(id),
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- Create quiz questions
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  marks INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

-- Create quiz attempts
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  total_marks INTEGER,
  answers JSONB,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (quiz_id, user_id)
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Create coding problems table
CREATE TABLE public.coding_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  tags TEXT[],
  test_cases JSONB,
  constraints TEXT,
  college_id UUID REFERENCES public.colleges(id),
  created_by UUID REFERENCES auth.users(id),
  is_placement BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.coding_problems ENABLE ROW LEVEL SECURITY;

-- Create coding submissions
CREATE TABLE public.coding_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID REFERENCES public.coding_problems(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  status TEXT,
  execution_time DECIMAL,
  memory_used DECIMAL,
  test_cases_passed INTEGER,
  total_test_cases INTEGER,
  submitted_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.coding_submissions ENABLE ROW LEVEL SECURITY;

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('present', 'absent', 'late')) NOT NULL,
  college_id UUID REFERENCES public.colleges(id),
  marked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (student_id, subject, date)
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create placement training sessions
CREATE TABLE public.placement_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  session_type TEXT CHECK (session_type IN ('quiz', 'coding', 'mock_interview', 'aptitude')),
  college_id UUID REFERENCES public.colleges(id),
  created_by UUID REFERENCES auth.users(id),
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.placement_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for colleges (super admin only)
CREATE POLICY "Super admins can manage colleges"
ON public.colleges FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Everyone can view colleges"
ON public.colleges FOR SELECT
TO authenticated
USING (true);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Super admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for notifications
CREATE POLICY "Admins can create notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Everyone can view active notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (is_active = true);

-- RLS Policies for quizzes
CREATE POLICY "Faculty can create quizzes"
ON public.quizzes FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Faculty can update their quizzes"
ON public.quizzes FOR UPDATE
TO authenticated
USING (created_by = auth.uid());

CREATE POLICY "Students can view active quizzes"
ON public.quizzes FOR SELECT
TO authenticated
USING (is_active = true);

-- RLS Policies for quiz questions
CREATE POLICY "Faculty can manage quiz questions"
ON public.quiz_questions FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.quizzes
    WHERE quizzes.id = quiz_questions.quiz_id
    AND quizzes.created_by = auth.uid()
  )
);

CREATE POLICY "Students can view questions during quiz"
ON public.quiz_questions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.quizzes
    WHERE quizzes.id = quiz_questions.quiz_id
    AND quizzes.is_active = true
  )
);

-- RLS Policies for quiz attempts
CREATE POLICY "Students can create their own attempts"
ON public.quiz_attempts FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own attempts"
ON public.quiz_attempts FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Faculty can view all attempts"
ON public.quiz_attempts FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for coding problems
CREATE POLICY "Faculty can create coding problems"
ON public.coding_problems FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can view coding problems"
ON public.coding_problems FOR SELECT
TO authenticated
USING (true);

-- RLS Policies for coding submissions
CREATE POLICY "Students can create submissions"
ON public.coding_submissions FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own submissions"
ON public.coding_submissions FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Faculty can view all submissions"
ON public.coding_submissions FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for attendance
CREATE POLICY "Faculty can mark attendance"
ON public.attendance FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'faculty'));

CREATE POLICY "Students can view their attendance"
ON public.attendance FOR SELECT
TO authenticated
USING (student_id = auth.uid());

CREATE POLICY "Faculty can view all attendance"
ON public.attendance FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for placement sessions
CREATE POLICY "Faculty can manage placement sessions"
ON public.placement_sessions FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view active placement sessions"
ON public.placement_sessions FOR SELECT
TO authenticated
USING (is_active = true);

-- Trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_colleges_updated_at
BEFORE UPDATE ON public.colleges
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();