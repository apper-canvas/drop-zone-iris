export default {
  async handler(request) {
    try {
      // Get the OpenAI API key from environment
      const apiKey = await globalThis.apper.getSecret('OPENAI_API_KEY');
      
      if (!apiKey) {
        return new globalThis.Response(JSON.stringify({
          success: false,
          error: 'OpenAI API key not configured'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Parse request body
      const { imageData, fileName, mimeType } = await request.json();
      
if (!imageData || !mimeType?.startsWith('image/')) {
        return new globalThis.Response(JSON.stringify({
          success: false,
          error: 'Invalid image data or file type'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Call OpenAI Vision API
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Provide a brief, single-line description of what you see in this image. Keep it concise and informative.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageData
                  }
                }
              ]
            }
          ],
          max_tokens: 100,
          temperature: 0.3
        })
      });

      if (!openaiResponse.ok) {
const error = await openaiResponse.text();
        return new globalThis.Response(JSON.stringify({
          success: false,
          error: 'OpenAI API request failed',
          details: error
        }), {
          status: openaiResponse.status,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const result = await openaiResponse.json();
      const description = result.choices?.[0]?.message?.content?.trim();

if (!description) {
        return new globalThis.Response(JSON.stringify({
          success: false,
          error: 'No description received from OpenAI'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
return new globalThis.Response(JSON.stringify({
        success: true,
        description: description
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

} catch (error) {
      return new globalThis.Response(JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};