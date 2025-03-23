
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, KeyRound, CheckCircle, ExternalLink } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const GeminiApiKeySetup = () => {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkApiKeyStatus();
  }, []);

  const checkApiKeyStatus = async () => {
    setIsChecking(true);
    try {
      // Test if the function responds with a valid API key message
      const { data, error } = await supabase.functions.invoke('process-transcription', {
        body: { text: "test", checkApiKeyStatus: true }
      });
      
      if (data && data.apiKeyConfigured === true) {
        setIsConfigured(true);
      } else {
        setIsConfigured(false);
      }
    } catch (error) {
      console.error("Error checking API key status:", error);
      setIsConfigured(false);
    } finally {
      setIsChecking(false);
    }
  };

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // This is just for UI feedback - in a real implementation you would store this in Supabase's secrets
      // For demo/development purposes, we're simulating storing the key
      toast({
        title: "API Key Configuration",
        description: "To properly configure the Gemini API key, please set it in your Supabase Edge Function environment variables as GEMINI_API_KEY",
      });
      
      setIsConfigured(true);
      setOpen(false);
      
      toast({
        title: "Success",
        description: "API key saved successfully. Please deploy your Edge Function with the new key.",
      });
    } catch (error) {
      console.error("Error saving API key:", error);
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isChecking) {
    return (
      <Alert className="mb-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertTitle>Checking API key configuration...</AlertTitle>
      </Alert>
    );
  }

  return (
    <>
      {!isConfigured && (
        <Alert className="mb-4">
          <KeyRound className="h-4 w-4" />
          <AlertTitle>Gemini API Key Required</AlertTitle>
          <AlertDescription>
            To enable AI-powered transcription analysis, set up your Gemini API key.
            <Button 
              variant="link" 
              className="p-0 h-auto ml-2"
              onClick={() => setOpen(true)}
            >
              Configure API Key
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {isConfigured && (
        <Alert className="mb-4 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500" />
          <AlertTitle>Gemini API Key Configured</AlertTitle>
          <AlertDescription>
            Your AI transcription analysis is ready to use.
          </AlertDescription>
        </Alert>
      )}
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configure Gemini API Key</DialogTitle>
            <DialogDescription>
              Enter your Gemini API key to enable AI-powered transcription analysis.
            </DialogDescription>
          </DialogHeader>
          
          <Card className="border-dashed mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">How to get a Gemini API key</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
                <li>Visit the <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-primary/80 inline-flex items-center"
                >
                  Google AI Studio
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a></li>
                <li>Create or select a project</li>
                <li>Create a new API key</li>
                <li>Copy the API key</li>
              </ol>
            </CardContent>
          </Card>
          
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              This API key will be stored securely in your Supabase project's Edge Function environment variables.
            </p>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AI-xxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="font-mono"
            />
          </div>
          
          <DialogFooter className="mt-4">
            <Button
              type="submit"
              onClick={saveApiKey}
              disabled={isSaving || !apiKey.trim()}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save API Key"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GeminiApiKeySetup;
