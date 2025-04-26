export type RecoveryType = 'COMPLETE' | 'INCOMPLETE' | 'PITR' | 'FLASHBACK';

export interface RecoveryMetadata {
  type: RecoveryType;
  targetTime?: string;
  targetSCN?: number;
  recoveryToConsistency?: boolean;
  datafilesRecovered?: string[];
  archiveLogsUsed?: number[];
  flashbackSCN?: number;
  flashbackTime?: string;
  resetlogs?: boolean;
  description: string;
}

export interface DatabaseIncarnation {
  id: string;
  timestamp: string;
  status: 'ACTIVE' | 'INACTIVE' | 'RECOVERING';
  parentId: string | null;
  metadata: {
    description?: string;
    changes?: string[];
    controlFile?: {
      exists: boolean;
      timestamp?: string;
      resetlogs?: boolean;
      checkpointSCN?: number;
    };
    archiveLogs?: {
      sequence: number;
      firstChange: number;
      nextChange: number;
      status: 'APPLIED' | 'UNAVAILABLE' | 'DELETED';
      appliedTime?: string;
    }[];
    datafiles?: {
      name: string;
      status: 'ONLINE' | 'OFFLINE' | 'RECOVER' | 'RESTORING';
      checkpointChange: number;
      lastBackupTime?: string;
      lastBackupSCN?: number;
    }[];
    redoLogs?: {
      group: number;
      status: 'CURRENT' | 'ACTIVE' | 'INACTIVE' | 'CLEARING';
      sequence: number;
      firstChange: number;
      nextChange: number;
    }[];
    recovery?: RecoveryMetadata;
    systemChangeNumber?: number;
    checkpointChange?: number;
    databaseRole?: 'PRIMARY' | 'STANDBY';
    openMode?: 'READ WRITE' | 'READ ONLY' | 'MOUNTED';
  };
}

export interface RecoveryOptions {
  type: RecoveryType;
  targetTime?: string;
  targetSCN?: number;
  untilCancel?: boolean;
  usingBackupControlfile?: boolean;
  resetlogs?: boolean;
  datafiles?: string[];
  tablespaces?: string[];
}

export interface RecoveryResult {
  success: boolean;
  message: string;
  newIncarnation?: DatabaseIncarnation;
  errors?: string[];
  warnings?: string[];
  recoveryTime?: string;
  datafilesRecovered?: string[];
  archiveLogsApplied?: number[];
} 