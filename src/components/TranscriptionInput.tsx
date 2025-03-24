
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CardContent, Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Clock, FileText, Loader2, Sparkles, Save, AlertCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LogEntry } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';
import GeminiApiKeySetup from "./GeminiApiKeySetup";

interface TranscriptionInputProps {
  onLogsGenerated: (logs: LogEntry[]) => void;
}

const TranscriptionInput: React.FC<TranscriptionInputProps> = ({ onLogsGenerated }) => {
  const [transcription, setTranscription] = useState('');
  const [transcriptionTitle, setTranscriptionTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [processedLogs, setProcessedLogs] = useState<LogEntry[]>([]);
  const { toast } = useToast();

  const processTranscription = async () => {
    if (!transcription.trim()) {
      toast({
        title: "Error",
        description: "Please enter a transcription to process",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      toast({
        title: "Processing",
        description: "Analyzing transcription with Gemini AI...",
      });
      
      // Call the Supabase Edge Function to process transcription
      const { data, error } = await supabase.functions.invoke('process-transcription', {
        body: { text: transcription }
      });

      if (error) {
        // Check if the error is related to the Gemini API key
        if (error.message?.includes('API key not configured') || 
            error.message?.includes('Gemini API key')) {
          throw new Error('Gemini API key not configured. Please set up your API key.');
        }
        throw error;
      }

      if (!data.logs || data.logs.length === 0) {
        throw new Error('No logs were generated from the transcription');
      }

      // Add IDs and timestamps to the logs if they don't have them
      const processedLogs = data.logs.map((log: Partial<LogEntry>) => ({
        ...log,
        id: log.id || uuidv4(),
        timestamp: log.timestamp || new Date().toISOString(),
        status: log.status || "completed",
        referenceId: log.referenceId || `REF-${Math.floor(Math.random() * 10000)}`,
      })) as LogEntry[];
      
      setProcessedLogs(processedLogs);

      // Save logs to Supabase
      await saveLogsToSupabase(processedLogs);

      onLogsGenerated(processedLogs);
      
      toast({
        title: "Success",
        description: `Generated ${processedLogs.length} log entries using Gemini AI`,
      });
      
      // Open the save dialog automatically
      setSaveDialogOpen(true);
    } catch (error) {
      console.error("Error processing transcription:", error);
      
      // Check if it's a Gemini API key error
      if (error.message?.includes('API key not configured') || 
          error.message?.includes('Gemini API key')) {
        toast({
          title: "API Key Required",
          description: "Please configure your Gemini API key to use AI-powered transcription analysis.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to process transcription. Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const saveLogsToSupabase = async (logs: LogEntry[]): Promise<void> => {
    try {
      setIsSaving(true);
      
      // Check if the 'activity_logs' table exists, create it if not
      const { error: tableCheckError } = await supabase
        .from('activity_logs')
        .select('id')
        .limit(1);
      
      if (tableCheckError && tableCheckError.message.includes('does not exist')) {
        // Table doesn't exist, need to create it first via an alert
        toast({
          title: "Database Setup Required",
          description: "Please go to your Supabase dashboard and create an 'activity_logs' table to enable persistence.",
          variant: "destructive",
          duration: 10000,
        });
        return;
      }
      
      // Insert logs into Supabase
      const { error } = await supabase
        .from('activity_logs')
        .insert(logs.map(log => ({
          id: log.id,
          timestamp: log.timestamp,
          location: log.location,
          activity_category: log.activityCategory,
          activity_type: log.activityType,
          equipment: log.equipment,
          personnel: log.personnel,
          material: log.material,
          measurement: log.measurement,
          status: log.status,
          notes: log.notes,
          media: log.media,
          reference_id: log.referenceId,
          coordinates: log.coordinates
        })));
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Data Saved",
        description: `Successfully saved ${logs.length} logs to the database.`,
      });
    } catch (error) {
      console.error("Error saving logs to Supabase:", error);
      toast({
        title: "Error",
        description: "Failed to save logs to database. Please check your Supabase configuration.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const saveTranscription = async () => {
    try {
      setIsSaving(true);
      
      // Check if transcriptions table exists
      const { error: tableCheckError } = await supabase
        .from('transcriptions')
        .select('id')
        .limit(1);
      
      if (tableCheckError && tableCheckError.message.includes('does not exist')) {
        toast({
          title: "Creating Transcriptions Table",
          description: "Setting up the transcriptions table for the first time...",
        });
        
        // We don't create the table here but inform the user to run SQL
        toast({
          title: "Database Setup Required",
          description: "Please run the SQL setup commands to create the transcriptions table.",
          variant: "destructive",
          duration: 10000,
        });
        return;
      }
      
      // Save the transcription
      const { error } = await supabase
        .from('transcriptions')
        .insert({
          id: uuidv4(),
          text: transcription,
          title: transcriptionTitle || `Transcription ${new Date().toLocaleString()}`,
          logs_generated: processedLogs.length
        });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Transcription Saved",
        description: "Your transcription has been saved for future reference.",
      });
      
      // Clear the fields and close dialog
      setSaveDialogOpen(false);
      setTranscriptionTitle('');
      setTranscription('');
      
    } catch (error) {
      console.error("Error saving transcription:", error);
      toast({
        title: "Error",
        description: "Failed to save transcription.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <GeminiApiKeySetup />
      
      <Card className="glass mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center mb-4">
            <FileText className="w-5 h-5 mr-2 text-primary" />
            <h2 className="text-lg font-medium">Enter Video Transcription</h2>
          </div>
          
          <Textarea
            placeholder="Paste your video transcription text here..."
            className="min-h-[200px] mb-4"
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
          />
          
          <div className="flex justify-end space-x-2">
            <Button 
              onClick={() => setSaveDialogOpen(true)} 
              variant="outline"
              disabled={!transcription.trim()}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Transcription
            </Button>
            
            <Button 
              onClick={processTranscription} 
              disabled={isProcessing || isSaving || !transcription.trim()}
              className="relative group"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4 group-hover:text-yellow-300 transition-colors" />
                  Generate Logs
                </>
              )}
              <span className="absolute -top-1 -right-1 flex h-3 w-3 group-hover:opacity-100 opacity-0 transition-opacity">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Transcription</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Transcription Title
              </label>
              <Input
                id="title"
                placeholder="Enter a title for this transcription"
                value={transcriptionTitle}
                onChange={(e) => setTranscriptionTitle(e.target.value)}
              />
            </div>
            
            {processedLogs.length > 0 && (
              <div className="p-3 bg-secondary/20 rounded">
                <p className="text-sm">
                  <span className="font-medium">{processedLogs.length}</span> logs were generated from this transcription
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={saveTranscription} 
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Transcription'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TranscriptionInput;
