interface CompletedDay {
  date: string;
  tasks: Array<{ text: string; completed: boolean }>;
  image?: string;
  completionRate: number;
}

class IndexedDBService {
  private dbName = 'lock-in-db';
  private db: IDBDatabase | null = null;
  private initPromise: Promise<IDBDatabase> | null = null;

  private isSupported(): boolean {
    return 'indexedDB' in window && indexedDB !== null;
  }

  private async getCurrentVersion(): Promise<number> {
    return new Promise((resolve) => {
      const request = indexedDB.open(this.dbName);

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const version = db.version;
        db.close();
        resolve(version);
      };

      request.onerror = () => resolve(1); // Default to version 1 if DB doesn't exist
    });
  }

  private isPrivateBrowsing(): Promise<boolean> {
    return new Promise((resolve) => {
      // Simplified check - just try to open a test database
      const testDB = 'lock-in-test-' + Date.now();
      const request = indexedDB.open(testDB, 1);

      const timeout = setTimeout(() => {
        resolve(true); // Assume private browsing if it takes too long
      }, 2000);

      request.onerror = () => {
        clearTimeout(timeout);
        resolve(true);
      };

      request.onsuccess = () => {
        clearTimeout(timeout);
        const db = (request.result as IDBDatabase);
        db.close();
        indexedDB.deleteDatabase(testDB);
        resolve(false);
      };
    });
  }

  async initDB(): Promise<IDBDatabase> {
    // Return existing promise if already initializing
    if (this.initPromise) {
      return this.initPromise;
    }

    // Return existing connection if available
    if (this.db) {
      return this.db;
    }

    this.initPromise = this.performInit();
    return this.initPromise;
  }

  private async performInit(): Promise<IDBDatabase> {
    // Check if IndexedDB is supported
    if (!this.isSupported()) {
      throw new Error('IndexedDB is not supported in this browser');
    }

    // Get current version to avoid version conflicts
    const currentVersion = await this.getCurrentVersion();

    return new Promise((resolve, reject) => {
      // Open with current version, let onupgradeneeded handle structure
      const request = indexedDB.open(this.dbName, currentVersion);

      request.onerror = (event) => {
        const error = (event.target as IDBOpenDBRequest).error;
        console.error('IndexedDB error:', error);
        this.initPromise = null; // Reset promise on error
        reject(new Error(`Failed to open IndexedDB: ${error?.message || 'Unknown error'}`));
      };

      request.onblocked = () => {
        console.warn('IndexedDB open request was blocked');
        this.initPromise = null; // Reset promise on error
        reject(new Error('IndexedDB open request was blocked. Please close other tabs using this app.'));
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;

        // Check if we have the required object store
        if (!this.db.objectStoreNames.contains('completedDays')) {
          // Close and reopen with incremented version to create the store
          const nextVersion = this.db.version + 1;
          this.db.close();
          this.db = null;
          this.initPromise = null;

          const upgradeRequest = indexedDB.open(this.dbName, nextVersion);

          upgradeRequest.onupgradeneeded = (upgradeEvent) => {
            const upgradeDb = (upgradeEvent.target as IDBOpenDBRequest).result;
            if (!upgradeDb.objectStoreNames.contains('completedDays')) {
              upgradeDb.createObjectStore('completedDays', { keyPath: 'date' });
            }
          };

          upgradeRequest.onsuccess = (upgradeEvent) => {
            this.db = (upgradeEvent.target as IDBOpenDBRequest).result;
            this.setupErrorHandlers();
            resolve(this.db);
          };

          upgradeRequest.onerror = (upgradeEvent) => {
            const upgradeError = (upgradeEvent.target as IDBOpenDBRequest).error;
            this.initPromise = null;
            reject(new Error(`Failed to upgrade IndexedDB: ${upgradeError?.message || 'Unknown error'}`));
          };

          return;
        }

        this.setupErrorHandlers();
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        try {
          if (!db.objectStoreNames.contains('completedDays')) {
            db.createObjectStore('completedDays', { keyPath: 'date' });
          }
        } catch (error) {
          console.error('Error creating object store:', error);
          this.initPromise = null;
          reject(new Error(`Failed to create object store: ${error}`));
        }
      };
    });
  }

  private setupErrorHandlers() {
    if (this.db) {
      this.db.onerror = (event) => {
        console.error('Database error:', event);
      };

      this.db.onversionchange = () => {
        console.warn('Database version changed by another tab, closing connection');
        this.closeDB();
      };
    }
  }

  private saveToLocalStorage(dayData: CompletedDay): void {
    try {
      const existingData = localStorage.getItem('lock-in-completed-days');
      const completedDays: CompletedDay[] = existingData ? JSON.parse(existingData) : [];

      // Remove existing entry for this date if it exists
      const filteredDays = completedDays.filter(day => day.date !== dayData.date);

      // Add new entry
      filteredDays.push(dayData);

      localStorage.setItem('lock-in-completed-days', JSON.stringify(filteredDays));
      console.info('✅ Data saved successfully using backup storage');
    } catch (error) {
      throw new Error(`Failed to save to localStorage: ${error}`);
    }
  }

  private getFromLocalStorage(): CompletedDay[] {
    try {
      const data = localStorage.getItem('lock-in-completed-days');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return [];
    }
  }

  async saveCompletedDay(dayData: CompletedDay): Promise<void> {
    try {
      const db = await this.initDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['completedDays'], 'readwrite');
        const store = transaction.objectStore('completedDays');

        const request = store.put(dayData);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error('Failed to save day data'));

        transaction.onerror = () => reject(new Error('Transaction failed'));
      });
    } catch (error) {
      console.warn('IndexedDB failed, falling back to localStorage:', error);

      // Fallback to localStorage
      try {
        this.saveToLocalStorage(dayData);
      } catch (fallbackError) {
        throw new Error(`Both IndexedDB and localStorage failed: ${fallbackError}`);
      }
    }
  }

  async getCompletedDays(): Promise<CompletedDay[]> {
    try {
      const db = await this.initDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['completedDays'], 'readonly');
        const store = transaction.objectStore('completedDays');

        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(new Error('Failed to load completed days'));

        transaction.onerror = () => reject(new Error('Transaction failed'));
      });
    } catch (error) {
      console.warn('IndexedDB failed, falling back to localStorage:', error);
      return this.getFromLocalStorage();
    }
  }

  async getCompletedDay(date: string): Promise<CompletedDay | null> {
    try {
      const db = await this.initDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['completedDays'], 'readonly');
        const store = transaction.objectStore('completedDays');

        const request = store.get(date);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(new Error('Failed to load day data'));

        transaction.onerror = () => reject(new Error('Transaction failed'));
      });
    } catch (error) {
      console.warn('IndexedDB failed, falling back to localStorage:', error);
      const allDays = this.getFromLocalStorage();
      return allDays.find(day => day.date === date) || null;
    }
  }

  closeDB() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
    this.initPromise = null;
  }
}

export const indexedDBService = new IndexedDBService();
export type { CompletedDay };