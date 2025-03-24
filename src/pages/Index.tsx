
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogEntry } from '@/lib/types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, MapPin, Tag, Wrench, Users, Package, BarChart as BarChartIcon, Check, Clock2, AlertCircle, X, Clipboard, RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

import LogHeader from '@/components/LogHeader';
import LogCard from '@/components/LogCard';
import LogMap from '@/components/LogMap';
import LogTable from '@/components/LogTable';
import LogTimeline from '@/components/LogTimeline';
import LogSearch from '@/components/LogSearch';
import TransitionLayout from '@/components/TransitionLayout';
import TranscriptionInput from '@/components/TranscriptionInput';
import TranscriptionHistory from '@/components/TranscriptionHistory';
import NetworkVisualization from '@/components/NetworkVisualization';
import DatabaseSetupGuide from '@/components/DatabaseSetupGuide';
import { fetchLogs } from '@/services/logService';
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'map' | 'list' | 'timeline' | 'network'>('dashboard');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [databaseReady, setDatabaseReady] = useState<boolean | null>(null);
  const { toast } = useToast();
  
  // Check if database table exists
  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const { error } = await supabase
          .from('activity_logs')
          .select('id')
          .limit(1);
        
        // If there's no error, the table exists
        setDatabaseReady(!error);
        
        if (!error) {
          loadLogs();
        }
      } catch (err) {
        console.error("Error checking database:", err);
        setDatabaseReady(false);
      }
    };
    
    checkDatabase();
  }, []);
  
  // Fetch logs on component mount
  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const logsData = await fetchLogs();
      setLogs(logsData);
      
      if (logsData.length > 0) {
        toast({
          title: "Data Loaded",
          description: `Loaded ${logsData.length} logs from the database.`,
        });
      }
    } catch (error) {
      console.error("Error loading logs:", error);
      toast({
        title: "Error",
        description: "Failed to load logs from database. Check your Supabase configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (selectedLocation) {
      setFilteredLogs(logs.filter(log => log.location === selectedLocation));
    } else {
      setFilteredLogs(logs);
    }
  }, [selectedLocation, logs]);
  
  const getStatusCounts = () => {
    const counts: Record<string, number> = {
      completed: 0,
      'in-progress': 0,
      planned: 0,
      delayed: 0,
      cancelled: 0
    };

    logs.forEach(log => {
      if (log.status && counts[log.status] !== undefined) {
        counts[log.status]++;
      }
    });

    return counts;
  };

  const getCategoryCounts = () => {
    const counts: Record<string, number> = {};

    logs.forEach(log => {
      if (log.activityCategory) {
        if (!counts[log.activityCategory]) {
          counts[log.activityCategory] = 0;
        }
        counts[log.activityCategory]++;
      }
    });

    return counts;
  };
  
  const statusCounts = getStatusCounts();
  const categoryCounts = getCategoryCounts();
  
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  
  const COLORS = ['#4f46e5', '#3b82f6', '#a78bfa', '#f59e0b', '#ef4444'];
  
  const STATUS_COLORS: Record<string, string> = {
    completed: '#10b981',
    'in-progress': '#3b82f6',
    planned: '#8b5cf6',
    delayed: '#f59e0b',
    cancelled: '#ef4444'
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-5 h-5 text-white" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-white" />;
      case 'planned':
        return <Clock2 className="w-5 h-5 text-white" />;
      case 'delayed':
        return <AlertCircle className="w-5 h-5 text-white" />;
      case 'cancelled':
        return <X className="w-5 h-5 text-white" />;
      default:
        return null;
    }
  };
  
  const handleLogsGenerated = (newLogs: LogEntry[]) => {
    if (!newLogs || newLogs.length === 0) {
      toast({
        title: "No logs generated",
        description: "No valid log entries could be extracted from the transcription.",
        variant: "destructive",
      });
      return;
    }
    
    // Update database status if logs were successfully generated and saved
    setDatabaseReady(true);
    
    // Add new logs to the state
    setLogs(prevLogs => {
      const existingIds = new Set(prevLogs.map(log => log.id));
      const uniqueNewLogs = newLogs.filter(log => !existingIds.has(log.id));
      return [...uniqueNewLogs, ...prevLogs]; // New logs at the top
    });

    toast({
      title: "Success",
      description: `Added ${newLogs.length} log entries from transcription`,
    });
  };
  
  const handleLogClick = (log: LogEntry) => {
    setSelectedLog(log);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <LogHeader 
        activeView={activeView} 
        setActiveView={setActiveView}
        setSearchOpen={setSearchOpen}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Activity Log Knowledge Base</h1>
          <Button 
            onClick={loadLogs} 
            disabled={isLoading || databaseReady === false}
            variant="outline"
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh Data
          </Button>
        </div>
        
        {databaseReady === false && <DatabaseSetupGuide />}
        
        <TranscriptionInput onLogsGenerated={handleLogsGenerated} />
        
        <TranscriptionHistory />
        
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <TransitionLayout animation="slide-up" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(statusCounts).map(([status, count], index) => (
                  <div 
                    key={status}
                    className="glass rounded-xl p-4 flex items-center"
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                      style={{ backgroundColor: STATUS_COLORS[status] }}
                    >
                      {getStatusIcon(status)}
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {status.replace('-', ' ')}
                      </div>
                      <div className="text-2xl font-medium">
                        {count}
                      </div>
                    </div>
                  </div>
                ))}
              </TransitionLayout>
              
              {logs.length > 0 ? (
                <>
                  <TransitionLayout animation="slide-up" delay={100} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass rounded-xl p-6">
                      <h2 className="text-lg font-medium mb-4">Status Distribution</h2>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={statusData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="glass rounded-xl p-6">
                      <h2 className="text-lg font-medium mb-4">Activity Categories</h2>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={categoryData}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </TransitionLayout>
                  
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-medium">Recent Activity Logs</h2>
                      <button 
                        onClick={() => setActiveView('list')}
                        className="text-sm text-primary hover:underline"
                      >
                        View all
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredLogs.slice(0, 6).map((log, index) => (
                        <LogCard 
                          key={log.id} 
                          log={log} 
                          index={index} 
                          onClick={() => handleLogClick(log)}
                        />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="glass rounded-xl p-8 text-center">
                  <h2 className="text-xl font-medium mb-4">No Log Data Available</h2>
                  <p className="text-muted-foreground mb-4">
                    Enter a transcription above to generate activity logs and visualize them.
                  </p>
                  {databaseReady === false ? (
                    <p className="text-sm text-muted-foreground">
                      Set up the database using the guide above to start tracking logs over time.
                    </p>
                  ) : null}
                </div>
              )}
            </motion.div>
          )}
          
          {activeView === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LogMap 
                selectedLocation={selectedLocation} 
                setSelectedLocation={setSelectedLocation} 
                logs={logs}
              />
              
              {selectedLocation && filteredLogs.length > 0 && (
                <TransitionLayout animation="slide-up" className="mt-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-primary" />
                      {selectedLocation} Logs
                    </h2>
                    <button 
                      onClick={() => setSelectedLocation(null)}
                      className="text-sm text-primary hover:underline"
                    >
                      Clear selection
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLogs.map((log, index) => (
                      <LogCard 
                        key={log.id} 
                        log={log} 
                        index={index}
                        onClick={() => handleLogClick(log)}
                      />
                    ))}
                  </div>
                </TransitionLayout>
              )}
            </motion.div>
          )}
          
          {activeView === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium flex items-center">
                  <Clipboard className="w-5 h-5 mr-2 text-primary" />
                  All Activity Logs
                  {selectedLocation && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      Filtered by: {selectedLocation}
                    </span>
                  )}
                </h2>
                {selectedLocation && (
                  <button 
                    onClick={() => setSelectedLocation(null)}
                    className="text-sm text-primary hover:underline"
                  >
                    Clear filter
                  </button>
                )}
              </div>
              
              {logs.length > 0 ? (
                <LogTable logs={filteredLogs} onSelectLog={setSelectedLog} />
              ) : (
                <div className="glass rounded-xl p-8 text-center">
                  <h2 className="text-xl font-medium mb-4">No Log Data Available</h2>
                  <p className="text-muted-foreground">
                    Enter a transcription above to generate activity logs.
                  </p>
                </div>
              )}
            </motion.div>
          )}
          
          {activeView === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  Activity Timeline
                  {selectedLocation && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      Filtered by: {selectedLocation}
                    </span>
                  )}
                </h2>
                {selectedLocation && (
                  <button 
                    onClick={() => setSelectedLocation(null)}
                    className="text-sm text-primary hover:underline"
                  >
                    Clear filter
                  </button>
                )}
              </div>
              
              {logs.length > 0 ? (
                <LogTimeline logs={filteredLogs} onSelectLog={setSelectedLog} />
              ) : (
                <div className="glass rounded-xl p-8 text-center">
                  <h2 className="text-xl font-medium mb-4">No Timeline Data Available</h2>
                  <p className="text-muted-foreground">
                    Enter a transcription above to generate activity logs for the timeline.
                  </p>
                </div>
              )}
            </motion.div>
          )}
          
          {activeView === 'network' && (
            <motion.div
              key="network"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium flex items-center">
                  <svg className="w-5 h-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  Network Analysis
                  {selectedLocation && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      Filtered by: {selectedLocation}
                    </span>
                  )}
                </h2>
                {selectedLocation && (
                  <button 
                    onClick={() => setSelectedLocation(null)}
                    className="text-sm text-primary hover:underline"
                  >
                    Clear filter
                  </button>
                )}
              </div>
              
              {logs.length > 0 ? (
                <NetworkVisualization logs={filteredLogs} />
              ) : (
                <div className="glass rounded-xl p-8 text-center">
                  <h2 className="text-xl font-medium mb-4">No Network Data Available</h2>
                  <p className="text-muted-foreground">
                    Enter a transcription above to generate activity logs for network visualization.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedLog && (
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                {selectedLog.media && (
                  <TabsTrigger value="media">Media</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="details" className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-medium">{selectedLog.activityType}</h2>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(selectedLog.timestamp).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{new Date(selectedLog.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 text-sm rounded-full font-medium
                    ${selectedLog.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                    ${selectedLog.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : ''}
                    ${selectedLog.status === 'planned' ? 'bg-purple-100 text-purple-800' : ''}
                    ${selectedLog.status === 'delayed' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${selectedLog.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {selectedLog.status}
                  </div>
                </div>
                
                <div className="glass-darker p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <MapPin className="w-5 h-5 mr-2 text-primary" />
                    <h3 className="text-lg font-medium">{selectedLog.location}</h3>
                  </div>
                  <div className="flex items-center">
                    <Tag className="w-5 h-5 mr-2 text-primary" />
                    <span>{selectedLog.activityCategory}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Equipment</h4>
                      <div className="flex items-center">
                        <Wrench className="w-5 h-5 mr-2 text-primary/70" />
                        <span>{selectedLog.equipment}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Personnel</h4>
                      <div className="flex items-center">
                        <Users className="w-5 h-5 mr-2 text-primary/70" />
                        <span>{selectedLog.personnel}</span>
                      </div>
                    </div>
                    
                    {selectedLog.measurement && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Measurement</h4>
                        <div className="flex items-center">
                          <BarChartIcon className="w-5 h-5 mr-2 text-primary/70" />
                          <span>{selectedLog.measurement}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Material/Resource</h4>
                      <div className="flex items-center">
                        <Package className="w-5 h-5 mr-2 text-primary/70" />
                        <span>{selectedLog.material}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Reference ID</h4>
                      <div className="text-sm bg-secondary px-2 py-1 rounded inline-block">
                        {selectedLog.referenceId}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Log ID</h4>
                      <div className="text-sm bg-secondary px-2 py-1 rounded inline-block">
                        {selectedLog.id}
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedLog.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Notes</h4>
                    <div className="glass-darker p-4 rounded-lg">
                      <p>{selectedLog.notes}</p>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              {selectedLog.media && (
                <TabsContent value="media">
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={selectedLog.media} 
                      alt={`Media for ${selectedLog.activityType}`} 
                      className="w-full h-auto"
                    />
                  </div>
                  
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    Media for {selectedLog.activityType} at {selectedLog.location}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
      
      <LogSearch 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
        logs={logs}
        onSelectLog={setSelectedLog}
      />
    </div>
  );
};

export default Index;
