
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, FileText, MapPin, Trash2, RefreshCw } from "lucide-react";
import { format } from 'date-fns';
import { Tooltip } from "@/components/ui/tooltip";
import { deleteTranscription, fetchTranscriptions } from '@/services/logService';
import { Transcription } from '@/lib/types';
import { toast } from 'sonner';

interface TranscriptionHistoryProps {
  onSelectTranscription: (text: string) => void;
  onRefreshLogs: () => void;
}

const TranscriptionHistory = ({ onSelectTranscription, onRefreshLogs }: TranscriptionHistoryProps) => {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Load transcriptions
  const loadTranscriptions = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTranscriptions();
      setTranscriptions(data);
    } catch (error) {
      console.error("Error loading transcriptions:", error);
      toast.error("Failed to load transcription history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTranscriptions();
  }, []);

  // Handle transcription selection
  const handleSelect = async (id: string) => {
    setSelectedId(id);
    // Find the transcription in our local state
    const transcription = transcriptions.find(t => t.id === id);
    if (transcription) {
      onSelectTranscription(transcription.text);
      toast.success("Transcription loaded");
    }
  };

  // Handle transcription deletion
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card selection when clicking delete
    
    if (confirm("Are you sure you want to delete this transcription and its associated logs?")) {
      setIsLoading(true);
      try {
        await deleteTranscription(id);
        toast.success("Transcription and associated logs deleted");
        loadTranscriptions();
        onRefreshLogs(); // Refresh logs display
      } catch (error) {
        console.error("Error deleting transcription:", error);
        toast.error("Failed to delete transcription");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="glass w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex justify-between items-center">
          <span>Transcription History</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={loadTranscriptions} 
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        <CardDescription>
          Previously processed transcriptions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {transcriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto opacity-50 mb-2" />
              <p>No saved transcriptions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transcriptions.map((transcription) => (
                <Card 
                  key={transcription.id}
                  className={`cursor-pointer transition hover:shadow-md ${selectedId === transcription.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => handleSelect(transcription.id)}
                >
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-base flex justify-between items-center">
                      <span className="truncate">{transcription.title}</span>
                      <Tooltip content="Delete transcription and associated logs">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => handleDelete(transcription.id, e)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </Tooltip>
                    </CardTitle>
                  </CardHeader>
                  <CardFooter className="py-2 px-4 flex justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{format(new Date(transcription.created_at), 'MMM d, yyyy')}</span>
                      </div>
                      {transcription.logs_generated > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {transcription.logs_generated} logs
                        </Badge>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TranscriptionHistory;
