import { useState, useEffect, useRef } from 'react';
import { useStore, type Message } from './store/useStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import {
  Plus, MessageSquare, Settings, Send, Loader2,
  TerminalSquare, Bot, Sun, KeyRound, Search, Trash2, ChevronDown,
  PanelLeft, ChevronLeft, ChevronRight, History, Clock, ListFilter, FolderPlus, Pin, Edit2, Copy, RefreshCw, Download, StopCircle, Type, Layout, Square, Sparkles
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Reusable components                                               */
/* ------------------------------------------------------------------ */

function getRelativeTime(ts: number) {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor(diff / (1000 * 60));
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (mins > 0) return `${mins}m`;
  return 'Just now';
}

function Sidebar() {
  const { currentView, setCurrentView, addConversation, conversations, activeConversationId, setActiveConversation, deleteConversation, sidebarOpen, setSidebarOpen, projects, activeProjectId, addProject, setActiveProject, deleteProject, togglePinConversation, appearance } = useStore();

  const goBack = () => {
    const idx = conversations.findIndex(c => c.id === activeConversationId);
    if(idx < conversations.length - 1 && idx !== -1) {
       setActiveConversation(conversations[idx+1].id);
       setCurrentView('home');
    } else if (currentView !== 'home' && activeConversationId) {
       setCurrentView('home');
    }
  };

  const goForward = () => {
    const idx = conversations.findIndex(c => c.id === activeConversationId);
    if(idx > 0) {
       setActiveConversation(conversations[idx-1].id);
       setCurrentView('home');
    }
  };

  if (!sidebarOpen) return null;

  const pinnedConvs = conversations.filter(c => c.pinned);
  const unpinnedConvs = conversations.filter(c => !c.pinned);
  
  const sidebarClass = "custom-sidebar w-[260px] shrink-0 border-r border-[#2d323e] flex flex-col text-gray-300 " + 
    (appearance.sidebarTheme === 'darker' ? 'bg-[#0a0b0e]' : appearance.sidebarTheme === 'black' ? 'bg-black' : 'bg-[#121318]');

  return (
    <aside className={sidebarClass}>
      <div className="custom-header h-12 flex items-center px-4 gap-4 shrink-0">
        <div className="flex items-center justify-center w-5 h-5 bg-white rounded-[4px] overflow-hidden shrink-0">
          <img src="./icon.png" alt="logo" className="w-full h-full object-cover" />
        </div>
        <PanelLeft size={16} onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-200 cursor-pointer transition-colors" />
        <ChevronLeft size={16} onClick={goBack} className="text-gray-500 cursor-pointer hover:text-gray-300 transition-colors" />
        <ChevronRight size={16} onClick={goForward} className="text-gray-600 cursor-pointer hover:text-gray-300 transition-colors" />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4">
        <div className="px-3 pt-2 pb-4 space-y-1">
          <button onClick={() => { addConversation(); setCurrentView('home'); }} className="w-full flex items-center gap-2 bg-transparent ring-1 ring-[#2d323e] hover:bg-white/[0.04] text-gray-200 text-[12.5px] py-1.5 px-3 rounded-[6px] transition-all custom-btn">
            <Plus size={14} className="text-gray-400" /> New Conversation
          </button>
          
          <button onClick={() => setCurrentView('history')} className={"w-full flex items-center gap-2 text-[12.5px] py-1.5 px-3 rounded-[6px] transition-all mt-1 custom-btn " + (currentView === 'history' ? 'bg-[#2d323e] text-gray-100' : 'bg-transparent hover:bg-white/[0.04] text-gray-300')}>
            <History size={14} className={currentView === 'history' ? 'text-gray-300' : 'text-gray-400'} /> Conversation History
          </button>
          
          <button onClick={() => setCurrentView('scheduled')} className={"w-full flex items-center gap-2 text-[12.5px] py-1.5 px-3 rounded-[6px] transition-all custom-btn " + (currentView === 'scheduled' ? 'bg-[#2d323e] text-gray-100' : 'bg-transparent hover:bg-white/[0.04] text-gray-300')}>
            <Clock size={14} className={currentView === 'scheduled' ? 'text-gray-300' : 'text-gray-400'} /> Scheduled Tasks
          </button>
        </div>

        <div className="px-3 py-2">
          <div className="flex items-center justify-between px-2 mb-1 group cursor-pointer">
            <span className="text-[11.5px] font-semibold text-gray-400 uppercase tracking-wider">Projects</span>
            <div className="flex items-center gap-2 text-gray-500 transition-colors">
              <ListFilter size={13} className="hover:text-gray-200 transition-colors cursor-pointer" />
              <FolderPlus size={13} className="hover:text-gray-200 transition-colors cursor-pointer" onClick={(e) => {
                 e.stopPropagation();
                 const name = window.prompt("Enter new project name:");
                 if(name) addProject(name, "C:\\Projects\\" + name);
              }} />
            </div>
          </div>
          <div className="space-y-[2px]">
            {projects.map(p => {
              const isActive = activeProjectId === p.id;
              return (
                <div key={p.id} onClick={() => setActiveProject(p.id)} className={`group flex items-center justify-between px-3 py-1.5 rounded-[6px] text-[12.5px] cursor-pointer transition-colors custom-item ${isActive ? 'bg-[#2d323e] text-gray-100' : 'text-gray-400 hover:bg-white/[0.04] hover:text-gray-200'}`}>
                  <span className="truncate pr-2 flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span> {p.name}</span>
                  <div className="flex items-center shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-rose-400 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
              );
            })}
            {projects.length === 0 && <div className="text-[12px] text-gray-600 px-2 py-1 italic">No active projects</div>}
          </div>
        </div>

        <div className="px-3 py-2 mt-1">
          <div className="flex items-center justify-between px-2 mb-1 group cursor-pointer">
            <span className="text-[11.5px] font-semibold text-gray-400 uppercase tracking-wider">Conversations</span>
            <Plus size={14} className="text-gray-500 hover:text-gray-200 cursor-pointer transition-colors" onClick={() => { addConversation(); setCurrentView('home'); }} />
          </div>
          <div className="space-y-[2px]">
            {pinnedConvs.map(c => {
              const isActive = currentView === 'home' && activeConversationId === c.id;
              return (
                <div key={c.id} onClick={() => { setActiveConversation(c.id); setCurrentView('home'); }} className={`group flex items-center justify-between px-3 py-1.5 rounded-[6px] text-[12.5px] cursor-pointer transition-colors custom-item ${isActive ? 'bg-[#2d323e] text-gray-100' : 'text-gray-400 hover:bg-white/[0.04] hover:text-gray-200'}`}>
                  <span className="truncate pr-2 flex items-center gap-1"><Pin size={10} className="text-[var(--color-accent)] shrink-0" /> {c.title}</span>
                  <div className="flex items-center shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); togglePinConversation(c.id); }} className="opacity-0 group-hover:opacity-100 text-[var(--color-accent)] hover:opacity-80 transition-colors mr-2"><Pin size={13} className="fill-[var(--color-accent)]" /></button>
                    <button onClick={(e) => { e.stopPropagation(); deleteConversation(c.id); }} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-rose-400 transition-colors mr-2"><Trash2 size={13} /></button>
                    <span className={`text-[11px] ${isActive ? 'text-gray-400' : 'text-gray-500'}`}>{getRelativeTime(c.updatedAt)}</span>
                  </div>
                </div>
              );
            })}
            {unpinnedConvs.map(c => {
              const isActive = currentView === 'home' && activeConversationId === c.id;
              return (
                <div key={c.id} onClick={() => { setActiveConversation(c.id); setCurrentView('home'); }} className={`group flex items-center justify-between px-3 py-1.5 rounded-[6px] text-[12.5px] cursor-pointer transition-colors custom-item ${isActive ? 'bg-[#2d323e] text-gray-100' : 'text-gray-400 hover:bg-white/[0.04] hover:text-gray-200'}`}>
                  <span className="truncate pr-2">{c.title}</span>
                  <div className="flex items-center shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); togglePinConversation(c.id); }} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-[var(--color-accent)] transition-colors mr-2"><Pin size={13} /></button>
                    <button onClick={(e) => { e.stopPropagation(); deleteConversation(c.id); }} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-rose-400 transition-colors mr-2"><Trash2 size={13} /></button>
                    <span className={`text-[11px] ${isActive ? 'text-gray-400' : 'text-gray-500'}`}>{getRelativeTime(c.updatedAt)}</span>
                  </div>
                </div>
              );
            })}
            {conversations.length === 0 && <div className="text-[12px] text-gray-600 px-2 py-2">No conversations</div>}
          </div>
        </div>
      </div>

      <div className="p-3 mt-auto shrink-0 border-t border-[#2d323e]">
        <button onClick={() => setCurrentView('settings')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-[6px] text-[12.5px] transition-colors custom-btn ${currentView === 'settings' ? 'bg-[#2d323e] text-gray-100' : 'text-gray-400 hover:bg-white/[0.04] hover:text-gray-200'}`}>
          <Settings size={15} className={currentView === 'settings' ? 'text-gray-300' : 'text-gray-400'} /> Settings
        </button>
      </div>
    </aside>
  );
}

/* --------------------------- Views --------------------------- */

function HistoryView() {
  const { conversations, setActiveConversation, setCurrentView, deleteConversation } = useStore();
  const [search, setSearch] = useState('');
  const filtered = conversations.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-transparent">
       <div className="h-12 flex items-center border-b border-[#2d323e] px-8 shrink-0 custom-header">
         <h2 className="text-[14px] font-medium text-gray-200 flex items-center gap-2"><History size={16} className="text-[var(--color-accent)]" /> Conversation History</h2>
       </div>
       <div className="flex-1 overflow-y-auto p-8 custom-bg">
         <div className="max-w-3xl mx-auto">
           <div className="mb-6 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search past conversations..." className="w-full bg-[#1c1f26] ring-1 ring-[#2d323e] rounded-[8px] pl-9 pr-4 py-2.5 text-[13px] text-gray-200 outline-none focus:ring-[var(--color-accent)]/50 transition-all custom-input" />
           </div>
           
           <div className="space-y-3">
             {filtered.map(c => (
               <div key={c.id} className="flex items-center justify-between p-4 bg-[#1c1f26] rounded-[8px] ring-1 ring-[#2d323e] hover:ring-[var(--color-accent)]/50 cursor-pointer transition-all custom-item" onClick={() => { setActiveConversation(c.id); setCurrentView('home'); }}>
                 <div className="min-w-0 flex-1">
                   <div className="text-[14px] font-medium text-gray-200 truncate">{c.title}</div>
                   <div className="text-[12px] text-gray-500 mt-1 flex items-center gap-3">
                     <span>{new Date(c.updatedAt).toLocaleString()}</span>
                     <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                     <span>{c.messages.length} messages</span>
                   </div>
                 </div>
                 <button onClick={(e) => { e.stopPropagation(); deleteConversation(c.id); }} className="text-gray-500 hover:text-rose-400 p-2 shrink-0 transition-colors ml-4"><Trash2 size={16} /></button>
               </div>
             ))}
           </div>
         </div>
       </div>
    </div>
  );
}

function ScheduledView() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 custom-bg text-gray-500">
       <div className="w-16 h-16 rounded-full bg-[#1c1f26] ring-1 ring-[#2d323e] flex items-center justify-center mb-4 custom-item">
         <Clock size={28} className="text-gray-400" />
       </div>
       <h2 className="text-[18px] font-medium text-gray-200">No Scheduled Tasks</h2>
    </div>
  );
}

/* --------------------------- Chat column --------------------------- */

function ChatLogLine({ entry, onEdit, onDelete, onRegenerate, codeFont, prefs }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState(entry.content);

  const handleSave = () => { onEdit(entry.id, editVal); setIsEditing(false); };
  const timeString = new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (entry.role === "system") {
    return (
      <div className="group relative text-center my-2">
        <div className="inline-block text-[11px] text-gray-500 py-1 bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20 rounded-[6px] px-3 custom-bubble">{entry.content}</div>
      </div>
    );
  }
  
  if (entry.role === "user") {
    return (
      <div className={`flex group mb-[var(--msg-spacing)] ${prefs.messageAlignment === 'center' ? 'justify-center' : 'justify-end'}`}>
        <div className="flex flex-col items-end max-w-[85%] custom-bubble-wrap">
           <div className="flex items-center gap-2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setIsEditing(!isEditing)} className="text-gray-500 hover:text-gray-300 p-1"><Edit2 size={12} /></button>
              <button onClick={() => onDelete(entry.id)} className="text-gray-500 hover:text-rose-400 p-1"><Trash2 size={12} /></button>
           </div>
           
           {isEditing ? (
             <div className="w-full min-w-[300px] bg-[#1c1f26] ring-1 ring-[#2d323e] rounded-[8px] p-2 flex flex-col gap-2 custom-input">
               <textarea value={editVal} onChange={e => setEditVal(e.target.value)} className="w-full bg-transparent text-[13px] text-gray-200 outline-none resize-none" rows={3} />
               <div className="flex justify-end gap-2">
                 <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-[11px] text-gray-400 hover:bg-white/5 rounded-[4px] custom-btn">Cancel</button>
                 <button onClick={handleSave} className="px-3 py-1 text-[11px] bg-[var(--color-accent)] text-white rounded-[4px] custom-btn">Save</button>
               </div>
             </div>
           ) : (
             <div className="custom-bubble-user text-gray-100 text-[13px] leading-relaxed px-3 py-2 whitespace-pre-wrap">
               {entry.content}
             </div>
           )}
           {prefs.timestampVisibility !== 'hidden' && <div className={`text-[10px] text-gray-600 mt-1 ${prefs.timestampVisibility === 'hover' ? 'opacity-0 group-hover:opacity-100' : ''}`}>{timeString}</div>}
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex items-start gap-2 max-w-full group mb-[var(--msg-spacing)] ${prefs.messageAlignment === 'center' ? 'justify-center' : ''}`}>
      {prefs.avatarVisibility && (
        <div className="w-6 h-6 rounded-[6px] bg-[#1c1f26] ring-1 ring-[#2d323e] flex items-center justify-center shrink-0 mt-0.5 custom-item">
          <Bot size={12} className="text-[var(--color-accent)]" />
        </div>
      )}
      <div className="flex flex-col gap-1 min-w-0 flex-1 overflow-hidden custom-bubble-wrap">
        <div className="flex items-center gap-2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => navigator.clipboard.writeText(entry.content)} className="text-gray-500 hover:text-gray-300 p-1 flex items-center gap-1 text-[10px]"><Copy size={11} /> Copy</button>
          <button onClick={() => onRegenerate(entry.id)} className="text-gray-500 hover:text-gray-300 p-1 flex items-center gap-1 text-[10px]"><RefreshCw size={11} /> Regenerate</button>
          <button onClick={() => onDelete(entry.id)} className="text-gray-500 hover:text-rose-400 p-1"><Trash2 size={11} /></button>
        </div>
        
        <div className="custom-bubble-ai flex flex-col gap-2 text-[13px] px-4 py-3 text-gray-300">
          <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent prose-pre:m-0 prose-code:before:hidden prose-code:after:hidden prose-table:w-full prose-table:border-collapse prose-th:border prose-th:border-[#2d323e] prose-th:p-2 prose-th:bg-[#15171d] prose-td:border prose-td:border-[#2d323e] prose-td:p-2">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                code({node, inline, className, children, ...props}: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');
                  return !inline && match ? (
                    <div className="mt-2 mb-2 rounded-[8px] overflow-hidden ring-1 ring-[#2d323e] custom-code">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-[#15171d] border-b border-[#2d323e] custom-code-header">
                        <span className="text-[10px] font-medium text-gray-400 uppercase">{match[1]}</span>
                        <button onClick={() => navigator.clipboard.writeText(codeString)} className="text-gray-500 hover:text-gray-200"><Copy size={12}/></button>
                      </div>
                      <SyntaxHighlighter style={vscDarkPlus as any} language={match[1]} PreTag="div" customStyle={{margin: 0, background: 'transparent', fontSize: '12px', fontFamily: codeFont || 'Consolas'}} {...props}>
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className="bg-white/10 rounded-[4px] px-1.5 py-0.5 text-[var(--color-accent)] font-mono text-[11.5px] custom-code-inline" {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {entry.content}
            </ReactMarkdown>
          </div>
        </div>
        {prefs.timestampVisibility !== 'hidden' && <div className={`text-[10px] text-gray-600 ml-1 ${prefs.timestampVisibility === 'hover' ? 'opacity-0 group-hover:opacity-100' : ''}`}>{timeString}</div>}
      </div>
    </div>
  );
}

function ModelSwitcher() {
  const { activeModel, setActiveModel, setActiveProvider } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const MODELS = [
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai' },
    { id: 'dall-e-3', name: 'DALL-E 3', provider: 'openai' },
    { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet', provider: 'anthropic' }
  ];
  const current = MODELS.find(m => m.id === activeModel) || MODELS[0];

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 bg-[#1c1f26] ring-1 ring-[#2d323e] hover:ring-[#4b5563] rounded-[6px] px-3 py-1.5 transition-all text-[12px] text-gray-300 outline-none custom-btn">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: current.provider === 'openai' ? '#10b981' : '#f59e0b' }} />
        <span className="font-medium">{current.name}</span>
        <ChevronDown size={13} className="text-gray-500" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1 w-[200px] bg-[#1c1f26] ring-1 ring-[#2d323e] rounded-[8px] shadow-2xl z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-1 duration-150 custom-bg custom-item">
            {MODELS.map(m => (
              <button key={m.id} onClick={() => { setActiveModel(m.id); setActiveProvider(m.provider); setIsOpen(false); }} className={`w-full text-left px-3 py-1.5 text-[12.5px] transition-colors flex items-center gap-2 ${m.id === activeModel ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]' : 'text-gray-300 hover:bg-[#2d323e] hover:text-gray-100'}`}>
                {m.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ChatColumn() {
  const store = useStore();
  const { conversations, activeConversationId, addMessage, updateMessage, deleteMessage, clearChatMessages, activeModel, activeProviderId, providers, sidebarOpen, setSidebarOpen, temperature, codeFont, appearance } = store;
  
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const currentChat = conversations.find(c => c.id === activeConversationId);
  const messages = currentChat?.messages || [];
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' }); }, [messages.length, isLoading]);

  const fetchAIResponse = async (userMsgObj: Message) => {
    if (!activeConversationId) return;
    const provider = providers.find((p: any) => p.id === activeProviderId);
    if (!provider || !provider.apiKey) {
      addMessage(activeConversationId, { id: crypto.randomUUID(), role: 'system', content: `Error: Please configure your API key for ${activeProviderId}.`, timestamp: Date.now() });
      return;
    }
    setIsLoading(true);
    abortControllerRef.current = new AbortController();
    
    if (userMsgObj.content.startsWith('/image ') && provider.id === 'openai') {
       try {
         const prompt = userMsgObj.content.replace('/image ', '');
         const res = await fetch(`https://api.openai.com/v1/images/generations`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${provider.apiKey}` },
            body: JSON.stringify({ model: 'dall-e-3', prompt, n: 1, size: '1024x1024' }),
            signal: abortControllerRef.current.signal
         });
         const data = await res.json();
         if (data.error) throw new Error(data.error.message);
         addMessage(activeConversationId, { id: crypto.randomUUID(), role: 'assistant', content: `![Generated Image](${data.data[0].url})`, timestamp: Date.now() });
       } catch (err: any) {
         if (err.name !== 'AbortError') addMessage(activeConversationId, { id: crypto.randomUUID(), role: 'system', content: `API Error: ${err.message}`, timestamp: Date.now() });
       } finally { setIsLoading(false); }
       return;
    }

    const history = currentChat?.messages || [];
    const allMsgs = [...history, userMsgObj].filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content }));
    const uniqueMsgs = allMsgs.filter((v,i,a)=>a.findIndex(t=>(t.content === v.content && t.role === v.role))===i);

    try {
      let aiContent = "";
      if (provider.id === 'openai') {
        const res = await fetch(`${provider.baseUrl}/chat/completions`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${provider.apiKey}` },
          body: JSON.stringify({ model: activeModel || 'gpt-4o', temperature: temperature, messages: [{ role: 'system', content: store.systemPrompt }, ...uniqueMsgs] }),
          signal: abortControllerRef.current.signal
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        aiContent = data.choices[0].message.content;
      } 
      else if (provider.id === 'anthropic') {
        const res = await fetch(`${provider.baseUrl}/messages`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': provider.apiKey, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
          body: JSON.stringify({ model: activeModel || 'claude-3-5-sonnet-20240620', max_tokens: 4096, temperature: temperature, system: store.systemPrompt, messages: uniqueMsgs }),
          signal: abortControllerRef.current.signal
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        aiContent = data.content[0].text;
      }
      addMessage(activeConversationId, { id: crypto.randomUUID(), role: 'assistant', content: aiContent, timestamp: Date.now() });
    } catch (err: any) {
      if (err.name !== 'AbortError') addMessage(activeConversationId, { id: crypto.randomUUID(), role: 'system', content: `API Error: ${err.message}`, timestamp: Date.now() });
      else addMessage(activeConversationId, { id: crypto.randomUUID(), role: 'system', content: `Generation stopped.`, timestamp: Date.now() });
    } finally { setIsLoading(false); }
  };

  const handleSend = () => {
    if (!draft.trim() || !activeConversationId || isLoading) return;
    const userContent = draft.trim();
    setDraft("");
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: userContent, timestamp: Date.now() };
    addMessage(activeConversationId, userMsg);
    fetchAIResponse(userMsg);
  };

  const handleRegenerate = (msgId: string) => {
    if (!activeConversationId) return;
    const msgIndex = messages.findIndex(m => m.id === msgId);
    if(msgIndex === -1) return;
    let userMsg = null;
    for(let i = msgIndex - 1; i >= 0; i--) if(messages[i].role === 'user') { userMsg = messages[i]; break; }
    deleteMessage(activeConversationId, msgId);
    if(userMsg) fetchAIResponse(userMsg);
  };

  const handleStop = () => { if (abortControllerRef.current) abortControllerRef.current.abort(); setIsLoading(false); };
  const exportChat = () => {
     if(!currentChat) return;
     const text = currentChat.messages.map(m => `${m.role.toUpperCase()} [${new Date(m.timestamp).toLocaleString()}]:\n${m.content}`).join('\n\n-------------------------\n\n');
     const blob = new Blob([text], { type: 'text/plain' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a'); a.href = url; a.download = `${currentChat.title}.txt`; a.click();
  };

  const QUICK_PROMPTS = ["Explain this code", "Find bugs", "Refactor", "Write unit tests"];
  const estimatedTokens = Math.round(draft.length / 4);
  const chatAreaClass = `flex flex-col h-full flex-1 border-[#2d323e] min-w-[300px] ${appearance.pageBackground === 'solid' ? 'bg-[#121318]' : 'custom-bg'}`;

  return (
    <div className={chatAreaClass}>
      <div className="custom-header h-12 flex items-center justify-between px-4 border-b border-[#2d323e] shrink-0">
        <div className="flex items-center gap-3">
          {!sidebarOpen && <PanelLeft size={16} onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-gray-200 cursor-pointer transition-colors" />}
          <MessageSquare size={14} className="text-[var(--color-accent)]" />
          <span className="text-[13px] font-medium text-gray-200 truncate max-w-[200px]">{currentChat?.title || "New Session"}</span>
        </div>
        
        <div className="flex items-center gap-4">
          {activeConversationId && (
            <div className="flex items-center gap-2 border-r border-[#2d323e] pr-4">
               <button onClick={exportChat} title="Export Chat" className="text-gray-500 hover:text-gray-200"><Download size={14} /></button>
               <button onClick={() => clearChatMessages(activeConversationId)} title="Clear Chat" className="text-gray-500 hover:text-rose-400"><Trash2 size={14} /></button>
            </div>
          )}
          <ModelSwitcher />
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto px-4 py-4 relative scroll-smooth mx-auto w-full`} style={{ maxWidth: appearance.chatWidth }}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
            <Bot size={48} className="mb-4" />
            <p className="text-[13px]">How can I help you today?</p>
            <div className="flex gap-2 mt-6 flex-wrap justify-center max-w-sm">
               {QUICK_PROMPTS.map(p => (
                 <button key={p} onClick={() => setDraft(p)} className="px-3 py-1.5 bg-[#1c1f26] ring-1 ring-[#2d323e] hover:ring-[var(--color-accent)] rounded-full text-[11px] transition-all custom-btn">{p}</button>
               ))}
            </div>
          </div>
        ) : (
          messages.map((entry) => (
            <ChatLogLine key={entry.id} entry={entry} onEdit={(id: string, c: string) => updateMessage(activeConversationId!, id, c)} onDelete={(id: string) => deleteMessage(activeConversationId!, id)} onRegenerate={handleRegenerate} codeFont={codeFont} prefs={appearance} />
          ))
        )}
        {isLoading && (
           <div className={`flex items-start gap-2 max-w-full animate-in fade-in slide-in-from-bottom-2 ${appearance.messageAlignment === 'center' ? 'justify-center' : ''}`}>
            {appearance.avatarVisibility && (
              <div className="w-6 h-6 rounded-[6px] bg-[#1c1f26] ring-1 ring-[#2d323e] flex items-center justify-center shrink-0 mt-0.5 custom-item">
                <Bot size={12} className="text-[var(--color-accent)] animate-pulse" />
              </div>
            )}
            <div className="custom-bubble-ai flex flex-col gap-2 text-[13px] px-4 py-3 text-gray-400">
              <div className="flex items-center gap-2">
                 Thinking... 
                 <button onClick={handleStop} className="ml-2 flex items-center gap-1 text-[10px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-[4px] hover:bg-rose-500/20 transition-colors custom-btn"><StopCircle size={10} /> Stop</button>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className={`p-3 shrink-0 ${appearance.inputStyle === 'docked' ? 'border-t border-[#2d323e] bg-[#121318]' : 'bg-transparent pb-6'}`}>
        <div className="mx-auto w-full" style={{ maxWidth: appearance.chatWidth }}>
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {draft === '' && QUICK_PROMPTS.slice(0,3).map(p => (
                  <button key={p} onClick={() => setDraft(p + ":\n")} className="text-[10px] text-gray-500 hover:text-gray-300 bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-full transition-colors whitespace-nowrap custom-btn">{p}</button>
              ))}
            </div>
            <div className="text-[10px] text-gray-600 shrink-0">~{estimatedTokens} tokens</div>
          </div>

          <div className="flex items-end gap-2 bg-[#1c1f26] rounded-[8px] ring-1 ring-[#2d323e] focus-within:ring-[var(--color-accent)]/50 transition-all p-2 custom-input-container">
            <div className="flex flex-col gap-1 shrink-0">
              <button onClick={() => setDraft(prev => prev + ' /image ')} className="w-8 h-8 rounded-[8px] flex items-center justify-center hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-all custom-btn" title="Generate Image"><Sparkles size={14} /></button>
            </div>
            <textarea
              rows={Math.min(5, draft.split('\n').length || 1)} 
              value={draft} onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Ask mikoO anything (use /image to generate pics)..." disabled={isLoading}
              className="flex-1 bg-transparent resize-none outline-none text-[13px] text-gray-200 placeholder:text-gray-600 px-2 py-1.5 max-h-32 disabled:opacity-50"
            />
            <button onClick={handleSend} disabled={!draft.trim() || isLoading} className={'shrink-0 w-8 h-8 rounded-[8px] flex items-center justify-center transition-all mb-0.5 custom-btn ' + (draft.trim() && !isLoading ? "bg-[var(--color-accent)] hover:opacity-90 text-white shadow-[0_0_10px_var(--color-accent)]" : "bg-[#2d323e] text-gray-600")}>
              {isLoading ? <Loader2 size={14} className="animate-spin text-gray-400" /> : <Send size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TerminalColumn() {
  const { agentLogs } = useStore();
  return (
    <div className="flex flex-col h-full w-[350px] shrink-0 bg-[#121318] border-l border-[#2d323e]">
      <div className="custom-header h-12 flex items-center border-b border-[#2d323e] shrink-0 px-2 gap-1">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12.5px] font-medium bg-[#1c1f26] text-gray-100 ring-1 ring-[#2d323e]">
          <TerminalSquare size={13} /> Agent Logs
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 bg-[#0e0f13] custom-bg">
          {agentLogs.length === 0 ? <div className="text-[11px] text-gray-600 italic">No agent actions recorded yet...</div> : agentLogs.map((log) => (
              <div key={log.id} className={'whitespace-pre font-mono text-[11px] leading-[1.6] ' + (log.type === 'error' ? 'text-rose-400' : log.type === 'success' ? 'text-emerald-400' : 'text-gray-400')}>
                <span className="opacity-50">[{new Date(log.timestamp).toLocaleTimeString()}]</span> {log.message}
              </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Settings view ------------------------------ */

function SettingSelect({ label, value, options, onChange }: any) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#2d323e] last:border-0">
      <div className="text-[12.5px] font-medium text-gray-200">{label}</div>
      <select value={value} onChange={e => onChange(e.target.value)} className="bg-[#121318] ring-1 ring-[#2d323e] rounded-[4px] px-2 py-1 text-[11.5px] text-gray-300 outline-none hover:ring-[#4b5563] custom-input">
         {options.map((o:any) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
function SettingToggle({ label, checked, onChange }: any) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#2d323e] last:border-0">
      <div className="text-[12.5px] font-medium text-gray-200">{label}</div>
      <button onClick={() => onChange(!checked)} className={'relative inline-flex h-4 w-7 shrink-0 items-center rounded-full px-[2px] transition-colors ' + (checked ? 'bg-[var(--color-accent)]' : 'bg-gray-600')}>
        <span className={'inline-block h-3 w-3 transform rounded-full bg-white transition ' + (checked ? 'translate-x-3' : 'translate-x-0')} />
      </button>
    </div>
  );
}

const SETTINGS_TABS = [
  { id: 'colors', label: 'Colors & Theme', icon: Sun },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'layout', label: 'Layout & Space', icon: Layout },
  { id: 'shapes', label: 'Shapes & FX', icon: Square },
  { id: 'api', label: 'API & Config', icon: KeyRound }
];

function SettingsView() {
  const store = useStore();
  const { setAppearance, appearance, providers, updateProvider } = store;
  const [activeTab, setActiveTab] = useState('colors');
  const ACCENTS = [ { id: "blue", color: "#3b82f6" }, { id: "purple", color: "#a855f7" }, { id: "emerald", color: "#10b981" }, { id: "rose", color: "#ec4899" }, { id: "amber", color: "#f59e0b" }, { id: "cyan", color: "#06b6d4" } ];

  return (
    <div className="flex-1 flex min-h-0 bg-transparent">
      <div className="w-[200px] shrink-0 bg-[#121318] border-r border-[#2d323e] flex flex-col custom-sidebar">
        <div className="p-4 border-b border-[#2d323e] shrink-0 custom-header"><h2 className="text-[16px] font-bold text-gray-100">Settings</h2></div>
        <div className="flex-1 overflow-y-auto py-2">
          {SETTINGS_TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`w-full flex items-center gap-3 px-4 py-2.5 text-[12.5px] transition-colors ${activeTab === t.id ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-medium border-l-2 border-[var(--color-accent)]' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04] border-l-2 border-transparent'}`}>
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-8 custom-bg">
        <div className="max-w-xl">
          {activeTab === 'colors' && (
            <div className="animate-in fade-in space-y-6">
              <h3 className="text-[16px] font-semibold text-[var(--color-accent)] border-b border-[#2d323e] pb-2">Colors & Theme</h3>
              <div>
                <div className="text-[13px] text-gray-400 mb-2">Base Theme</div>
                <div className="flex gap-2">
                  <button onClick={() => setAppearance("theme", "light")} className={'px-4 py-2 rounded-[6px] ring-1 text-[12px] flex-1 ' + (appearance.theme === 'light' ? 'bg-[var(--color-accent)]/20 ring-[var(--color-accent)] text-[var(--color-accent)]' : 'ring-[#2d323e] text-gray-400')}>Light</button>
                  <button onClick={() => setAppearance("theme", "dark")} className={'px-4 py-2 rounded-[6px] ring-1 text-[12px] flex-1 ' + (appearance.theme === 'dark' ? 'bg-[var(--color-accent)]/20 ring-[var(--color-accent)] text-[var(--color-accent)]' : 'ring-[#2d323e] text-gray-400')}>Dark</button>
                </div>
              </div>
              <div>
                <div className="text-[13px] text-gray-400 mb-2">Accent Color</div>
                <div className="flex gap-4">
                  {ACCENTS.map((a) => <button key={a.id} onClick={() => setAppearance("accentColor", a.id)} style={{ backgroundColor: a.color }} className={'w-8 h-8 rounded-full ring-2 transition-all ' + (appearance.accentColor === a.id ? "ring-white scale-110 shadow-lg" : "ring-transparent hover:scale-105")} />)}
                </div>
              </div>
              <SettingSelect label="Sidebar Background" value={appearance.sidebarTheme} onChange={(v:string) => setAppearance('sidebarTheme', v)} options={[{label:'Default',value:'default'},{label:'Darker',value:'darker'},{label:'Pitch Black',value:'black'}]} />
              <SettingSelect label="Page Background" value={appearance.pageBackground} onChange={(v:string) => setAppearance('pageBackground', v)} options={[{label:'Solid Colors',value:'solid'},{label:'Dotted Matrix',value:'dots'},{label:'Blueprint Grid',value:'grid'}]} />
              <SettingSelect label="Code Block Theme" value={appearance.codeBlockTheme} onChange={(v:string) => setAppearance('codeBlockTheme', v)} options={[{label:'Default Dark',value:'default'},{label:'Matrix Green',value:'matrix'},{label:'Hacker Red',value:'hacker'}]} />
              <SettingSelect label="Color Vibrancy" value={appearance.colorVibrancy} onChange={(v:string) => setAppearance('colorVibrancy', v)} options={[{label:'Muted / Soft',value:'muted'},{label:'Standard',value:'standard'},{label:'Vibrant Neon',value:'vibrant'}]} />
            </div>
          )}
          {activeTab === 'typography' && (
            <div className="animate-in fade-in space-y-6">
              <h3 className="text-[16px] font-semibold text-[var(--color-accent)] border-b border-[#2d323e] pb-2">Typography Settings</h3>
              <SettingSelect label="App Font Family" value={appearance.appFont} onChange={(v:string) => setAppearance('appFont', v)} options={[{label:'System UI',value:'system-ui'},{label:'Inter (Sans)',value:'Inter, sans-serif'},{label:'Roboto',value:'Roboto, sans-serif'},{label:'Monospace',value:'monospace'}]} />
              <SettingSelect label="Global Font Size" value={appearance.fontSize} onChange={(v:string) => setAppearance('fontSize', v)} options={[{label:'Small',value:'11px'},{label:'Medium',value:'13px'},{label:'Large',value:'15px'},{label:'Extra Large',value:'17px'}]} />
              <SettingSelect label="Line Height" value={appearance.lineHeight} onChange={(v:string) => setAppearance('lineHeight', v)} options={[{label:'Tight (1.2)',value:'1.2'},{label:'Normal (1.5)',value:'1.5'},{label:'Relaxed (1.8)',value:'1.8'}]} />
              <SettingSelect label="Icon Weight (Thickness)" value={appearance.iconWeight} onChange={(v:string) => setAppearance('iconWeight', v)} options={[{label:'Light',value:'1'},{label:'Regular',value:'2'},{label:'Bold',value:'3'}]} />
            </div>
          )}
          {activeTab === 'layout' && (
            <div className="animate-in fade-in space-y-6">
              <h3 className="text-[16px] font-semibold text-[var(--color-accent)] border-b border-[#2d323e] pb-2">Layout & Spacing</h3>
              <SettingSelect label="Sidebar Position" value={appearance.sidebarPosition} onChange={(v:string) => setAppearance('sidebarPosition', v)} options={[{label:'Left side',value:'left'},{label:'Right side',value:'right'}]} />
              <SettingSelect label="Chat Max Width" value={appearance.chatWidth} onChange={(v:string) => setAppearance('chatWidth', v)} options={[{label:'Narrow',value:'600px'},{label:'Standard',value:'800px'},{label:'Wide',value:'1000px'},{label:'Full Width',value:'100%'}]} />
              <SettingSelect label="Input Bar Style" value={appearance.inputStyle} onChange={(v:string) => setAppearance('inputStyle', v)} options={[{label:'Docked to bottom',value:'docked'},{label:'Floating Bubble',value:'floating'}]} />
              <SettingSelect label="Message Alignment" value={appearance.messageAlignment} onChange={(v:string) => setAppearance('messageAlignment', v)} options={[{label:'Standard (Left/Right)',value:'left'},{label:'Centered',value:'center'}]} />
              <SettingSelect label="Message Spacing" value={appearance.messageSpacing} onChange={(v:string) => setAppearance('messageSpacing', v)} options={[{label:'Compact',value:'8px'},{label:'Normal',value:'16px'},{label:'Relaxed',value:'32px'}]} />
              <SettingToggle label="Compact UI Paddings" checked={appearance.compactMode} onChange={(v:boolean) => setAppearance('compactMode', v)} />
              <SettingSelect label="Avatar Visibility" value={appearance.avatarVisibility?"true":"false"} onChange={(v:string) => setAppearance('avatarVisibility', v==="true")} options={[{label:'Show Avatars',value:'true'},{label:'Hide Avatars',value:'false'}]} />
              <SettingSelect label="Timestamps" value={appearance.timestampVisibility} onChange={(v:string) => setAppearance('timestampVisibility', v)} options={[{label:'Always Show',value:'always'},{label:'Show on Hover',value:'hover'},{label:'Hidden',value:'hidden'}]} />
              <SettingSelect label="Scrollbar Style" value={appearance.scrollbarStyle} onChange={(v:string) => setAppearance('scrollbarStyle', v)} options={[{label:'OS Default',value:'default'},{label:'Minimal Hidden',value:'hidden'}]} />
            </div>
          )}
          {activeTab === 'shapes' && (
            <div className="animate-in fade-in space-y-6">
              <h3 className="text-[16px] font-semibold text-[var(--color-accent)] border-b border-[#2d323e] pb-2">Shapes & Effects</h3>
              <SettingSelect label="Border Radius" value={appearance.borderRadius} onChange={(v:string) => setAppearance('borderRadius', v)} options={[{label:'Sharp (0px)',value:'0px'},{label:'Rounded (8px)',value:'8px'},{label:'Very Rounded (16px)',value:'16px'},{label:'Pill (99px)',value:'9999px'}]} />
              <SettingSelect label="Chat Bubble Style" value={appearance.bubbleStyle} onChange={(v:string) => setAppearance('bubbleStyle', v)} options={[{label:'Solid Filled',value:'solid'},{label:'Outlined',value:'outline'},{label:'Ghost Transparent',value:'ghost'}]} />
              <SettingSelect label="Button Style" value={appearance.buttonStyle} onChange={(v:string) => setAppearance('buttonStyle', v)} options={[{label:'Flat',value:'flat'},{label:'Neumorphic',value:'neumorphic'},{label:'Ghost',value:'ghost'}]} />
              <SettingToggle label="Glassmorphism (Blur Effects)" checked={appearance.glassmorphism} onChange={(v:boolean) => setAppearance('glassmorphism', v)} />
              <SettingToggle label="Neon Glow on Accents" checked={appearance.neonGlow} onChange={(v:boolean) => setAppearance('neonGlow', v)} />
              <SettingSelect label="Shadow Intensity" value={appearance.shadowIntensity} onChange={(v:string) => setAppearance('shadowIntensity', v)} options={[{label:'None',value:'none'},{label:'Light',value:'light'},{label:'Heavy',value:'heavy'}]} />
              <SettingSelect label="Animation Speed" value={appearance.animationSpeed} onChange={(v:string) => setAppearance('animationSpeed', v)} options={[{label:'Instant (None)',value:'0s'},{label:'Fast',value:'0.1s'},{label:'Normal',value:'0.2s'},{label:'Slow',value:'0.5s'}]} />
            </div>
          )}
          {activeTab === 'api' && (
            <div className="animate-in fade-in space-y-6">
              <h3 className="text-[16px] font-semibold text-[var(--color-accent)] border-b border-[#2d323e] pb-2">API Config</h3>
              {providers.map((p: any) => (
                <div key={p.id} className="flex gap-2 mb-2">
                  <div className="w-24 text-[12px] pt-1">{p.name}</div>
                  <input type="password" value={p.apiKey} onChange={(e) => updateProvider(p.id, { apiKey: e.target.value })} className="flex-1 bg-[#121318] ring-1 ring-[#2d323e] px-2 py-1 text-[12px] rounded" placeholder="API Key..." />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { currentView, appearance } = useStore();
  
  useEffect(() => {
    if (appearance.theme === 'light') document.documentElement.classList.remove('dark');
    else document.documentElement.classList.add('dark');
  }, [appearance.theme]);

  const colors: any = { blue: '#3b82f6', purple: '#a855f7', emerald: '#10b981', rose: '#ec4899', amber: '#f59e0b', cyan: '#06b6d4' };
  const getVibrant = (hex: string, v: string) => { if(v==='muted') return hex+'cc'; if(v==='vibrant') return hex; return hex; }
  
  // Generating MEGA dynamic CSS inject!
  const cssInject = `
    :root {
       --app-font: ${appearance.appFont};
       --app-size: ${appearance.fontSize};
       --app-lh: ${appearance.lineHeight};
       --app-radius: ${appearance.borderRadius};
       --color-accent: ${getVibrant(colors[appearance.accentColor] || '#ec4899', appearance.colorVibrancy)};
       --icon-stroke: ${appearance.iconWeight};
       --anim-speed: ${appearance.animationSpeed};
       --msg-spacing: ${appearance.messageSpacing};
    }
    
    * {
       font-family: var(--app-font) !important;
       font-size: var(--app-size);
       line-height: var(--app-lh);
       transition-duration: var(--anim-speed) !important;
    }

    svg { stroke-width: var(--icon-stroke) !important; }

    /* Shapes & Radius */
    .rounded-\\[4px\\], .rounded-\\[6px\\], .rounded-\\[8px\\], .rounded-\\[10px\\] {
       border-radius: var(--app-radius) !important;
    }

    /* Layout */
    .app-layout { flex-direction: ${appearance.sidebarPosition === 'right' ? 'row-reverse' : 'row'} !important; }
    
    /* Bubbles */
    .custom-bubble-user {
       background: ${appearance.bubbleStyle === 'outline' ? 'transparent' : appearance.bubbleStyle === 'ghost' ? 'rgba(255,255,255,0.05)' : 'var(--color-accent)'};
       border: ${appearance.bubbleStyle === 'outline' ? '1px solid var(--color-accent)' : 'none'};
       color: ${appearance.bubbleStyle === 'outline' || appearance.bubbleStyle === 'ghost' ? 'var(--color-accent)' : 'white'};
    }
    .custom-bubble-ai {
       background: ${appearance.bubbleStyle === 'outline' ? 'transparent' : appearance.bubbleStyle === 'ghost' ? 'transparent' : '#1c1f26'};
       border: ${appearance.bubbleStyle === 'outline' ? '1px solid #2d323e' : 'none'};
       border-radius: var(--app-radius);
    }
    
    /* Effects */
    ${appearance.glassmorphism ? `
       .custom-header, .custom-sidebar { background: rgba(18,19,24,0.6) !important; backdrop-filter: blur(12px) !important; }
       .custom-input-container { background: rgba(28,31,38,0.6) !important; backdrop-filter: blur(12px) !important; }
    ` : ''}

    ${appearance.neonGlow ? `
       .custom-btn:hover { box-shadow: 0 0 15px var(--color-accent) !important; }
       .custom-bubble-user { box-shadow: 0 4px 20px var(--color-accent) !important; }
    ` : ''}

    ${appearance.shadowIntensity !== 'none' ? `
       .custom-bubble-wrap { box-shadow: 0 ${appearance.shadowIntensity === 'heavy' ? '10px 30px' : '4px 10px'} rgba(0,0,0,0.3); }
       .custom-sidebar { box-shadow: ${appearance.sidebarPosition === 'left' ? '5px' : '-5px'} 0 20px rgba(0,0,0,0.5); z-index: 10; }
    ` : ''}

    /* Input Floating */
    ${appearance.inputStyle === 'floating' ? `
       .custom-input-container { margin: 16px auto; border-radius: 24px !important; box-shadow: 0 10px 30px rgba(0,0,0,0.5); max-width: 800px; }
    ` : ''}

    /* Scrollbars */
    ${appearance.scrollbarStyle === 'hidden' ? `
       ::-webkit-scrollbar { width: 0 !important; height: 0 !important; }
    ` : ''}

    /* Page BG */
    ${appearance.pageBackground === 'dots' ? `
       .custom-bg { background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 20px 20px; }
    ` : appearance.pageBackground === 'grid' ? `
       .custom-bg { background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 20px 20px; }
    ` : ''}

    /* Code Block Themes */
    ${appearance.codeBlockTheme === 'matrix' ? `
       .custom-code { border-color: #0f0 !important; }
       .custom-code-header { background: #002200 !important; border-color: #0f0 !important; color: #0f0 !important; }
       .custom-code-inline { color: #0f0 !important; background: #002200 !important; }
    ` : appearance.codeBlockTheme === 'hacker' ? `
       .custom-code { border-color: #f00 !important; }
       .custom-code-header { background: #220000 !important; border-color: #f00 !important; color: #f00 !important; }
       .custom-code-inline { color: #f00 !important; background: #220000 !important; }
    ` : ''}
  `;

  return (
    <div className="w-full h-screen flex bg-[#121318] text-gray-200 font-sans antialiased overflow-hidden app-layout">
      <style>{cssInject}</style>
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-0 relative z-0">
        {currentView === 'home' && (
          <div className="flex-1 flex min-h-0">
             <ChatColumn />
             <TerminalColumn />
          </div>
        )}
        {currentView === 'history' && <HistoryView />}
        {currentView === 'scheduled' && <ScheduledView />}
        {currentView === 'settings' && <SettingsView />}
      </main>
    </div>
  );
}
