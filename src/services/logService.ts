
import { supabase } from "@/integrations/supabase/client";
import { LogEntry } from "@/lib/types";
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
      coordinates: validateCoordinates(item.coordinates)
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
const validateCoordinates = (coordinates: any): [number, number] => {
  if (Array.isArray(coordinates) && coordinates.length >= 2 && 
      typeof coordinates[0] === 'number' && typeof coordinates[1] === 'number') {
    return [coordinates[0], coordinates[1]];
  }
  return [0, 0]; // Default coordinates if invalid
};

// Save multiple logs to the database
export const saveLogs = async (logs: LogEntry[]): Promise<void> => {
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
        coordinates: log.coordinates || [0, 0]
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
        coordinates: log.coordinates
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
