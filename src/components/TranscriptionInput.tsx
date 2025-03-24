
import React, { useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { Bot, LucideFileAudio, Save, Loader2, Brain, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { saveLogs, saveTranscription } from '@/services/logService';
import { LogEntry } from '@/lib/types';
import { Input } from './ui/input';

interface TranscriptionInputProps {
  onLogsGenerated: (logs: LogEntry[]) => void;
}

const TranscriptionInput = ({ onLogsGenerated }: TranscriptionInputProps) => {
  const [transcriptionText, setTranscriptionText] = useState('');
  const [title, setTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const [preferredProcessor, setPreferredProcessor] = useState('gemini');
  const [lastGeneratedLogs, setLastGeneratedLogs] = useState<LogEntry[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sample work log text for demonstration
  const sampleText = `At the Massey's Test Facility, the team completed the installation of hydraulic systems on Booster 9. They finished connecting all the propellant lines and tested for leaks using nitrogen.

At the Sanchez Site, crews are continuing the construction of the second orbital launch mount. They've now completed about 70% of the structural steel work and are preparing to install the water deluge system next week.

The transport team moved Ship 28 from the High Bay to the launch pad this morning using the SPMTs. It took approximately 3 hours to complete the roll-out operation.

At the Tank Farm, technicians are upgrading the LOX storage capacity by adding two additional tanks. They report that the foundation work is complete and the first tank will be delivered tomorrow.`;

  // Load the sample text
  const loadSample = () => {
    setTranscriptionText(sampleText);
    setTitle('Test Facility Activities Update');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Process the transcription through the Edge Function
  const processTranscription = useCallback(async () => {
    if (!transcriptionText.trim()) {
      toast.error('Please enter some text to process');
      return;
    }

    if (!title.trim()) {
      setTitle(`Transcription - ${new Date().toLocaleDateString()}`);
    }

    setIsProcessing(true);
    setActiveTab('processing');

    try {
      // Call the Edge Function to process the transcription
      const response = await fetch('https://uimwsuqaotboepbuflio.supabase.co/functions/v1/process-transcription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: transcriptionText,
          preferredProcessor
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error processing transcription');
      }

      const result = await response.json();
      
      if (result.logs && result.logs.length > 0) {
        toast.success(
          `Successfully extracted ${result.logs.length} activities${result.fromCache ? ' (from cache)' : ''}`
        );
        
        // Update state with the generated logs
        setLastGeneratedLogs(result.logs);
        
        // Call the parent component's handler to update the logs
        onLogsGenerated(result.logs);
        
        // Switch to the "save" tab
        setActiveTab('save');
      } else {
        toast.error('No activities could be extracted from the text');
      }
    } catch (error) {
      console.error('Error processing transcription:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process transcription');
      setActiveTab('input');
    } finally {
      setIsProcessing(false);
    }
  }, [transcriptionText, preferredProcessor, title, onLogsGenerated]);

  // Save the transcription and logs to the database
  const saveToDatabase = async () => {
    if (lastGeneratedLogs.length === 0) {
      toast.error('No logs to save');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a title for this transcription');
      return;
    }

    setIsSaving(true);
    try {
      // First save the transcription
      const transcriptionId = await saveTranscription(
        transcriptionText,
        title,
        lastGeneratedLogs.length
      );
      
      // Then save the logs with the transcription_id
      await saveLogs(lastGeneratedLogs, transcriptionId);
      
      toast.success('Transcription and logs saved successfully');
      
      // Reset the form
      setTranscriptionText('');
      setTitle('');
      setLastGeneratedLogs([]);
      setActiveTab('input');
    } catch (error) {
      console.error('Error saving transcription:', error);
      toast.error('Failed to save transcription and logs');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="glass w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          Transcription Processor
        </CardTitle>
        <CardDescription>
          Convert work logs into structured activity data
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <CardContent>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="save" disabled={lastGeneratedLogs.length === 0}>Save</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="space-y-4">
            <div>
              <Input
                placeholder="Enter a title for this transcription"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-2"
              />
              <Textarea
                ref={textareaRef}
                placeholder="Paste or type work log transcription here..."
                className="min-h-[300px] font-mono text-sm"
                value={transcriptionText}
                onChange={(e) => setTranscriptionText(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={loadSample}
              >
                Load Sample
              </Button>
              
              <div className="ml-auto flex items-center space-x-2">
                <Tooltip content="Use Gemini AI for better extraction (requires API key)">
                  <div className="flex items-center">
                    <Button
                      variant={preferredProcessor === 'gemini' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreferredProcessor('gemini')}
                      className="rounded-r-none"
                    >
                      <Brain className="mr-1 h-4 w-4" />
                      Gemini AI
                    </Button>
                  </div>
                </Tooltip>
                
                <Tooltip content="Use rule-based extraction (no AI)">
                  <Button
                    variant={preferredProcessor === 'rule-based' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreferredProcessor('rule-based')}
                    className="rounded-l-none"
                  >
                    <Bot className="mr-1 h-4 w-4" />
                    Rule-based
                  </Button>
                </Tooltip>
              </div>
              
              <Button 
                onClick={processTranscription} 
                disabled={!transcriptionText.trim() || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Process
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="processing" className="min-h-[300px] flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
            <h3 className="text-lg font-medium">Processing Transcription</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Extracting activities from your work log...
            </p>
          </TabsContent>
          
          <TabsContent value="save" className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Processing Results</h3>
                <Badge variant="outline">{lastGeneratedLogs.length} activities found</Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                The following activities were extracted from your transcription. You can review them on the map and in the table below.
              </p>
              
              <div className="flex">
                <Button
                  variant="default"
                  onClick={saveToDatabase}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Transcription & Logs
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  className="ml-auto"
                  onClick={() => {
                    setTranscriptionText('');
                    setTitle('');
                    setLastGeneratedLogs([]);
                    setActiveTab('input');
                  }}
                >
                  Start New
                </Button>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default TranscriptionInput;
