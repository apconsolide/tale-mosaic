import React, { useState, useEffect, useRef, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { LocateFixed, ChevronsUp, ChevronsDown, Layers, Plus, Minus } from 'lucide-react';
import { LogEntry, LocationGroup } from '@/lib/types';
import { toast } from 'sonner';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your Mapbox token - ideally this would be in an environment variable
mapboxgl.accessToken = 'pk.eyJ1IjoiamVmZnJleXRoZWRldmVsb3BlciIsImEiOiJjbGc2ODVsMGswaXkwM2VwaWhyMGZnODhhIn0.YHO7Kj5y-IHgMQ4CnptiFw';

// Define types for props
interface LogMapProps {
  logs: LogEntry[];
  onSelectLog?: (log: LogEntry) => void;
  selectedLogId?: string;
}

// Default position if no logs available
const DEFAULT_POSITION: [number, number] = [-97.1722, 25.9969]; // SpaceX Starbase area - explicitly typed as tuple
const DEFAULT_ZOOM = 13;

const LogMap = ({ logs, onSelectLog, selectedLogId }: LogMapProps) => {
  // State variables
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [error, setError] = useState<string | null>(null);
  const [expandLegend, setExpandLegend] = useState(false);
  const [activeLocationGroups, setActiveLocationGroups] = useState<LocationGroup[]>([]);
  const [basemapStyle, setBasemapStyle] = useState<'satellite' | 'streets' | 'terrain'>('satellite');
  
  // Refs
  const mapContainer = useRef<HTMLDivElement>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  // Process logs and group by location
  const locationGroups: LocationGroup[] = useMemo(() => {
    const groups: Record<string, LocationGroup> = {};
    
    logs.forEach(log => {
      const location = log.location;
      
      if (!groups[location]) {
        groups[location] = {
          location,
          logs: [],
          coordinates: log.coordinates
        };
      }
      
      groups[location].logs.push(log);
      
      // Use the latest coordinates for the location (in case they differ)
      if (log.coordinates) {
        groups[location].coordinates = log.coordinates;
      }
    });
    
    return Object.values(groups);
  }, [logs]);
  
  // Effect to initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    try {
      // Create the map
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: DEFAULT_POSITION,
        zoom: DEFAULT_ZOOM,
        attributionControl: false,
      });
      
      // Add navigation control
      mapInstance.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      
      // Add attribution control separately with custom position
      mapInstance.addControl(new mapboxgl.AttributionControl(), 'bottom-left');
      
      // Update state with map instance
      mapInstance.on('load', () => {
        setMap(mapInstance);
        
        // Update zoom state when map is zoomed
        mapInstance.on('zoom', () => {
          setZoom(mapInstance.getZoom());
        });
      });
      
      // Clean up
      return () => {
        mapInstance.remove();
        setMap(null);
      };
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map. Please check your internet connection.');
    }
  }, []);
  
  // Update markers when logs or map changes
  useEffect(() => {
    if (!map) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Group logs by location
    setActiveLocationGroups(locationGroups);
    
    // Create clusters for grouped logs
    const bounds = new mapboxgl.LngLatBounds();
    let hasValidCoordinates = false;
    
    locationGroups.forEach(group => {
      if (!group.coordinates) return;
      
      hasValidCoordinates = true;
      bounds.extend(group.coordinates as [number, number]);
      
      // Create the marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'marker-cluster';
      
      // Add count to marker
      const count = group.logs.length;
      markerEl.innerHTML = `
        <div class="marker-count ${selectedLogId && group.logs.some(log => log.id === selectedLogId) ? 'selected' : ''}">
          ${count}
        </div>
      `;
      
      // Style based on count
      let size = 30;
      if (count > 5) size = 40;
      if (count > 10) size = 50;
      
      markerEl.style.width = `${size}px`;
      markerEl.style.height = `${size}px`;
      
      // Create marker and add to map
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat(group.coordinates as [number, number])
        .addTo(map);
      
      // Add click event
      markerEl.addEventListener('click', () => {
        // If multiple logs at location, show popup with list
        if (count > 1) {
          const coordinates = group.coordinates as [number, number];
          
          // Create popup content
          const popupContent = document.createElement('div');
          popupContent.className = 'location-popup';
          
          const locationTitle = document.createElement('h3');
          locationTitle.textContent = group.location;
          locationTitle.className = 'font-medium mb-2';
          popupContent.appendChild(locationTitle);
          
          const logList = document.createElement('div');
          logList.className = 'log-list';
          
          group.logs.forEach(log => {
            const logItem = document.createElement('div');
            logItem.className = `log-item cursor-pointer p-1 hover:bg-gray-100 rounded ${log.id === selectedLogId ? 'bg-blue-50 border-l-2 border-blue-500 pl-2' : ''}`;
            
            logItem.innerHTML = `
              <div class="text-xs font-medium">${log.activityType}</div>
              <div class="text-xs text-gray-500">${log.activityCategory} • ${new Date(log.timestamp).toLocaleDateString()}</div>
            `;
            
            logItem.addEventListener('click', () => {
              if (onSelectLog) onSelectLog(log);
              // Close any open popups
              document.querySelectorAll('.mapboxgl-popup').forEach(el => el.remove());
            });
            
            logList.appendChild(logItem);
          });
          
          popupContent.appendChild(logList);
          
          // Create and show popup
          new mapboxgl.Popup({ closeButton: true, maxWidth: '300px' })
            .setLngLat(coordinates)
            .setDOMContent(popupContent)
            .addTo(map);
        } else if (count === 1 && onSelectLog) {
          // If only one log, select it directly
          onSelectLog(group.logs[0]);
        }
      });
      
      // Highlight marker if it contains the selected log
      if (selectedLogId && group.logs.some(log => log.id === selectedLogId)) {
        markerEl.classList.add('selected-marker');
        
        // If a single log is selected and it's in this group, center the map on it
        if (group.logs.length === 1 && group.logs[0].id === selectedLogId) {
          map.flyTo({
            center: group.coordinates as [number, number],
            zoom: Math.max(zoom, 14),
            essential: true
          });
        }
      }
      
      // Store marker reference for cleanup
      markersRef.current.push(marker);
    });
    
    // If we have coordinates, fit bounds
    if (hasValidCoordinates && locationGroups.length > 0) {
      // Don't fit bounds if a single log is selected (we're already centering on it)
      if (!(selectedLogId && locationGroups.some(g => g.logs.length === 1 && g.logs[0].id === selectedLogId))) {
        map.fitBounds(bounds, {
          padding: 50,
          maxZoom: 16
        });
      }
    }
    
    // Create GeoJSON for heat visualization
    if (locationGroups.length > 0 && hasValidCoordinates) {
      try {
        // Remove existing sources/layers
        if (map.getSource('activity-points')) {
          map.removeLayer('activity-heat');
          map.removeSource('activity-points');
        }
        
        // Create point data for heat map
        const points: Array<{
          type: "Feature";
          properties: { count: number };
          geometry: {
            type: "Point";
            coordinates: [number, number];
          };
        }> = [];
        
        locationGroups.forEach(group => {
          if (group.coordinates) {
            points.push({
              type: "Feature",
              properties: {
                count: group.logs.length,
              },
              geometry: {
                type: "Point",
                coordinates: group.coordinates,
              },
            });
          }
        });
        
        // Add the source and layer
        map.addSource('activity-points', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: points,
          },
        });
        
        map.addLayer({
          id: 'activity-heat',
          type: 'heatmap',
          source: 'activity-points',
          paint: {
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'count'],
              1, 0.5,
              10, 1
            ],
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              9, 1,
              15, 3
            ],
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(0, 0, 255, 0)',
              0.2, 'rgba(0, 0, 255, 0.2)',
              0.4, 'rgba(0, 255, 255, 0.4)',
              0.6, 'rgba(0, 255, 0, 0.6)',
              0.8, 'rgba(255, 255, 0, 0.8)',
              1, 'rgba(255, 0, 0, 1)'
            ],
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              10, 15,
              15, 25
            ],
            'heatmap-opacity': 0.7
          }
        });
      } catch (e) {
        console.error('Error setting up heat map:', e);
      }
    }
  }, [map, logs, selectedLogId, locationGroups, onSelectLog, zoom]);
  
  // Update map style when basemap changes
  useEffect(() => {
    if (!map) return;
    
    let style = 'mapbox://styles/mapbox/satellite-streets-v12';
    
    if (basemapStyle === 'streets') {
      style = 'mapbox://styles/mapbox/streets-v12';
    } else if (basemapStyle === 'terrain') {
      style = 'mapbox://styles/mapbox/outdoors-v12';
    }
    
    map.setStyle(style);
  }, [map, basemapStyle]);
  
  // Navigate to user's location
  const handleLocateMe = () => {
    if (!map) return;
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          map.flyTo({
            center: [longitude, latitude],
            zoom: 14,
            essential: true
          });
        },
        error => {
          console.error('Error getting location:', error);
          toast.error('Could not get your location. Please check your device settings.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser.');
    }
  };
  
  // Function to cycle through basemap styles
  const cycleBasemapStyle = () => {
    if (basemapStyle === 'satellite') {
      setBasemapStyle('streets');
    } else if (basemapStyle === 'streets') {
      setBasemapStyle('terrain');
    } else {
      setBasemapStyle('satellite');
    }
  };
  
  // Render the component
  return (
    <div className="relative h-full w-full">
      {error ? (
        <div className="flex items-center justify-center h-full w-full bg-gray-100 dark:bg-gray-800">
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-red-500 dark:text-red-400">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <div ref={mapContainer} className="h-full w-full rounded-lg" />
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <Tooltip content="Find my location">
              <Button 
                variant="outline"
                size="sm"
                className="bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 w-8 h-8 p-0"
                onClick={handleLocateMe}
              >
                <LocateFixed className="h-4 w-4" />
              </Button>
            </Tooltip>
            
            <Tooltip content={`Change basemap (Current: ${basemapStyle})`}>
              <Button 
                variant="outline"
                size="sm"
                className="bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 w-8 h-8 p-0"
                onClick={cycleBasemapStyle}
              >
                <Layers className="h-4 w-4" />
              </Button>
            </Tooltip>
            
            <Tooltip content="Zoom in">
              <Button
                variant="outline"
                size="sm"
                className="bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 w-8 h-8 p-0"
                onClick={() => map?.zoomIn()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </Tooltip>
            
            <Tooltip content="Zoom out">
              <Button
                variant="outline"
                size="sm"
                className="bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 w-8 h-8 p-0"
                onClick={() => map?.zoomOut()}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-16 left-4 bg-white dark:bg-gray-800 shadow-md rounded-md overflow-hidden">
            <div className="p-3 cursor-pointer flex justify-between items-center" onClick={() => setExpandLegend(!expandLegend)}>
              <h3 className="text-sm font-medium">Activity Legend</h3>
              {expandLegend ? <ChevronsDown className="h-4 w-4" /> : <ChevronsUp className="h-4 w-4" />}
            </div>
            
            {expandLegend && (
              <div className="p-3 pt-0 space-y-2 text-xs">
                <div className="border-t dark:border-gray-700 pt-2">
                  {activeLocationGroups.length === 0 ? (
                    <p className="text-gray-500 py-1">No activities to display</p>
                  ) : (
                    activeLocationGroups.map((group, index) => (
                      <div key={index} className="flex items-center py-1">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: '#3b82f6' }} 
                        />
                        <span className="truncate max-w-[200px]">{group.location}</span>
                        <Badge variant="secondary" className="ml-2">
                          {group.logs.length}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* CSS for markers */}
          <style>{`
            .marker-cluster {
              background-image: url('data:image/svg+xml;charset=UTF-8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="%233b82f6" stroke="white" stroke-width="3"/></svg>');
              background-size: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            }
            
            .selected-marker {
              background-image: url('data:image/svg+xml;charset=UTF-8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="%23ef4444" stroke="white" stroke-width="3"/></svg>');
            }
            
            .marker-count {
              color: white;
              font-weight: bold;
              font-size: 0.75rem;
            }
            
            .marker-count.selected {
              color: #ef4444;
            }
            
            .location-popup {
              max-height: 200px;
              overflow-y: auto;
            }
            
            .log-list {
              max-height: 150px;
              overflow-y: auto;
            }
          `}</style>
        </>
      )}
    </div>
  );
};

export default LogMap;
