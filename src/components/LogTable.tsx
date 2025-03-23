
import React from 'react';
import { motion } from 'framer-motion';
import { LogEntry } from '@/lib/types';
import TransitionLayout from './TransitionLayout';
import { Calendar, MapPin, Tag, Wrench, Clock, Check, AlertCircle, Clock2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LogTableProps {
  logs: LogEntry[];
  onSelectLog: (log: LogEntry) => void;
}

const LogTable: React.FC<LogTableProps> = ({ logs, onSelectLog }) => {
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof LogEntry;
    direction: 'ascending' | 'descending';
  }>({
    key: 'timestamp',
    direction: 'descending',
  });

  const sortedLogs = React.useMemo(() => {
    const sortableItems = [...logs];
    sortableItems.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sortableItems;
  }, [logs, sortConfig]);

  const requestSort = (key: keyof LogEntry) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'planned':
        return <Clock2 className="w-4 h-4 text-purple-500" />;
      case 'delayed':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'cancelled':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <TransitionLayout animation="fade" className="w-full overflow-x-auto">
      <div className="glass rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort('id')}
              >
                <div className="flex items-center">
                  <span className="mr-2">ID</span>
                  <span className={cn(
                    "transition-opacity",
                    sortConfig.key === 'id' ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                  )}>
                    {sortConfig.key === 'id' ? (
                      sortConfig.direction === 'ascending' ? '↑' : '↓'
                    ) : (
                      '↓'
                    )}
                  </span>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort('timestamp')}
              >
                <div className="flex items-center">
                  <span className="mr-2">Timestamp</span>
                  <span className={cn(
                    "transition-opacity",
                    sortConfig.key === 'timestamp' ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                  )}>
                    {sortConfig.key === 'timestamp' ? (
                      sortConfig.direction === 'ascending' ? '↑' : '↓'
                    ) : (
                      '↓'
                    )}
                  </span>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort('location')}
              >
                <div className="flex items-center">
                  <span className="mr-2">Location</span>
                  <span className={cn(
                    "transition-opacity",
                    sortConfig.key === 'location' ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                  )}>
                    {sortConfig.key === 'location' ? (
                      sortConfig.direction === 'ascending' ? '↑' : '↓'
                    ) : (
                      '↓'
                    )}
                  </span>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort('activityType')}
              >
                <div className="flex items-center">
                  <span className="mr-2">Activity</span>
                  <span className={cn(
                    "transition-opacity",
                    sortConfig.key === 'activityType' ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                  )}>
                    {sortConfig.key === 'activityType' ? (
                      sortConfig.direction === 'ascending' ? '↑' : '↓'
                    ) : (
                      '↓'
                    )}
                  </span>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort('equipment')}
              >
                <div className="flex items-center">
                  <span className="mr-2">Equipment</span>
                  <span className={cn(
                    "transition-opacity",
                    sortConfig.key === 'equipment' ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                  )}>
                    {sortConfig.key === 'equipment' ? (
                      sortConfig.direction === 'ascending' ? '↑' : '↓'
                    ) : (
                      '↓'
                    )}
                  </span>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort('status')}
              >
                <div className="flex items-center">
                  <span className="mr-2">Status</span>
                  <span className={cn(
                    "transition-opacity",
                    sortConfig.key === 'status' ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                  )}>
                    {sortConfig.key === 'status' ? (
                      sortConfig.direction === 'ascending' ? '↑' : '↓'
                    ) : (
                      '↓'
                    )}
                  </span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLogs.map((log, index) => (
              <TableRow
                key={log.id}
                className="hover:bg-secondary/30 cursor-pointer transition-colors"
                onClick={() => onSelectLog(log)}
              >
                <TableCell className="font-medium">{log.id}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-primary/70" />
                    <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-primary/70" />
                    <span>{log.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      {log.activityCategory}
                    </span>
                    <div className="font-medium text-sm">{log.activityType}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Wrench className="w-4 h-4 mr-2 text-primary/70" />
                    <span>{log.equipment}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    {
                      'bg-green-100 text-green-800': log.status === 'completed',
                      'bg-blue-100 text-blue-800': log.status === 'in-progress',
                      'bg-purple-100 text-purple-800': log.status === 'planned',
                      'bg-yellow-100 text-yellow-800': log.status === 'delayed',
                      'bg-red-100 text-red-800': log.status === 'cancelled',
                    }
                  )}>
                    <span className="mr-1">{getStatusIcon(log.status)}</span>
                    {log.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TransitionLayout>
  );
};

export default LogTable;
