
import { supabase } from "@/integrations/supabase/client";
import { LogEntry, Transcription } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';

// Fetch all logs from the database
export const fetchLogs = async (): Promise<LogEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Transform database column names to LogEntry format and validate status type
    return data.map(item => ({
      id: item.id,
      timestamp: item.timestamp,
      location: item.location,
      activityCategory: item.activity_category,
      activityType: item.activity_type,
      equipment: item.equipment,
      personnel: item.personnel,
      material: item.material,
      measurement: item.measurement,
      status: validateStatus(item.status),
      notes: item.notes,
      media: item.media,
      referenceId: item.reference_id,
      coordinates: validateCoordinates(item.coordinates),
      transcription_id: item.transcription_id
    }));
  } catch (error) {
    console.error("Error fetching logs:", error);
    return [];
  }
};

// Helper function to validate status
const validateStatus = (status: string): LogEntry['status'] => {
  const validStatuses: LogEntry['status'][] = ["completed", "in-progress", "planned", "delayed", "cancelled"];
  return validStatuses.includes(status as LogEntry['status']) 
    ? (status as LogEntry['status']) 
    : "completed";
};

// Helper function to validate coordinates
const validateCoordinates = (coordinates: any): [number, number] | undefined => {
  if (Array.isArray(coordinates) && coordinates.length >= 2 && 
      typeof coordinates[0] === 'number' && typeof coordinates[1] === 'number') {
    return [coordinates[0], coordinates[1]];
  }
  return undefined; // Return undefined if coordinates are invalid
};

// Save multiple logs to the database
export const saveLogs = async (logs: LogEntry[], transcription_id?: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert(logs.map(log => ({
        id: log.id || uuidv4(),
        timestamp: log.timestamp || new Date().toISOString(),
        location: log.location,
        activity_category: log.activityCategory,
        activity_type: log.activityType,
        equipment: log.equipment,
        personnel: log.personnel,
        material: log.material,
        measurement: log.measurement,
        status: log.status || "completed",
        notes: log.notes,
        media: log.media,
        reference_id: log.referenceId,
        coordinates: log.coordinates,
        transcription_id: transcription_id
      })));
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error saving logs:", error);
    throw error;
  }
};

// Delete a log from the database
export const deleteLog = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error deleting log:", error);
    throw error;
  }
};

// Update a log in the database
export const updateLog = async (log: LogEntry): Promise<void> => {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .update({
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
        coordinates: log.coordinates,
        transcription_id: log.transcription_id
      })
      .eq('id', log.id);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error updating log:", error);
    throw error;
  }
};

// Fetch statistics about logs
export const fetchLogStats = async () => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('status, activity_category, location')
      .order('timestamp', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Calculate statistics
    const statusCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};
    const locationCounts: Record<string, number> = {};
    
    data.forEach(log => {
      // Count by status
      if (log.status) {
        statusCounts[log.status] = (statusCounts[log.status] || 0) + 1;
      }
      
      // Count by category
      if (log.activity_category) {
        categoryCounts[log.activity_category] = (categoryCounts[log.activity_category] || 0) + 1;
      }
      
      // Count by location
      if (log.location) {
        locationCounts[log.location] = (locationCounts[log.location] || 0) + 1;
      }
    });
    
    return {
      statusCounts,
      categoryCounts,
      locationCounts,
      totalLogs: data.length
    };
  } catch (error) {
    console.error("Error fetching log stats:", error);
    return {
      statusCounts: {},
      categoryCounts: {},
      locationCounts: {},
      totalLogs: 0
    };
  }
};

// Transcription related functions
export const saveTranscription = async (text: string, title: string, logsCount: number): Promise<string> => {
  try {
    const id = uuidv4();
    const { error } = await supabase
      .from('transcriptions')
      .insert({
        id,
        text,
        title,
        logs_generated: logsCount
      });
    
    if (error) {
      throw error;
    }
    
    return id;
  } catch (error) {
    console.error("Error saving transcription:", error);
    throw error;
  }
};

export const fetchTranscriptions = async (): Promise<Transcription[]> => {
  try {
    const { data, error } = await supabase
      .from('transcription_stats')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Transform the data to match the Transcription interface
    return data.map(item => ({
      id: item.id,
      text: '', // Provide a default empty string since text is not in the view
      title: item.title || '',
      created_at: item.created_at,
      logs_generated: item.log_count || 0, // Map log_count to logs_generated
      user_id: undefined // This field might not be present in the view
    }));
  } catch (error) {
    console.error("Error fetching transcriptions:", error);
    return [];
  }
};

export const getTranscriptionById = async (id: string): Promise<Transcription | null> => {
  try {
    const { data, error } = await supabase
      .from('transcriptions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching transcription:", error);
    return null;
  }
};

export const deleteTranscription = async (id: string): Promise<void> => {
  try {
    // First delete all associated logs
    await supabase
      .from('activity_logs')
      .delete()
      .eq('transcription_id', id);
      
    // Then delete the transcription
    const { error } = await supabase
      .from('transcriptions')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error deleting transcription:", error);
    throw error;
  }
};
