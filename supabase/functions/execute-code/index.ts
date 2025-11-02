import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language, stdin } = await req.json();
    const JUDGE0_API_KEY = Deno.env.get('JUDGE0_API_KEY');

    if (!JUDGE0_API_KEY) {
      throw new Error('JUDGE0_API_KEY not configured');
    }

    // Language ID mapping for Judge0
    const languageIds: Record<string, number> = {
      'python': 71,     // Python 3
      'javascript': 63, // JavaScript (Node.js)
      'java': 62,       // Java
      'cpp': 54,        // C++ (GCC 9.2.0)
      'c': 50,          // C (GCC 9.2.0)
    };

    const languageId = languageIds[language.toLowerCase()];
    if (!languageId) {
      return new Response(
        JSON.stringify({ error: 'Unsupported language' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Submitting code to Judge0...', { language, languageId });

    // Submit code to Judge0
    const submitResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': JUDGE0_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
      body: JSON.stringify({
        language_id: languageId,
        source_code: code,
        stdin: stdin || '',
      }),
    });

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      console.error('Judge0 submission error:', submitResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to submit code to Judge0', details: errorText }),
        { status: submitResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await submitResponse.json();
    console.log('Judge0 response:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in execute-code function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
