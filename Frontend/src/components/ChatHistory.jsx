'use client';

import { X, History as HistoryIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedList from "./AnimatedList";
import { useEffect, useState } from 'react';
import { supabase } from "../lib/supabase"; 

export function ChatHistory({ onClose, onSelectChat, onDeleteChat, title = "Chat History", filter = "all" }) {
  const [items, setItems] = useState([]);

  // Load chat history from Supabase
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        let user = null;
        if (token) {
          const { data, error } = await supabase.auth.getUser(token);
          if (!error && data?.user) user = data.user;
        }
        if (!user) return;

        let query = supabase
          .from('chats')
          .select('id, title, updated_at, messages')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        // "Recent" view only shows the 5 most recent chats
        if (filter === 'recent') {
          query = query.limit(5);
        }

        const { data, error } = await query;

        if (error) throw error;
        setItems(data.map(chat => ({
          id: chat.id,
          title: chat.title,
          messages: chat.messages, // Store messages directly
          lastActive: new Date(chat.updated_at).getTime()
        })));
      } catch (error) {
        console.error('Failed to load chat history from Supabase:', error);
        setItems([]);
      }
    };
    fetchHistory();
  }, [filter]);

  const handleDeleteChat = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      let user = null;
      if (token) {
        const { data, error } = await supabase.auth.getUser(token);
        if (!error && data?.user) user = data.user;
      }
      if (!user) return;

      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setItems((prev) => prev.filter((item) => item.id !== id));
      onDeleteChat?.(id);
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  // Function to calculate time ago from timestamp
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `${diffDays}d`;
    } else if (diffHours > 0) {
      return `${diffHours}h`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-transparent animate-in fade-in duration-200">
      <Card className="mx-auto w-full max-w-xl overflow-hidden border border-white/10 bg-transparent text-white shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200">
        <CardHeader className="flex flex-row items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <HistoryIcon className="size-5 text-zinc-400" />
            <CardTitle className="text-lg font-bold">{title}</CardTitle>
          </div>
          <Button variant="ghost" className="p-2 text-zinc-400 hover:text-white hover:bg-white/10" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </CardHeader>

        <div className="flex justify-center p-4">
          {items.length === 0 ? (
            <div className="text-center text-zinc-400 py-8">
              <p>No chat history yet</p>
              <p className="text-xs mt-2">Start a conversation to see it here</p>
            </div>
          ) : (
            <AnimatedList
              items={items.map(item => ({
                id: item.id,
                title: item.title,
                description: '',
                meta: getTimeAgo(item.lastActive)
              }))}
              onItemSelect={(item, index) => {
                onSelectChat?.(items[index].messages, items[index].id);
                onClose?.();
              }}
              renderItem={(item) => (
                <div className="flex items-center justify-between w-full min-w-0">
                  <span className="flex min-w-0 flex-1 flex-col gap-[2px] pr-2">
                    <span className="overflow-hidden text-[14.5px] leading-[1.3] font-semibold tracking-[-0.01em] text-ellipsis whitespace-nowrap text-zinc-100">
                      {item.title}
                    </span>
                  </span>
                  <div className="flex items-center gap-3 flex-none relative z-10">
                    {item.meta && (
                      <span className="text-[12px] tabular-nums text-zinc-400">
                        {item.meta}
                      </span>
                    )}
                    <button
                      type="button"
                      title="Delete chat"
                      onClick={(e) => handleDeleteChat(item.id, e)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/15 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              )}
              animation="pop"
              theme="dark"
              width={420}
              maxHeight={440}
              radius={14}
              gap={8}
              stagger={0.05}
              fadeSize={56}
              frame
              showGradients
              displayScrollbar
              selectOnHover
              enableArrowNavigation
              loop={false}
              animateOnce={false}
              initialSelectedIndex={-1}
            />
          )}
        </div>
      </Card>
    </div>
  );
}

// Function to save chat to Supabase
export const saveChatToHistory = async (messages, title, chatId = null) => {
  try {
    const token = localStorage.getItem("token");
    let user = null;
    if (token) {
      const { data, error } = await supabase.auth.getUser(token);
      if (!error && data?.user) user = data.user;
    }
    if (!user) return null; // Only save if user is logged in
    
    // Generate summary if not provided
    const chatTitle = title || generateChatSummary(messages);
    
    const payload = {
      user_id: user.id,
      title: chatTitle,
      messages: messages,
      updated_at: new Date().toISOString()
    };

    if (chatId) {
      payload.id = chatId;
    }

    // Save/Upsert chat to Supabase 'chats' table
    const { data, error } = await supabase
      .from('chats')
      .upsert(payload, { onConflict: 'id' })
      .select('id')
      .single();
      
    if (error) throw error;
    return data?.id || chatId;
  } catch (error) {
    console.error('Failed to save chat history to Supabase:', error);
    return null;
  }
};

// Helper function to generate chat summary (exported for use in Chat component)
const generateChatSummary = (messages) => {
  if (!messages || messages.length === 0) return 'New Chat';
  
  // Get the first user message as the basis for summary
  const firstUserMessage = messages.find(msg => msg.role === 'user');
  if (!firstUserMessage) return 'New Chat';
  
  const text = firstUserMessage.content;
  
  // Simple summary: take first few words or key phrases
  const words = text.split(/\s+/).slice(0, 6); // First 6 words
  const summary = words.join(' ');
  
  // Add ellipsis if text was longer
  if (text.split(/\s+/).length > 6) {
    return summary.trim() + '...';
  }
  
  return summary.trim() || 'New Chat';
};

export default ChatHistory;

