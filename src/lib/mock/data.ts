import type { Conversation, Message, Project, ResearchJob, Assistant, LibraryItem, Memory, Automation, Usage, User } from "@/types";
import { generateId } from "@/lib/utils";

// ============================================
// Mock User
// ============================================
export const MOCK_USER: User = {
  id: "user-1",
  name: "Alex Morgan",
  email: "alex@nexa.ai",
  avatar: "",
  plan: "pro",
  createdAt: "2025-06-01T00:00:00Z",
  preferences: {
    theme: "system",
    defaultModel: "nexa-pro",
    memoryEnabled: true,
    responseStyle: "balanced",
    language: "en",
  },
};

// ============================================
// Mock Conversations
// ============================================
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    title: "Nexa Product Roadmap 2026",
    model: "nexa-pro",
    projectId: "proj-1",
    isPinned: true,
    isArchived: false,
    isFavorite: false,
    createdAt: "2026-09-01T10:00:00Z",
    updatedAt: "2026-09-03T08:00:00Z",
    messageCount: 24,
    lastMessage: "Here's the updated roadmap with Q4 milestones...",
    tags: ["project"],
  },
  {
    id: "conv-2",
    title: "How does RAG work?",
    model: "nexa-research",
    isPinned: false,
    isArchived: false,
    isFavorite: false,
    createdAt: "2026-09-03T05:00:00Z",
    updatedAt: "2026-09-03T05:30:00Z",
    messageCount: 8,
    lastMessage: "RAG combines retrieval with generation by...",
    tags: ["research"],
  },
  {
    id: "conv-3",
    title: "Analyze Q2 Sales Data.csv",
    model: "nexa-pro",
    isPinned: false,
    isArchived: false,
    isFavorite: false,
    createdAt: "2026-09-02T14:00:00Z",
    updatedAt: "2026-09-02T14:45:00Z",
    messageCount: 12,
    lastMessage: "The top performing product by revenue was...",
    tags: ["analysis"],
  },
  {
    id: "conv-4",
    title: "Create a marketing strategy",
    model: "nexa-creative",
    isPinned: false,
    isArchived: false,
    isFavorite: false,
    createdAt: "2026-09-01T09:00:00Z",
    updatedAt: "2026-09-01T10:00:00Z",
    messageCount: 16,
    lastMessage: "Here's a comprehensive marketing strategy...",
    tags: ["chat"],
  },
  {
    id: "conv-5",
    title: "Python function optimization",
    model: "nexa-code",
    isPinned: false,
    isArchived: false,
    isFavorite: false,
    createdAt: "2026-09-01T08:00:00Z",
    updatedAt: "2026-09-01T08:30:00Z",
    messageCount: 6,
    lastMessage: "Here's the optimized version using generators...",
    tags: ["code"],
  },
  {
    id: "conv-6",
    title: "Website Redesign Brief",
    model: "nexa-creative",
    isPinned: true,
    isArchived: false,
    isFavorite: true,
    createdAt: "2026-08-28T10:00:00Z",
    updatedAt: "2026-08-30T15:00:00Z",
    messageCount: 32,
    lastMessage: "The design system should prioritize...",
    tags: ["project"],
  },
  {
    id: "conv-7",
    title: "Python Function Help",
    model: "nexa-code",
    isPinned: false,
    isArchived: false,
    isFavorite: false,
    createdAt: "2026-08-27T09:00:00Z",
    updatedAt: "2026-08-27T09:15:00Z",
    messageCount: 4,
    lastMessage: "You can use the functools.lru_cache decorator...",
  },
  {
    id: "conv-8",
    title: "Sales Data Analysis",
    model: "nexa-pro",
    isPinned: false,
    isArchived: false,
    isFavorite: false,
    createdAt: "2026-08-26T14:00:00Z",
    updatedAt: "2026-08-26T15:00:00Z",
    messageCount: 10,
    lastMessage: "Q3 revenue shows a 23% increase...",
  },
  {
    id: "conv-9",
    title: "Nexa Brand Guidelines",
    model: "nexa-creative",
    isPinned: true,
    isArchived: false,
    isFavorite: false,
    createdAt: "2026-08-25T11:00:00Z",
    updatedAt: "2026-08-26T09:00:00Z",
    messageCount: 18,
    lastMessage: "The brand should communicate intelligence...",
  },
  {
    id: "conv-10",
    title: "Competitive Analysis",
    model: "nexa-research",
    isPinned: false,
    isArchived: false,
    isFavorite: false,
    createdAt: "2026-08-24T10:00:00Z",
    updatedAt: "2026-08-24T11:00:00Z",
    messageCount: 14,
    lastMessage: "Based on the analysis of 12 competitors...",
  },
];

