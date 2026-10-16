import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { BorderBeam } from "./ui/border-beam";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Message, MessageContent } from "@/components/ui/message";
import { Attachment01Icon, Globe02Icon } from '@hugeicons/core-free-icons';
import { Upload, FileText, Loader2, X } from "lucide-react";
import PromptBar from "./PromptBar";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { SidebarDemo } from "./SidebarDemo";
import LightRays from "./LightRays";
import { ChatDashboard } from "./ChatDashboard";
import { ChatHistory, saveChatToHistory } from "./ChatHistory";
import Nave from "./nave";

// Dev: Vite proxies /api -> backend. Production (Vercel): set VITE_API_URL to the backend URL.
const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

// The backend /chat route requires a Bearer token (get_current_user).
function getAccessToken() {
  try {
    for (const key of ['access_token', 'token', 'accessToken']) {
      const v = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (v) return v.replace(/^"|"$/g, '');
    }
    // supabase-js session: sb-<project>-auth-token
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('sb-') && k.endsWith('-auth-token')) {
        const parsed = JSON.parse(localStorage.getItem(k));
        const t = parsed?.access_token || parsed?.currentSession?.access_token;
        if (t) return t;
      }
    }
  } catch (e) {
    console.error('Could not read access token', e);
  }
  return null;
}

function authHeaders() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function SidebarEdgeHotzone() {
  const { open, setOpen } = useSidebar();

  if (open) return null;

  return (
    <div
      className="fixed top-0 left-0 h-svh w-5 z-40"
      onMouseEnter={() => setOpen(true)}
      aria-hidden="true"
    />
  );
}

