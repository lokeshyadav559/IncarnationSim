export interface DatabaseIncarnation {
  id: string;
  timestamp: string;
  status: 'ACTIVE' | 'INACTIVE';
  parentId: string | null;
  metadata: {
    description?: string;
    changes?: string[];
    controlFile?: {
      exists: boolean;
      timestamp?: string;
      resetlogs?: boolean;
    };
    archiveLogs?: {
      sequence: number;
      firstChange: number;
      nextChange: number;
      status: 'APPLIED' | 'UNAVAILABLE' | 'DELETED';
    }[];
    datafiles?: {
      name: string;
      status: 'ONLINE' | 'OFFLINE' | 'RECOVER';
      checkpointChange: number;
    }[];
    redoLogs?: {
      group: number;
      status: 'CURRENT' | 'ACTIVE' | 'INACTIVE';
      sequence: number;
    }[];
  };
} 