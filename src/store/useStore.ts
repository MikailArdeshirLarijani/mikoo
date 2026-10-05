import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message { id: string; role: 'user' | 'assistant' | 'system'; content: string; timestamp: number; }
export interface Conversation { id: string; title: string; messages: Message[]; updatedAt: number; pinned?: boolean; }
export interface Provider { id: string; name: string; baseUrl: string; apiKey: string; enabled: boolean; }
export interface AgentLog { id: string; message: string; timestamp: number; type: 'info' | 'success' | 'error'; }
export interface Project { id: string; name: string; path: string; updatedAt: number; color: string; }

export type Language = 'en' | 'fa' | 'ar' | 'fr';
export type ViewMode = 'home' | 'history' | 'settings' | 'projects' | 'scheduled';

export interface AppearancePrefs {
  // 1. Basics
  theme: 'dark' | 'light';
  accentColor: 'blue' | 'purple' | 'emerald' | 'rose' | 'amber' | 'cyan';
  // 2. Typography
  appFont: string;
  fontSize: string;
  lineHeight: string;
  // 3. Layout & Structure
  sidebarPosition: string;
  chatWidth: string;
  compactMode: boolean;
  messageSpacing: string;
  inputStyle: string;
  messageAlignment: string;
  // 4. Shapes & Borders
  borderRadius: string;
  bubbleStyle: string;
  buttonStyle: string;
  dividerStyle: string;
  // 5. Effects & Materials
  glassmorphism: boolean;
  neonGlow: boolean;
  shadowIntensity: string;
  colorVibrancy: string;
  // 6. Themes & Backgrounds
  pageBackground: string;
  sidebarTheme: string;
  codeBlockTheme: string;
  // 7. Micro-interactions
  animationSpeed: string;
  focusRingStyle: string;
  hoverIntensity: string;
  typingIndicator: string;
  // 8. Elements Visibility
  avatarVisibility: boolean;
  timestampVisibility: string;
  scrollbarStyle: string;
  iconWeight: string;
}

interface AppState {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  
  conversations: Conversation[];
  activeConversationId: string | null;
  projects: Project[];
  activeProjectId: string | null;
  providers: Provider[];
  activeProviderId: string | null;
  activeModel: string;
  
  currentView: ViewMode;
  language: Language;
  
  // The MEGA Appearance Pack (30 Settings)
  appearance: AppearancePrefs;
  setAppearance: (key: keyof AppearancePrefs, val: any) => void;
  
  requireApproval: boolean;
  agentLogs: AgentLog[];
  
  // Other Settings
  systemPrompt: string;
  persona: string;
  temperature: number;
  codeFont: string;
  lineNumbers: boolean;
  wordWrap: boolean;
  voiceLanguage: string;
  autoSendVoice: boolean;
  terminalShell: string;
  workspacePath: string;
  soundEffects: boolean;
  desktopNotifications: boolean;
  enterToSend: boolean;
  saveHistory: boolean;
  
  setRequireApproval: (val: boolean) => void;
  addAgentLog: (msg: string, type: 'info'|'success'|'error') => void;
  
  setCurrentView: (view: ViewMode) => void;
  setLanguage: (lang: Language) => void;
  setSetting: (key: keyof AppState, value: any) => void;

  addProvider: (provider: Provider) => void;
  updateProvider: (id: string, provider: Partial<Provider>) => void;
  deleteProvider: (id: string) => void;
  setActiveProvider: (id: string) => void;
  setActiveModel: (model: string) => void;
  
  addConversation: () => string;
  setActiveConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  clearAllConversations: () => void;
  togglePinConversation: (id: string) => void;
  clearChatMessages: (id: string) => void;
  
