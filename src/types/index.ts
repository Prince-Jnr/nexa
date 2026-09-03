/* ============================================
   Nexa AI — Core Type Definitions
   ============================================ */

// --- User ---
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: "free" | "plus" | "pro" | "enterprise";
  createdAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  defaultModel: string;
  memoryEnabled: boolean;
  responseStyle: "concise" | "detailed" | "balanced";
  language: string;
}

// --- Conversations ---
export interface Conversation {
  id: string;
  title: string;
  model: string;
  projectId?: string;
  assistantId?: string;
  isPinned: boolean;
  isArchived: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessage?: string;
  tags?: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  model?: string;
  attachments?: Attachment[];
  citations?: Citation[];
  toolCalls?: ToolCall[];
  isStreaming?: boolean;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  previewUrl?: string;
}

export interface Citation {
  id: string;
  title: string;
  url: string;
  snippet: string;
  favicon?: string;
}

export interface ToolCall {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  input?: Record<string, unknown>;
  output?: string;
}

// --- Models ---
export interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: string;
  category: "fast" | "pro" | "vision" | "research" | "code" | "creative";
  icon: string;
  maxTokens: number;
  supportsStreaming: boolean;
  supportsVision: boolean;
  supportsTools: boolean;
  isDefault?: boolean;
}

export interface AIProvider {
  id: string;
  name: string;
  type: "openai" | "anthropic" | "google" | "local" | "custom";
  baseUrl: string;
  isActive: boolean;
  models: AIModel[];
}

// --- Projects ---
export interface Project {
  id: string;
  name: string;
  description: string;
  instructions: string;
  icon: string;
  color: string;
  conversationCount: number;
  fileCount: number;
  files: ProjectFile[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  status: "processing" | "ready" | "error";
}

// --- Memory ---
export interface Memory {
  id: string;
  category: "user" | "writing" | "technical" | "project" | "goals";
  content: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

// --- Assistants ---
export interface Assistant {
  id: string;
  name: string;
  description: string;
  avatar: string;
  instructions: string;
  model: string;
  tools: string[];
  capabilities: string[];
  conversationStarters: string[];
  knowledgeFiles: ProjectFile[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Library ---
export interface LibraryItem {
  id: string;
  name: string;
  type: "document" | "image" | "audio" | "video" | "dataset" | "code" | "research";
  mimeType: string;
  size: number;
  tags: string[];
  projectId?: string;
  status: "processing" | "ready" | "error";
  createdAt: string;
  updatedAt: string;
}

// --- Research ---
export interface ResearchJob {
  id: string;
  query: string;
  status: "planning" | "searching" | "reviewing" | "cross-checking" | "writing" | "completed" | "failed";
  sources: ResearchSource[];
  report?: string;
  progress: number;
  createdAt: string;
  completedAt?: string;
}

export interface ResearchSource {
  id: string;
  title: string;
  url: string;
  snippet: string;
  relevance: number;
  favicon?: string;
}

// --- Automations ---
export interface Automation {
  id: string;
  name: string;
  description: string;
  schedule: string;
  timezone: string;
  model: string;
  prompt: string;
  dataSources: string[];
  outputFormat: string;
  status: "active" | "paused" | "completed" | "error";
  lastRun?: string;
  nextRun?: string;
  createdAt: string;
}

// --- Billing ---
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: "monthly" | "yearly";
  features: string[];
  limits: PlanLimits;
  isPopular?: boolean;
}

export interface PlanLimits {
  messagesPerDay: number;
  storageGB: number;
  researchPerMonth: number;
  imageGenPerMonth: number;
  maxProjects: number;
  maxAssistants: number;
}

export interface Usage {
  messages: { used: number; limit: number };
  storage: { used: number; limit: number };
  research: { used: number; limit: number };
  imageGen: { used: number; limit: number };
  tokens: { used: number; limit: number };
}

// --- Sharing ---
export interface SharedItem {
  id: string;
  type: "conversation" | "research" | "document";
  title: string;
  visibility: "private" | "link" | "public";
  createdAt: string;
  viewCount: number;
}

// --- Admin ---
export interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
  totalConversations: number;
  totalMessages: number;
  totalTokens: number;
  storageUsedGB: number;
  revenue: number;
  errorRate: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  details: string;
  ip: string;
  timestamp: string;
}

// --- Notifications ---
export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
