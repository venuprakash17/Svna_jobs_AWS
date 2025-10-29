-- Create trigger function to auto-assign student role on signup
CREATE OR REPLACE FUNCTION public.assign_student_role_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Only assign student role if no role exists yet
  -- This prevents overriding super admin auto-assignment
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = NEW.id
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'student')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to execute the function on user signup
CREATE TRIGGER on_user_signup_assign_student_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_student_role_on_signup();

-- Block all client-side INSERT attempts to user_roles
-- This prevents privilege escalation attacks while allowing triggers to work
CREATE POLICY "Block direct role insertion from clients"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (false);