  addProject: (name: string, path: string) => void;
  setActiveProject: (id: string) => void;
  deleteProject: (id: string) => void;
  
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, messageId: string, content: string) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      setSidebarOpen: (v: boolean) => set({ sidebarOpen: v }),
      conversations: [], activeConversationId: null,
      projects: [], activeProjectId: null,
      providers: [
        { id: 'openai', name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', apiKey: '', enabled: true },
        { id: 'anthropic', name: 'Anthropic', baseUrl: 'https://api.anthropic.com/v1', apiKey: '', enabled: true }
      ],
      activeProviderId: 'openai', activeModel: 'gpt-4o',
      
      currentView: 'home', language: 'en',
      
      // Default Appearance (30 fields)
      appearance: {
        theme: 'dark', accentColor: 'rose',
        appFont: 'system-ui', fontSize: '13px', lineHeight: '1.5',
        sidebarPosition: 'left', chatWidth: '800px', compactMode: false, messageSpacing: '16px', inputStyle: 'docked', messageAlignment: 'left',
        borderRadius: '8px', bubbleStyle: 'solid', buttonStyle: 'flat', dividerStyle: 'solid',
        glassmorphism: false, neonGlow: false, shadowIntensity: 'light', colorVibrancy: 'standard',
        pageBackground: 'solid', sidebarTheme: 'default', codeBlockTheme: 'default',
        animationSpeed: '0.2s', focusRingStyle: 'subtle', hoverIntensity: 'normal', typingIndicator: 'pulse',
        avatarVisibility: true, timestampVisibility: 'always', scrollbarStyle: 'default', iconWeight: '2'
      },
      setAppearance: (key, val) => set((state) => ({ appearance: { ...state.appearance, [key]: val } })),
      
      requireApproval: true, agentLogs: [],
      systemPrompt: 'You are mikoO, a highly capable AI assistant and expert programmer.', persona: 'Developer',
      temperature: 0.7, codeFont: 'Consolas', lineNumbers: true, wordWrap: true,
      voiceLanguage: 'fa-IR', autoSendVoice: false, terminalShell: 'powershell.exe', workspacePath: 'C:\\Projects',
      soundEffects: true, desktopNotifications: true, enterToSend: true, saveHistory: true,

      setSetting: (key, value) => set({ [key]: value } as any),
      setRequireApproval: (val) => set({ requireApproval: val }),
      addAgentLog: (message, type) => set((state) => ({ agentLogs: [{ id: crypto.randomUUID(), message, type, timestamp: Date.now() }, ...state.agentLogs] })),
      setCurrentView: (view) => set({ currentView: view }),
      setLanguage: (lang) => set({ language: lang }),

      addProvider: (p) => set((state) => ({ providers: [...state.providers, p] })),
      updateProvider: (id, p) => set((state) => ({ providers: state.providers.map(prov => prov.id === id ? { ...prov, ...p } : prov) })),
      deleteProvider: (id) => set((state) => ({ providers: state.providers.filter(p => p.id !== id) })),
      setActiveProvider: (id) => set({ activeProviderId: id }),
      setActiveModel: (model) => set({ activeModel: model }),

      addConversation: () => {
        const id = crypto.randomUUID();
        const newConv: Conversation = { id, title: 'New Conversation', messages: [], updatedAt: Date.now(), pinned: false };
        set((state) => ({ conversations: [newConv, ...state.conversations], activeConversationId: id, currentView: 'home' }));
        return id;
      },
      setActiveConversation: (id) => set({ activeConversationId: id, currentView: 'home' }),
      deleteConversation: (id) => set((state) => {
        const newConvs = state.conversations.filter(c => c.id !== id);
        return { conversations: newConvs, activeConversationId: state.activeConversationId === id ? (newConvs[0]?.id || null) : state.activeConversationId };
      }),
      clearAllConversations: () => set({ conversations: [], activeConversationId: null }),
      togglePinConversation: (id) => set((state) => ({ conversations: state.conversations.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c) })),
      clearChatMessages: (id) => set((state) => ({ conversations: state.conversations.map(c => c.id === id ? { ...c, messages: [] } : c) })),
      
      addProject: (name, path) => set((state) => {
        const id = crypto.randomUUID();
        const colors = ['#3b82f6', '#a855f7', '#10b981', '#ec4899', '#f59e0b', '#06b6d4'];
        return { projects: [{ id, name, path, updatedAt: Date.now(), color: colors[Math.floor(Math.random() * colors.length)] }, ...state.projects], activeProjectId: id };
      }),
      setActiveProject: (id) => set({ activeProjectId: id }),
      deleteProject: (id) => set((state) => {
         const newProjects = state.projects.filter(p => p.id !== id);
         return { projects: newProjects, activeProjectId: state.activeProjectId === id ? (newProjects[0]?.id || null) : state.activeProjectId };
      }),
      
      addMessage: (cId, msg) => set((state) => ({ 
        conversations: state.conversations.map(c => c.id === cId ? { 
          ...c, messages: [...c.messages, msg], updatedAt: Date.now(),
          title: c.messages.length === 0 && msg.role === 'user' ? msg.content.slice(0, 30) + '...' : c.title
        } : c) 
      })),
      updateMessage: (cId, mId, content) => set((state) => ({
        conversations: state.conversations.map(c => c.id === cId ? { ...c, messages: c.messages.map(m => m.id === mId ? { ...m, content } : m) } : c)
      })),
      deleteMessage: (cId, mId) => set((state) => ({
        conversations: state.conversations.map(c => c.id === cId ? { ...c, messages: c.messages.filter(m => m.id !== mId) } : c)
      }))
    }),
    { name: 'mikoo-storage' }
  )
);
