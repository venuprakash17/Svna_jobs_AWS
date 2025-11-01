import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.77.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { filePath, bucket } = await req.json();
    
    if (!filePath || !bucket) {
      throw new Error('Missing filePath or bucket parameter');
    }

    console.log(`Parsing document: ${filePath} from bucket: ${bucket}`);

    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(bucket)
      .download(filePath);

    if (downloadError) {
      console.error('Download error:', downloadError);
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }

    console.log('File downloaded successfully');

    // Get file extension
    const fileExtension = filePath.split('.').pop()?.toLowerCase();
    
    let extractedText = '';

    if (fileExtension === 'txt') {
      // For text files, just read the content
      extractedText = await fileData.text();
    } else if (fileExtension === 'pdf') {
      // For PDF files, use a PDF parsing service
      // We'll use pdf.js via npm.reversehttp.com which provides a simple API
      const arrayBuffer = await fileData.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      // Use a simple PDF text extraction approach
      // For production, you might want to use a dedicated service
      try {
        const pdfResponse = await fetch('https://api.pdf.co/v1/pdf/convert/to/text', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': Deno.env.get('PDF_CO_API_KEY') || 'demo', // Demo key for testing
          },
          body: JSON.stringify({
            url: '', // We'll use inline base64 instead
            inline: true,
            file: base64,
          })
        });

        if (pdfResponse.ok) {
          const result = await pdfResponse.json();
          extractedText = result.body || '';
        } else {
          // Fallback: Return a message asking user to paste text
          throw new Error('PDF parsing service unavailable');
        }
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        // If PDF parsing fails, return a helpful error
        throw new Error('Unable to parse PDF. Please copy the text and use the text area instead.');
      }
    } else if (fileExtension === 'doc' || fileExtension === 'docx') {
      // For DOC/DOCX files, these require more complex parsing
      // For now, we'll return a message asking user to convert or paste text
      throw new Error('DOC/DOCX parsing not yet supported. Please convert to PDF or paste the text directly.');
    } else {
      throw new Error('Unsupported file format');
    }

    // Clean up the file from storage after extraction
    await supabase.storage.from(bucket).remove([filePath]);
    
    console.log(`Successfully extracted ${extractedText.length} characters`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        text: extractedText,
        length: extractedText.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in parse-document function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
