export enum SyncStatus {
    NOT_SYNCED = 'not_synced',
    SYNCED = 'synced',
    SYNC_FAILED = 'sync_failed'
}

export const SyncStatusValues: Record<SyncStatus, number> = {
    [SyncStatus.NOT_SYNCED]: 1,
    [SyncStatus.SYNCED]: 2,
    [SyncStatus.SYNC_FAILED]: 3,
};
