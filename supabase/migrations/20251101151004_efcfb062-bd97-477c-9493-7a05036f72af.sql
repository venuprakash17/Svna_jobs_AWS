-- Create hobbies table
CREATE TABLE public.hobbies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hobby_name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.hobbies ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own hobbies"
ON public.hobbies
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own hobbies"
ON public.hobbies
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hobbies"
ON public.hobbies
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hobbies"
ON public.hobbies
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_hobbies_updated_at
BEFORE UPDATE ON public.hobbies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();