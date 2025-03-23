
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Steps, Step } from "@/components/ui/steps";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, ExternalLink, Database, CheckCircle, Clipboard } from 'lucide-react';
import sqlSetup from '../lib/setup/create_activity_logs_table.sql?raw';

const DatabaseSetupGuide = () => {
  const [open, setOpen] = useState(false);
  const [copiedSQL, setCopiedSQL] = useState(false);
  
  const copySQL = () => {
    navigator.clipboard.writeText(sqlSetup);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2000);
  };
  
  return (
    <>
      <Alert className="mb-4">
        <Database className="h-4 w-4" />
        <AlertTitle>Database setup required</AlertTitle>
        <AlertDescription>
          To track logs over time, you need to set up a database table.
          <Button 
            variant="link" 
            className="p-0 h-auto ml-2"
            onClick={() => setOpen(true)}
          >
            View setup instructions
          </Button>
        </AlertDescription>
      </Alert>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Database Setup Guide</DialogTitle>
            <DialogDescription>
              Follow these steps to set up your database for log tracking
            </DialogDescription>
          </DialogHeader>
          
          <Steps className="mt-6">
            <Step>
              <Step.Header className="font-medium">
                Access your Supabase project
              </Step.Header>
              <Step.Description>
                Go to your Supabase dashboard and select your project.
              </Step.Description>
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={() => window.open('https://app.supabase.com', '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Supabase Dashboard
                </Button>
              </div>
            </Step>
            
            <Step>
              <Step.Header className="font-medium">
                Open the SQL Editor
              </Step.Header>
              <Step.Description>
                Navigate to the "SQL Editor" section in your Supabase dashboard.
              </Step.Description>
            </Step>
            
            <Step>
              <Step.Header className="font-medium">
                Run the SQL setup script
              </Step.Header>
              <Step.Description>
                Copy the SQL below and paste it into the SQL Editor, then click "Run".
              </Step.Description>
              <div className="mt-4 relative">
                <Tabs defaultValue="sql" className="w-full">
                  <TabsList>
                    <TabsTrigger value="sql">SQL Script</TabsTrigger>
                    <TabsTrigger value="api">API Reference</TabsTrigger>
                  </TabsList>
                  <TabsContent value="sql">
                    <div className="relative mt-4">
                      <pre className="bg-secondary p-4 rounded-md overflow-x-auto text-sm">
                        <code>{sqlSetup}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={copySQL}
                      >
                        {copiedSQL ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="api">
                    <div className="mt-4 p-4 bg-secondary rounded-md">
                      <h3 className="text-sm font-medium mb-2">Activity Logs API Reference</h3>
                      <p className="text-sm mb-2">After running the SQL script, you can use these endpoints:</p>
                      <ul className="list-disc pl-5 text-sm space-y-2">
                        <li><code>GET /rest/v1/activity_logs</code> - Fetch all logs</li>
                        <li><code>POST /rest/v1/activity_logs</code> - Create new log entries</li>
                        <li><code>PATCH /rest/v1/activity_logs?id=eq.{id}</code> - Update a log entry</li>
                        <li><code>DELETE /rest/v1/activity_logs?id=eq.{id}</code> - Delete a log entry</li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Step>
            
            <Step>
              <Step.Header className="font-medium">
                Verify table creation
              </Step.Header>
              <Step.Description>
                Go to the "Table Editor" section and confirm that the "activity_logs" table is present.
              </Step.Description>
            </Step>
            
            <Step>
              <Step.Header className="font-medium">
                Refresh the application
              </Step.Header>
              <Step.Description>
                Return to the application and click "Refresh Data" to verify the connection.
              </Step.Description>
              <div className="mt-2">
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center"
                  onClick={() => setOpen(false)}
                >
                  <Clipboard className="mr-2 h-4 w-4" />
                  Return to Application
                </Button>
              </div>
            </Step>
          </Steps>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DatabaseSetupGuide;