function ChatNav() {
  const { open } = useSidebar();

  return (
    <div className={open ? "hidden" : ""}>
      <Nave activeIndex={1} showLogo={false} showCta={false} />
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
      const [attachedFiles, setAttachedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyTitle, setHistoryTitle] = useState("Chat History");
  const [historyFilter, setHistoryFilter] = useState("all");
  const controller = useRef(null);

  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setAttachedFiles(selectedFiles);
    // reset so picking the same file again still fires onChange
    event.target.value = "";
  };

  const removeAttachedFile = (index) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const generateReply = async (msgText, signal) => {
    const formData = new FormData();
    formData.append('prompt', msgText);
    if (chatId) {
      formData.append('chat_id', chatId);
    }
    attachedFiles.forEach((file) => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: authHeaders(),
      body: formData,
      signal
    });
    if (response.status === 401) throw new Error('auth');
    if (!response.ok) throw new Error('Snarly could not reach the server.');
    const data = await response.json();
    setAttachedFiles([]);
    return data.answer;
  };

  const send = async (text, { attachments, model, effort } = {}) => {
    const msgText = typeof text === 'string' ? text : text?.text || "";
    if (!msgText.trim()) return;

    setBusy(true);
    controller.current = new AbortController();

    const userMessage = { role: "user", content: msgText, id: Date.now().toString() };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const reply = await generateReply(msgText, controller.current.signal);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, id: Date.now().toString() + "1" }
      ]);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: err.message === 'auth'
              ? "Your session has expired. Please log in again."
              : "Sorry, something went wrong reaching Snarly. Please try again.",
            id: Date.now().toString() + "err"
          }
        ]);
      }
    } finally {
      setBusy(false);
    }
  };

  // Save chat history when messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatToHistory(messages, null, chatId).then(id => {
        if (id && !chatId) {
          setChatId(id);
        }
      }).catch(err => console.error("Error saving chat:", err));
    }
  }, [messages]);

  return (
    <>
      {showHistory && (
        <ChatHistory 
          title={historyTitle}
          filter={historyFilter}
          onClose={() => setShowHistory(false)}
          onSelectChat={(selectedMessages, selectedChatId) => {
            if (selectedMessages && selectedMessages.length > 0) {
              setMessages(selectedMessages);
              setChatId(selectedChatId);
            }
            setShowHistory(false);
          }}
        />
      )}
      <SidebarProvider className="dark" defaultOpen={false}>
      <div className="flex h-screen w-full bg-black text-zinc-100 font-sans overflow-hidden">
        <SidebarDemo onToggleDashboard={() => setShowDashboard(!showDashboard)} onToggleHistory={() => { setHistoryTitle("Chat History"); setHistoryFilter("all"); setShowHistory(!showHistory); }} onToggleRecent={() => { setHistoryTitle("Recent"); setHistoryFilter("recent"); setShowHistory(!showHistory); }} onNewChat={() => { setMessages([]); setChatId(null); }} />
        <SidebarEdgeHotzone />
        <main className="flex-1 flex flex-col bg-black relative min-w-0">
          <ChatNav />
          <SidebarTrigger className="absolute top-6 right-4 z-50 text-white border border-gray-300 hover:bg-zinc-800" />

          {showDashboard && (
            <div className="absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-20 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
              <ChatDashboard onClose={() => setShowDashboard(false)} />
            </div>
          )}

          <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.45 }}>
            <LightRays
              raysOrigin="top-center"
              raysColor="#ffffff"
              raysSpeed={1}
              lightSpread={0.5}
              rayLength={3}
              followMouse={true}
              mouseInfluence={0.1}
              noiseAmount={0}
              distortion={0}
              pulsating={false}
              fadeDistance={1}
              saturation={1}
            />
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar p-3 sm:p-8 pt-20 sm:pt-24 pb-36 space-y-4 sm:space-y-6 relative z-[1] max-w-3xl mx-auto w-full">
            {messages.map((msg) => (
              <Message key={msg.id} align={msg.role === 'user' ? "end" : "start"}>
                <MessageContent className={msg.role === 'user' ? "items-end" : "items-start"}>
                  <Bubble variant="ghost">
                    {/* The "ghost" variant forces p-0 / rounded-none / transparent bg on the
                        content, so these use Tailwind's important suffix (!) to win. */}
                    <BubbleContent
                      className={cn(
                        "rounded-2xl! px-3.5! py-2.5! border! border-white/20!",
                        "backdrop-blur-xl! backdrop-saturate-150!",
                        "bg-linear-to-br! from-white/20! via-white/5! to-white/10!",
                        "shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.25)]!",
                        "bg-white/5! max-w-[85vw] sm:max-w-[34rem] text-white text-left whitespace-pre-wrap [overflow-wrap:anywhere]"
                      )}
                    >
                      {msg.content}
                    </BubbleContent>
                  </Bubble>
                </MessageContent>
              </Message>
            ))}
            {busy && (
              <div className="flex items-center justify-center gap-2 text-zinc-500 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs italic">Snarly is thinking...</span>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          {attachedFiles.length > 0 && (
            <div className="absolute bottom-32 sm:bottom-[11.5rem] left-0 right-0 z-[2] flex justify-center pointer-events-none">
              <div className="w-full max-w-xl sm:max-w-2xl px-3 sm:px-8 flex flex-wrap gap-2 pointer-events-auto">
                {attachedFiles.map((file, i) => (
                  <div
                    key={`${file.name}-${i}`}
                    className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl px-3 py-1.5 text-xs text-white"
                  >
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="max-w-[10rem] truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachedFile(i)}
                      className="text-zinc-300 hover:text-white"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <PromptArea
            busy={busy}
            onSend={send}
            onStop={() => controller.current?.abort()}
            onAttach={handleAttach}
          />
          <BorderBeam duration={12} size={150} />
        </main>
      </div>
    </SidebarProvider>
    </>
  );
}

function PromptArea({ busy, onSend, onStop, onAttach }) {
  return (
    <div className="absolute bottom-3 sm:bottom-15 left-0 right-0 z-[2] flex justify-center bg-transparent pointer-events-none">
      <div className="w-full max-w-xl sm:max-w-2xl px-3 sm:px-8 pointer-events-auto">
        <PromptBar
          placeholder="Ask anything about your documents"
          sources={[
            { key: 'files', name: 'Photos & files', description: 'Upload from this device', icon: Attachment01Icon, attach: true },
            { key: 'web', name: 'Web search', description: 'Live results', icon: Globe02Icon }
          ]}
          commands={[{ key: 'summarize', name: '/summarize', description: 'Digest the thread so far' }]}
          models={[
            { key: 'nova-3', name: 'Nova 3', tag: 'Flagship' },
            { key: 'nova-mini', name: 'Nova Mini', tag: 'Fast' }
          ]}
          efforts={['Low', 'Medium', 'High', 'Extra', 'Max']}
          busy={busy}
          onSend={onSend}
          onStop={onStop}
          onAttach={onAttach}
          onDictate={() => {}}
          background="rgba(24, 24, 27, 0.2)"
          color="#f5f5f5"
          menuBackground="rgba(39, 39, 42, 0.8)"
          sparkColor="#10b981"
          sparkBoost={1}
          width={560}
          radius={16}
          maxRows={5}
          morphDuration={240}
          squash={0.12}
          tilt={8}
          pressScale={0.96}
        />
      </div>
    </div>
  );
}