import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { OLCharRecord } from './types/overload';

class OLDB extends Dexie {
  chars!: Table<OLCharRecord, string>;

  constructor() {
    super('olDB');
    this.version(2).stores({
      chars: '&nikkeId, displayName',
    });
  }
}

export const db = new OLDB();
