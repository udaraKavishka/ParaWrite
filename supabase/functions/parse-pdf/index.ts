// @ts-expect-error - Deno imports are not recognized by TypeScript in this workspace config
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      return new Response(
        JSON.stringify({ error: 'File must be a PDF' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    // Simple PDF text extraction
    // This is a basic implementation - for production, consider using a more robust library
    const decoder = new TextDecoder('utf-8')
    let text = decoder.decode(uint8Array)
    
    // Extract text between stream and endstream markers
    const streamRegex = /stream\s*([\s\S]*?)\s*endstream/g
    let matches: RegExpExecArray | null
    let extractedText = ''
    
    while ((matches = streamRegex.exec(text)) !== null) {
      const streamContent = matches[1]
      // Try to extract readable text
      const readableText = streamContent.replace(/[^\x20-\x7E\n]/g, ' ')
      extractedText += readableText + '\n'
    }

    // Clean up the extracted text
    extractedText = extractedText
      .replace(/\s+/g, ' ')
      .replace(/\\n/g, '\n')
      .trim()

    // If no text was extracted from streams, try direct extraction
    if (extractedText.length < 10) {
      text = text.replace(/[^\x20-\x7E\n]/g, ' ')
      extractedText = text
        .replace(/\s+/g, ' ')
        .trim()
    }

    return new Response(
      JSON.stringify({ 
        text: extractedText,
        success: true 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error processing PDF:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to process PDF',
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