// ============================================
// Mock Messages for conv-1
// ============================================
export const MOCK_MESSAGES: Record<string, Message[]> = {
  "conv-1": [
    {
      id: "msg-1",
      conversationId: "conv-1",
      role: "user",
      content: "Help me create a product roadmap for Nexa in 2026. We need to plan our major releases and features.",
      createdAt: "2026-09-01T10:00:00Z",
    },
    {
      id: "msg-2",
      conversationId: "conv-1",
      role: "assistant",
      content: `# Nexa Product Roadmap 2026

## Q1 — Foundation & Growth

### January
- **Nexa 2.0 Launch** — Complete redesign with new workspace paradigm
- Enhanced model routing with automatic selection
- Improved streaming performance (2x faster)

### February
- **Projects System** — Persistent AI environments with file context
- Team collaboration (beta)
- Memory system v2 with transparent controls

### March
- **Deep Research** — Multi-source research pipeline
- Canvas workspace for document editing
- Advanced data analysis tools

---

## Q2 — Intelligence & Scale

### April
- **Custom Assistants Platform** — Create, share, and publish AI assistants
- Tool framework with third-party integrations
- RAG pipeline v2 with better retrieval

### May
- **Voice Interface** — Real-time voice conversations
- Multi-language support (12 languages)
- Enterprise SSO integration

### June
- **Automation Engine** — Scheduled AI tasks and workflows
- API v2 for developers
- Mobile app (iOS & Android)

---

## Q3 — Platform & Ecosystem

| Feature | Target | Status |
|---------|--------|--------|
| Plugin marketplace | July | Planning |
| Real-time collaboration | August | Design |
| Video understanding | September | Research |

---

## Q4 — Enterprise & Scale

- Enterprise dashboard with admin controls
- Audit logging and compliance
- Custom model deployment
- SLA guarantees
- Data residency options

> **Goal**: Make Nexa the most capable AI workspace in the market.

Would you like me to break down any quarter in more detail?`,
      model: "nexa-pro",
      createdAt: "2026-09-01T10:00:30Z",
    },
    {
      id: "msg-3",
      conversationId: "conv-1",
      role: "user",
      content: "This looks great! Can you add more detail to Q3? Also, what metrics should we track?",
      createdAt: "2026-09-01T10:05:00Z",
    },
    {
      id: "msg-4",
      conversationId: "conv-1",
      role: "assistant",
      content: `## Q3 Deep Dive — Platform & Ecosystem

### July: Plugin Marketplace
- Launch **Nexa Plugins** — a marketplace for community tools
- Initial plugins: GitHub, Slack, Notion, Google Drive, Calendar
- Developer SDK for building custom plugins
- Revenue sharing model for plugin creators

### August: Real-time Collaboration
- **Live cursors** in Canvas documents
- Shared conversations with team members
- Role-based access control (viewer, editor, admin)
- Comment and annotation system

### September: Advanced Multimodal
- **Video understanding** — analyze, summarize, and Q&A on video
- Enhanced vision with diagram and chart understanding
- Audio transcription with speaker detection
- Multi-image comparison and analysis

---

## Key Metrics to Track

### Growth Metrics
| Metric | Q2 Target | Q3 Target | Q4 Target |
|--------|-----------|-----------|-----------|
| MAU | 500K | 1.2M | 3M |
| DAU | 150K | 400K | 1M |
| Paid Users | 25K | 75K | 200K |
| Enterprise Accounts | 50 | 200 | 500 |

### Engagement Metrics
- **Messages per user/day**: Target 15+
- **Session duration**: Target 25+ minutes
- **Feature adoption**: Track % of users using Research, Canvas, Code
- **Retention**: D7 > 60%, D30 > 40%

### AI Quality Metrics
- Response satisfaction rate (thumbs up/down)
- Model accuracy benchmarks
- Latency P50/P95/P99
- Token efficiency (cost per conversation)

### Business Metrics
- Monthly Recurring Revenue (MRR)
- Average Revenue Per User (ARPU)
- Churn rate (target < 5%)
- Cost per token served

Would you like me to create a detailed tracking dashboard specification?`,
      model: "nexa-pro",
      createdAt: "2026-09-01T10:05:30Z",
    },
  ],
};

