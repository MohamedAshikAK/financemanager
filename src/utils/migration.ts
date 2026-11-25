// Data migration strategy for localStorage schema changes
const CURRENT_VERSION = 1;

export function migrateData(_key: string, rawData: string): string {
  try {
    const parsed = JSON.parse(rawData);
    
    // If no version, assume version 0
    if (!parsed.version) {
      return migrateFromV0(parsed);
    }
    
    // If current version, no migration needed
    if (parsed.version === CURRENT_VERSION) {
      return rawData;
    }
    
    // Handle version migrations
    let data = parsed;
    for (let v = parsed.version; v < CURRENT_VERSION; v++) {
      data = migrateToVersion(v + 1, data);
    }
    
    return JSON.stringify(data);
  } catch (error) {
    console.error('Migration error:', error);
    return rawData; // Return original if migration fails
  }
}

function migrateFromV0(data: any): string {
  // Migration from version 0 to 1
  const migrated = {
    version: 1,
    state: data.state || data,
  };
  return JSON.stringify(migrated);
}

function migrateToVersion(version: number, data: any): any {
  switch (version) {
    case 1:
      // Future migrations go here
      return data;
    default:
      return data;
  }
}

export function addVersionToData(_key: string, data: any): string {
  return JSON.stringify({
    version: CURRENT_VERSION,
    state: data,
  });
}
