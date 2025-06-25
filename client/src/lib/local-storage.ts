// Local storage utilities for tree configurations
export interface TreeConfiguration {
  id: string;
  name: string;
  canopyDepth: number;
  maxDepth: number;
  maxBufferSize: number;
  isDefault: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'soltree-configurations';

export function getTreeConfigurations(): TreeConfiguration[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveTreeConfiguration(config: Omit<TreeConfiguration, 'id' | 'createdAt'>): TreeConfiguration {
  const configurations = getTreeConfigurations();
  const newConfig: TreeConfiguration = {
    ...config,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  // If this is set as default, unset others
  if (newConfig.isDefault) {
    configurations.forEach(c => c.isDefault = false);
  }
  
  configurations.push(newConfig);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(configurations));
  return newConfig;
}

export function deleteTreeConfiguration(id: string): boolean {
  try {
    const configurations = getTreeConfigurations();
    const filtered = configurations.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

export function setDefaultConfiguration(id: string): boolean {
  try {
    const configurations = getTreeConfigurations();
    let found = false;
    
    configurations.forEach(c => {
      if (c.id === id) {
        c.isDefault = true;
        found = true;
      } else {
        c.isDefault = false;
      }
    });
    
    if (found) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(configurations));
    }
    
    return found;
  } catch {
    return false;
  }
}

export function getDefaultConfiguration(): TreeConfiguration | null {
  const configurations = getTreeConfigurations();
  return configurations.find(c => c.isDefault) || null;
}