// ============================================
// Mock Projects
// ============================================
export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Nexa Redesign",
    description: "Complete redesign of the Nexa AI workspace platform",
    instructions: "Act as the senior product architect for Nexa. Focus on creating a premium, production-grade AI workspace.",
    icon: "✦",
    color: "#7C5CFC",
    conversationCount: 12,
    fileCount: 8,
    files: [
      { id: "pf-1", projectId: "proj-1", name: "Product Specification.md", type: "text/markdown", size: 45000, uploadedAt: "2026-08-20T10:00:00Z", status: "ready" },
      { id: "pf-2", projectId: "proj-1", name: "Database Schema.sql", type: "text/sql", size: 12000, uploadedAt: "2026-08-21T10:00:00Z", status: "ready" },
      { id: "pf-3", projectId: "proj-1", name: "UI Guidelines.pdf", type: "application/pdf", size: 2500000, uploadedAt: "2026-08-22T10:00:00Z", status: "ready" },
    ],
    createdAt: "2026-08-15T10:00:00Z",
    updatedAt: "2026-09-03T08:00:00Z",
  },
  {
    id: "proj-2",
    name: "AI Research Hub",
    description: "Centralized research on AI architectures, models, and techniques",
    instructions: "Act as an AI research assistant. Focus on accuracy and cite sources.",
    icon: "🔬",
    color: "#00B8D4",
    conversationCount: 18,
    fileCount: 23,
    files: [],
    createdAt: "2026-07-01T10:00:00Z",
    updatedAt: "2026-09-02T16:00:00Z",
  },
  {
    id: "proj-3",
    name: "Marketing Campaign",
    description: "Q4 marketing campaign planning and content creation",
    instructions: "Act as a marketing strategist with expertise in SaaS and AI products.",
    icon: "📣",
    color: "#FF6B6B",
    conversationCount: 7,
    fileCount: 5,
    files: [],
    createdAt: "2026-08-01T10:00:00Z",
    updatedAt: "2026-09-01T12:00:00Z",
  },
];

