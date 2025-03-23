
import React, { useState } from 'react';
import { ExternalLink, Terminal, Database, Copy, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Step, StepCircle, StepDescription, StepHeader } from "@/components/ui/steps";
import { supabase } from "@/integrations/supabase/client";

const DatabaseSetupGuide = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [tableExists, setTableExists] = useState<boolean | null>(null);

  // Handle copying SQL to clipboard
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Check if activity_logs table exists
  const checkTableExists = async () => {
    try {
      const { error } = await supabase
        .from('activity_logs')
        .select('id')
        .limit(1);
      
      if (error && error.message.includes('does not exist')) {
        setTableExists(false);
      } else {
        setTableExists(true);
      }
    } catch (error) {
      console.error("Error checking if table exists:", error);
      setTableExists(false);
    }
  };

  // Check table status when component mounts
  React.useEffect(() => {
    checkTableExists();
  }, []);

  // SQL for creating activity_logs table
  const createTableSQL = `-- Create the activity_logs table
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  location TEXT NOT NULL,
  activity_category TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  equipment TEXT NOT NULL,
  personnel TEXT NOT NULL,
  material TEXT NOT NULL,
  measurement TEXT,
  status TEXT NOT NULL,
  notes TEXT,
  media TEXT,
  reference_id TEXT,
  coordinates NUMERIC[] NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add indices for common queries
CREATE INDEX idx_activity_logs_timestamp ON public.activity_logs(timestamp);
CREATE INDEX idx_activity_logs_location ON public.activity_logs(location);
CREATE INDEX idx_activity_logs_activity_category ON public.activity_logs(activity_category);

-- Add a trigger to automatically update the updated_at timestamp
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON public.activity_logs
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Create a materialized view for activity stats (can be refreshed periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS activity_stats AS
SELECT 
  activity_category,
  COUNT(*) as activity_count,
  MIN(timestamp) as first_activity,
  MAX(timestamp) as last_activity
FROM public.activity_logs
GROUP BY activity_category;

-- Create a function to refresh the stats
CREATE OR REPLACE FUNCTION refresh_activity_stats()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW activity_stats;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to refresh stats when activity_logs changes
CREATE TRIGGER refresh_activity_stats_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.activity_logs
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_activity_stats();`;

  return (
    <Card className="glass mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Database Setup Guide
        </CardTitle>
        <CardDescription>
          Follow these steps to set up your Supabase database for storing activity logs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sql">SQL Setup</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="pt-4">
            <div className="space-y-6">
              <Step active={!tableExists} completed={tableExists}>
                <StepCircle active={!tableExists} completed={tableExists} />
                <StepHeader>Create Database Table</StepHeader>
                <StepDescription>
                  Set up the activity_logs table in your Supabase project
                </StepDescription>
              </Step>
              
              <Step active={tableExists} completed={false}>
                <StepCircle active={tableExists} completed={false} />
                <StepHeader>Start Adding Data</StepHeader>
                <StepDescription>
                  Once your database is set up, use the transcription tool to add data
                </StepDescription>
              </Step>
              
              {tableExists === false && (
                <Alert className="mt-6">
                  <AlertDescription>
                    The <code className="font-mono text-sm">activity_logs</code> table doesn't exist yet. 
                    Go to the SQL Setup tab to create it.
                  </AlertDescription>
                </Alert>
              )}
              
              {tableExists === true && (
                <Alert className="mt-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <AlertDescription className="text-green-800 dark:text-green-300">
                    Database is already set up! You can start using the application.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="sql" className="pt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Run this SQL in your Supabase SQL Editor to set up the required tables:
              </p>
              
              <Card className="relative">
                <CardHeader className="p-4 bg-gray-50 dark:bg-gray-900 flex flex-row items-center justify-between">
                  <div className="flex items-center">
                    <Terminal className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">activity_logs.sql</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 px-2"
                    onClick={() => handleCopy(createTableSQL, 0)}
                  >
                    {copiedIndex === 0 ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[300px] w-full">
                    <pre className="p-4 text-xs font-mono">{createTableSQL}</pre>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              <div className="flex items-center pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center text-xs"
                  asChild
                >
                  <a 
                    href="https://supabase.com/dashboard/project/uimwsuqaotboepbuflio/sql/new" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-3 w-3" />
                    Open SQL Editor
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={checkTableExists}
                  className="ml-2 text-xs"
                >
                  Check Table Status
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DatabaseSetupGuide;
