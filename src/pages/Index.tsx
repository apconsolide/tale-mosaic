
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout, BarChart3, ListFilter, FileAudio, Info, Map, List } from 'lucide-react';
import LogTable from '@/components/LogTable';
import LogMap from '@/components/LogMap';
import NetworkVisualization from '@/components/NetworkVisualization';
import LogTimeline from '@/components/LogTimeline';
import LogHeader from '@/components/LogHeader';
import { fetchLogs, fetchLogStats } from '@/services/logService';
import { LogEntry } from '@/lib/types';
import { toast } from 'sonner';
import LogSearch from '@/components/LogSearch';
import LogCard from '@/components/LogCard';
import TranscriptionInput from '@/components/TranscriptionInput';
import TranscriptionHistory from '@/components/TranscriptionHistory';
import DatabaseSetupGuide from '@/components/DatabaseSetupGuide';
import { Separator } from '@/components/ui/separator';
import GeminiApiKeySetup from '@/components/GeminiApiKeySetup';

const Index = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [activeTab, setActiveTab] = useState('map');
  const [activeSection, setActiveSection] = useState('data');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [databaseReady, setDatabaseReady] = useState<boolean | null>(null);

  // Load logs from the database
  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const logsData = await fetchLogs();
      setLogs(logsData);
      setFilteredLogs(logsData);
      
      // Load statistics
      const statsData = await fetchLogStats();
      setStats(statsData);
      
      // If we have logs, the database must be ready
      if (logsData.length > 0) {
        setDatabaseReady(true);
      }
    } catch (error) {
      console.error('Error loading logs:', error);
      toast.error('Failed to load logs');
    } finally {
      setIsLoading(false);
    }
  };

  // Load logs on component mount
  useEffect(() => {
    loadLogs();
  }, []);

  // Handle log search and filtering
  const handleSearch = (searchResults: LogEntry[]) => {
    setFilteredLogs(searchResults);
  };

  // Handle log selection
  const handleLogSelect = (log: LogEntry) => {
    setSelectedLog(log);
  };

  // Handle generated logs from transcription
  const handleLogsGenerated = (newLogs: LogEntry[]) => {
    // Update state with the new logs (without saving to database yet)
    setLogs((prevLogs) => [...newLogs, ...prevLogs]);
    setFilteredLogs((prevFiltered) => [...newLogs, ...prevFiltered]);
    
    // Update stats
    loadLogs();
    
    // Switch to map view to show the new logs
    setActiveTab('map');
  };

  // Handle transcription selection from history
  const handleSelectTranscription = (text: string) => {
    // Switch to transcription input tab
    setActiveSection('input');
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <LogHeader stats={stats} isLoading={isLoading} onRefresh={loadLogs} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue={activeSection} value={activeSection} onValueChange={setActiveSection}>
            <TabsList className="grid grid-cols-2 mb-4 w-full">
              <TabsTrigger value="data">
                <Map className="h-4 w-4 mr-2" />
                Activity Data
              </TabsTrigger>
              <TabsTrigger value="input">
                <FileAudio className="h-4 w-4 mr-2" />
                Transcription Input
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="data" className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-4 mb-4">
                <LogSearch logs={logs} onSearchResults={handleSearch} />
                
                <div className="flex gap-2 mt-2 lg:mt-0">
                  <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-4">
                      <TabsTrigger value="map">
                        <Map className="h-4 w-4 mr-2" />
                        Map
                      </TabsTrigger>
                      <TabsTrigger value="table">
                        <List className="h-4 w-4 mr-2" />
                        Table
                      </TabsTrigger>
                      <TabsTrigger value="timeline">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Timeline
                      </TabsTrigger>
                      <TabsTrigger value="network">
                        <Layout className="h-4 w-4 mr-2" />
                        Network
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              
              <Card className="glass">
                <CardContent className="p-0">
                  <div className="h-[600px]">
                    <TabsContent value="map" className="h-full">
                      <LogMap 
                        logs={filteredLogs} 
                        onSelectLog={handleLogSelect} 
                        selectedLogId={selectedLog?.id} 
                      />
                    </TabsContent>
                    
                    <TabsContent value="table" className="h-full pt-2">
                      <LogTable 
                        logs={filteredLogs} 
                        onSelectLog={handleLogSelect} 
                        selectedLogId={selectedLog?.id}
                      />
                    </TabsContent>
                    
                    <TabsContent value="timeline" className="h-full">
                      <LogTimeline 
                        logs={filteredLogs} 
                        onSelectLog={handleLogSelect}
                      />
                    </TabsContent>
                    
                    <TabsContent value="network" className="h-full">
                      <NetworkVisualization
                        logs={filteredLogs}
                        onSelectLog={handleLogSelect}
                      />
                    </TabsContent>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="input" className="space-y-4">
              <TranscriptionInput onLogsGenerated={handleLogsGenerated} />
              
              {databaseReady === false && (
                <div className="mt-4">
                  <DatabaseSetupGuide />
                </div>
              )}
              
              <Separator className="my-6" />
              
              <div className="mt-4">
                <GeminiApiKeySetup />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-4">
          <TranscriptionHistory 
            onSelectTranscription={handleSelectTranscription} 
            onRefreshLogs={loadLogs}
          />
          
          {selectedLog ? (
            <LogCard log={selectedLog} />
          ) : (
            <Card className="glass">
              <CardHeader>
                <CardTitle>Activity Details</CardTitle>
                <CardDescription>
                  Select an activity to view details
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <Info className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  Click on a map marker or table row to view activity details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