// ============================================
// Mock Research
// ============================================
export const MOCK_RESEARCH: ResearchJob[] = [
  {
    id: "res-1",
    query: "AI Agents Landscape: Current state, key players, and future direction of autonomous AI agents in 2026",
    status: "completed",
    progress: 100,
    sources: [
      { id: "s1", title: "The Rise of AI Agents — Stanford HAI", url: "https://hai.stanford.edu/ai-agents-2026", snippet: "Autonomous AI agents have seen a 340% increase in deployment...", relevance: 0.95, favicon: "" },
      { id: "s2", title: "Agent Architectures Survey — DeepMind", url: "https://deepmind.google/research/agents", snippet: "Modern agent architectures combine reasoning, planning, and tool use...", relevance: 0.92, favicon: "" },
      { id: "s3", title: "Enterprise AI Agents — McKinsey", url: "https://mckinsey.com/ai-agents-enterprise", snippet: "67% of Fortune 500 companies now use AI agents for...", relevance: 0.88, favicon: "" },
    ],
    report: "# AI Agents Landscape 2026\n\n## Executive Summary\n\nThe AI agents ecosystem has experienced explosive growth...",
    createdAt: "2026-09-01T10:00:00Z",
    completedAt: "2026-09-01T10:15:00Z",
  },
  {
    id: "res-2",
    query: "Transformer Architecture Explained: A comprehensive deep-dive into attention mechanisms, positional encoding, and modern innovations",
    status: "completed",
    progress: 100,
    sources: [],
    report: "# Transformer Architecture\n\n## Executive Summary\n\nThe Transformer architecture, introduced in 'Attention Is All You Need' (2017)...",
    createdAt: "2026-08-28T14:00:00Z",
    completedAt: "2026-08-28T14:20:00Z",
  },
];

// ============================================
// Mock Assistants
// ============================================
export const MOCK_ASSISTANTS: Assistant[] = [
  {
    id: "ast-1",
    name: "Frontend Architect",
    description: "Senior frontend engineer specializing in React, Next.js, TypeScript and modern UI architecture",
    avatar: "⚛",
    instructions: "You are a senior frontend engineer with 10+ years of experience. You specialize in React, Next.js, TypeScript, and modern UI architecture. Always suggest best practices, performance optimizations, and clean code patterns.",
    model: "nexa-code",
    tools: ["code_interpreter", "web_search"],
    capabilities: ["Code generation", "Code review", "Architecture design", "Performance optimization"],
    conversationStarters: ["Review my React component", "Design a state management approach", "Optimize this Next.js page", "Help me with TypeScript generics"],
    knowledgeFiles: [],
    isPublic: false,
    createdAt: "2026-08-10T10:00:00Z",
    updatedAt: "2026-09-01T10:00:00Z",
  },
  {
    id: "ast-2",
    name: "Research Analyst",
    description: "Expert research analyst with academic rigor and clear communication",
    avatar: "📊",
    instructions: "You are an expert research analyst. Always provide thorough analysis, cite sources, and present findings in a structured format with executive summaries.",
    model: "nexa-research",
    tools: ["web_search", "data_analyst"],
    capabilities: ["Market research", "Data analysis", "Report writing", "Competitive analysis"],
    conversationStarters: ["Analyze this market segment", "Compare these companies", "Research the latest trends in...", "Write a report on..."],
    knowledgeFiles: [],
    isPublic: true,
    createdAt: "2026-07-15T10:00:00Z",
    updatedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "ast-3",
    name: "Writing Partner",
    description: "Professional writer and editor for articles, docs, and creative content",
    avatar: "✍",
    instructions: "You are a professional writer and editor. Help users craft compelling content with excellent structure, tone, and clarity.",
    model: "nexa-creative",
    tools: [],
    capabilities: ["Article writing", "Editing", "Tone adjustment", "Translation"],
    conversationStarters: ["Help me write a blog post", "Edit this draft", "Make this more concise", "Translate to French"],
    knowledgeFiles: [],
    isPublic: true,
    createdAt: "2026-08-01T10:00:00Z",
    updatedAt: "2026-08-15T10:00:00Z",
  },
];

