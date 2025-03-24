
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, ChevronDown, ChevronUp, Clipboard, Download, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Transcription {
  id: string;
  text: string;
  created_at: string;
  title: string;
  log_count: number;
}

const TranscriptionHistory: React.FC = () => {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  
  useEffect(() => {
    fetchTranscriptions();
  }, []);
  
  const fetchTranscriptions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transcriptions')
        .select('*, logs:activity_logs(count)')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Transform the data to include log count
      const formattedData = data.map(item => ({
        ...item,
        log_count: item.logs[0]?.count || 0
      }));
      
      setTranscriptions(formattedData);
    } catch (error) {
      console.error("Error fetching transcriptions:", error);
      toast({
        title: "Error",
        description: "Failed to load saved transcriptions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteTranscription = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transcriptions')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setTranscriptions(prev => prev.filter(t => t.id !== id));
      
      toast({
        title: "Deleted",
        description: "Transcription successfully removed",
      });
    } catch (error) {
      console.error("Error deleting transcription:", error);
      toast({
        title: "Error",
        description: "Failed to delete transcription",
        variant: "destructive",
      });
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Transcription copied to clipboard",
    });
  };
  
  const downloadAsText = (text: string, title: string) => {
    const element = document.createElement('a');
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${title || 'transcription'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  if (isLoading) {
    return (
      <Card className="glass mt-6">
        <CardContent className="pt-6 flex justify-center items-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Loading saved transcriptions...</span>
        </CardContent>
      </Card>
    );
  }
  
  if (transcriptions.length === 0) {
    return (
      <Card className="glass mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <CalendarCheck className="w-5 h-5 mr-2 text-primary" />
            Transcription History
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          <p>No saved transcriptions yet</p>
          <p className="text-sm mt-2">Transcriptions you save will appear here for future reference</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="glass mt-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <CalendarCheck className="w-5 h-5 mr-2 text-primary" />
            Transcription History
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchTranscriptions}
          >
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {transcriptions.map((transcription) => (
          <Collapsible
            key={transcription.id}
            open={openItems[transcription.id]}
            onOpenChange={() => toggleItem(transcription.id)}
            className="border rounded-md"
          >
            <CollapsibleTrigger asChild>
              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-secondary/10">
                <div>
                  <div className="font-medium flex items-center">
                    {transcription.title || `Transcription from ${format(new Date(transcription.created_at), 'PPP')}`}
                    <Badge variant="outline" className="ml-2">
                      {transcription.log_count} logs
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(transcription.created_at), 'PPp')}
                  </div>
                </div>
                {openItems[transcription.id] ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-4 pt-0 border-t">
                <div className="max-h-60 overflow-y-auto mb-4 p-3 bg-secondary/20 rounded text-sm">
                  {transcription.text}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(transcription.text)}
                  >
                    <Clipboard className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadAsText(transcription.text, transcription.title)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTranscription(transcription.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  );
};

export default TranscriptionHistory;
