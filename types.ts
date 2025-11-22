
export enum View {
  HERO = 'HERO',
  CLI = 'CLI',
  GENERATOR = 'GENERATOR',
  ARCHITECTURE = 'ARCHITECTURE',
  DEVTOOLS = 'DEVTOOLS',
  DOCS = 'DOCS',
  AI_ASSISTANT = 'AI_ASSISTANT'
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface CliLine {
  type: 'input' | 'output' | 'success' | 'error' | 'info';
  text: string;
}

export interface FolderNode {
  name: string;
  type: 'file' | 'folder';
  children?: FolderNode[];
  description?: string;
}

export interface MockRequest {
  id: string;
  timestamp: string;
  method: string;
  endpoint: string;
  status: number;
  duration: string;
  type: 'RPC' | 'REST';
}

export interface MockDbRow {
  id: string;
  [key: string]: string | number | boolean;
}
