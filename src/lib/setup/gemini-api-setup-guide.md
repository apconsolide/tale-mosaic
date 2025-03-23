
# Setting up Gemini API for Transcription Analysis

To enable AI-powered transcription analysis in your application, you need to configure the Gemini API key. Follow these steps:

## 1. Get a Gemini API key

1. Visit the [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create or select a project
4. Create a new API key
5. Copy the API key (it starts with "AI-")

## 2. Configure your Supabase Edge Function

1. Go to your Supabase project dashboard
2. Navigate to Edge Functions
3. Select the "process-transcription" function
4. Add a new secret with the key `GEMINI_API_KEY` and paste your Gemini API key as the value
5. Deploy the function with the new environment variable

## 3. Test the integration

After setting up the API key, return to your application and test the transcription analysis feature. The system will automatically use Gemini AI to analyze your transcriptions and generate detailed activity logs.

## Troubleshooting

If you encounter issues:

1. Make sure your API key is valid and has not expired
2. Check that the environment variable is correctly named `GEMINI_API_KEY`
3. Verify that your Supabase Edge Function has been redeployed after adding the secret
4. Check the Edge Function logs in your Supabase dashboard for any error messages