// ============================================
// Mock Library Items
// ============================================
export const MOCK_LIBRARY: LibraryItem[] = [
  { id: "lib-1", name: "Product Specification.md", type: "document", mimeType: "text/markdown", size: 45000, tags: ["nexa", "product"], projectId: "proj-1", status: "ready", createdAt: "2026-08-20T10:00:00Z", updatedAt: "2026-08-20T10:00:00Z" },
  { id: "lib-2", name: "Q2 Sales Report.xlsx", type: "dataset", mimeType: "application/xlsx", size: 1200000, tags: ["sales", "data"], status: "ready", createdAt: "2026-08-15T10:00:00Z", updatedAt: "2026-08-15T10:00:00Z" },
  { id: "lib-3", name: "Brand Guidelines.pdf", type: "document", mimeType: "application/pdf", size: 5400000, tags: ["brand", "design"], projectId: "proj-1", status: "ready", createdAt: "2026-08-10T10:00:00Z", updatedAt: "2026-08-10T10:00:00Z" },
  { id: "lib-4", name: "Architecture Diagram.png", type: "image", mimeType: "image/png", size: 890000, tags: ["architecture", "diagram"], status: "ready", createdAt: "2026-08-05T10:00:00Z", updatedAt: "2026-08-05T10:00:00Z" },
  { id: "lib-5", name: "User Interviews.mp3", type: "audio", mimeType: "audio/mpeg", size: 34000000, tags: ["research", "interviews"], status: "ready", createdAt: "2026-07-28T10:00:00Z", updatedAt: "2026-07-28T10:00:00Z" },
  { id: "lib-6", name: "API Documentation.md", type: "code", mimeType: "text/markdown", size: 28000, tags: ["api", "docs"], status: "ready", createdAt: "2026-07-20T10:00:00Z", updatedAt: "2026-07-20T10:00:00Z" },
];

// ============================================
// Mock Memories
// ============================================
export const MOCK_MEMORIES: Memory[] = [
  { id: "mem-1", category: "user", content: "Name is Alex Morgan. Works as a product designer and developer.", source: "Introduction conversation", createdAt: "2026-06-01T10:00:00Z", updatedAt: "2026-06-01T10:00:00Z" },
  { id: "mem-2", category: "technical", content: "Prefers React with TypeScript and Next.js for web development. Uses Tailwind CSS for styling.", source: "Code conversation", createdAt: "2026-06-15T10:00:00Z", updatedAt: "2026-06-15T10:00:00Z" },
  { id: "mem-3", category: "writing", content: "Prefers concise, professional tone. Uses markdown for documentation.", source: "Writing session", createdAt: "2026-07-01T10:00:00Z", updatedAt: "2026-07-01T10:00:00Z" },
  { id: "mem-4", category: "project", content: "Currently working on Nexa AI — a next-generation AI workspace platform.", source: "Project conversation", createdAt: "2026-08-15T10:00:00Z", updatedAt: "2026-08-15T10:00:00Z" },
  { id: "mem-5", category: "goals", content: "Building Nexa to compete with ChatGPT, Claude, and Gemini. Target launch is Q1 2027.", source: "Planning session", createdAt: "2026-08-20T10:00:00Z", updatedAt: "2026-08-20T10:00:00Z" },
];

// ============================================
// Mock Automations
// ============================================
export const MOCK_AUTOMATIONS: Automation[] = [
  {
    id: "auto-1",
    name: "Weekly AI News Digest",
    description: "Every Monday, summarize the top AI news and research papers from the past week",
    schedule: "0 9 * * 1",
    timezone: "America/New_York",
    model: "nexa-research",
    prompt: "Summarize the top AI news, research papers, and product launches from the past week. Include key takeaways.",
    dataSources: ["web_search"],
    outputFormat: "markdown",
    status: "active",
    lastRun: "2026-09-01T09:00:00Z",
    nextRun: "2026-09-08T09:00:00Z",
    createdAt: "2026-08-01T10:00:00Z",
  },
  {
    id: "auto-2",
    name: "Daily Dev Activity Summary",
    description: "Every evening, summarize development activity and open PRs",
    schedule: "0 18 * * 1-5",
    timezone: "America/New_York",
    model: "nexa-code",
    prompt: "Summarize today's development activity including commits, PRs, and blockers.",
    dataSources: ["github"],
    outputFormat: "markdown",
    status: "active",
    lastRun: "2026-09-02T18:00:00Z",
    nextRun: "2026-09-03T18:00:00Z",
    createdAt: "2026-08-15T10:00:00Z",
  },
  {
    id: "auto-3",
    name: "Weekly Progress Report",
    description: "Every Friday, generate a comprehensive weekly progress report",
    schedule: "0 17 * * 5",
    timezone: "America/New_York",
    model: "nexa-pro",
    prompt: "Generate a weekly progress report covering accomplishments, blockers, and next week's priorities.",
    dataSources: ["projects", "conversations"],
    outputFormat: "markdown",
    status: "paused",
    lastRun: "2026-08-30T17:00:00Z",
    nextRun: undefined,
    createdAt: "2026-08-10T10:00:00Z",
  },
];

// ============================================
// Mock Usage
// ============================================
export const MOCK_USAGE: Usage = {
  messages: { used: 1248, limit: 5000 },
  storage: { used: 6.2, limit: 20 },
  research: { used: 18, limit: 50 },
  imageGen: { used: 34, limit: 200 },
  tokens: { used: 2450000, limit: 10000000 },
};

// ============================================
// Mock AI Response Generator
// ============================================
const MOCK_RESPONSES: Record<string, string> = {
  default: `I'd be happy to help you with that! Let me think about this carefully.

Here's my analysis:

## Key Points

1. **Understanding the context** — I've considered the full scope of your question
2. **Identifying patterns** — There are several important patterns to note
3. **Providing recommendations** — Based on the analysis, here are my suggestions

### Recommendations

- Start with a clear definition of your objectives
- Break down complex problems into smaller components
- Iterate and refine based on feedback

Would you like me to elaborate on any of these points?`,

  code: `Here's the implementation:

\`\`\`typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const data = await response.json();
    return {
      data,
      status: response.status,
      message: 'Success',
    };
  } catch (error) {
    throw new Error(\`Failed to fetch: \${error}\`);
  }
}

// Usage
const result = await fetchData<User[]>('/api/users');
console.log(result.data);
\`\`\`

This implementation includes:
- **Generic typing** for flexible response handling
- **Error handling** with descriptive messages
- **Type safety** throughout the chain

Would you like me to add caching or retry logic?`,

  research: `# Research Findings

## Executive Summary

Based on comprehensive analysis of 15 sources, here are the key findings on this topic.

## Key Findings

### 1. Market Trends
The market has shown consistent growth of **23% year-over-year**, driven primarily by enterprise adoption.

### 2. Technology Landscape
| Technology | Adoption Rate | Growth |
|-----------|--------------|--------|
| AI Agents | 67% | +340% |
| RAG Systems | 54% | +180% |
| Multimodal AI | 45% | +220% |

### 3. Competitive Analysis
The top three players control approximately 72% of the market, but emerging competitors are gaining ground rapidly.

## Sources
1. Stanford HAI Report 2026
2. McKinsey AI Index
3. Gartner Technology Radar

## Methodology
This analysis was conducted using web search, academic databases, and industry reports from the past 6 months.`,
};

export function getMockResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("code") || lower.includes("function") || lower.includes("implement") || lower.includes("typescript") || lower.includes("javascript") || lower.includes("python")) {
    return MOCK_RESPONSES.code;
  }
  if (lower.includes("research") || lower.includes("analyze") || lower.includes("market") || lower.includes("compare")) {
    return MOCK_RESPONSES.research;
  }
  return MOCK_RESPONSES.default;
}

export async function* streamMockResponse(input: string): AsyncGenerator<string> {
  const response = getMockResponse(input);
  const words = response.split(" ");
  for (let i = 0; i < words.length; i++) {
    yield words[i] + (i < words.length - 1 ? " " : "");
    await new Promise((resolve) => setTimeout(resolve, 15 + Math.random() * 25));
  }
}
