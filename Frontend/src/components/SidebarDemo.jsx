import React, { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  HomeLine,
  BarChartSquare02,
  Rows01,
  Folder,
  Settings01,
  User01,
  LogOut01,
  ChevronDown,
  Wallet01,
} from "@untitledui/icons";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export function SidebarDemo({ onToggleDashboard, onToggleHistory, onToggleRecent, onNewChat = () => {} }) {
  const [foldersOpen, setFoldersOpen] = useState(true);
  const [chatCount, setChatCount] = useState(0);
  const { state } = useSidebar();
  const sidebarCollapsed = state === "collapsed";

  // Fetch the signed-in user's saved chat count for the Folders badges
  useEffect(() => {
    const fetchChatCount = async () => {
      try {
        const token = localStorage.getItem("token");
        let user = null;
        if (token) {
          const { data, error } = await supabase.auth.getUser(token);
          if (!error && data?.user) user = data.user;
        }
        if (!user) return;

        const { count, error } = await supabase
          .from('chats')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (error) throw error;
        setChatCount(count || 0);
      } catch (err) {
        console.error("Error fetching chat counts:", err);
      }
    };
    fetchChatCount();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Supabase signOut failed:", e);
    }
    // Clear all locally stored auth artifacts
    ["token", "access_token", "accessToken"].forEach(k => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith("sb-") && k.endsWith("-auth-token")) {
        localStorage.removeItem(k);
      }
    }
    sessionStorage.clear();
    // Full reload to reset all app state and land on the home page
    window.location.href = "/";
  };

  return (
    <Sidebar
      collapsible="icon"
      className="bg-black/95 sm:bg-transparent border-r-0 text-white"
    >
      <SidebarHeader className="bg-transparent px-4 py-4">
        <a
          href="/"
          className="flex items-center gap-3 overflow-hidden rounded-md transition-colors hover:opacity-80"
        >
          <img
            src="/logo.png"
            alt="Snarly Logo"
            className="h-8 w-8 shrink-0 object-contain brightness-0 invert"
          />
          <span className="font-bold text-lg text-white group-data-[collapsible=icon]:hidden whitespace-nowrap">
            Snarly AI
          </span>
        </a>
      </SidebarHeader>

      <SidebarContent className="bg-transparent px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onNewChat}
                  tooltip="New Chat"
                  className="text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
                >
                  <Plus className="h-5 w-5 shrink-0" />
                  <span>New Chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Home"
                  render={<a href="/" />}
                  className="text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
                >
                  <HomeLine className="h-5 w-5 shrink-0" />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Dashboard"
                  onClick={onToggleDashboard}
                  className="text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
                >
                  <BarChartSquare02 className="h-5 w-5 shrink-0" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Projects"
                  render={<a href="/projects" />}
                  className="text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
                >
                  <Rows01 className="h-5 w-5 shrink-0" />
                  <span>Projects</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Folders"
                  onClick={() => setFoldersOpen((prev) => !prev)}
                  className="text-zinc-300 hover:bg-zinc-800/60 hover:text-white justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Folder className="h-5 w-5 shrink-0" />
                    <span>Folders</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 group-data-[collapsible=icon]:hidden ${
                      foldersOpen && !sidebarCollapsed ? "rotate-180" : ""
                    }`}
                  />
                </SidebarMenuButton>

                {foldersOpen && !sidebarCollapsed && (
                  <SidebarMenuSub className="border-zinc-800">
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        onClick={onToggleHistory}
                        className="text-zinc-400 hover:text-white"
                      >
                        <span>View all ({chatCount})</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        onClick={onToggleRecent}
                        className="text-zinc-400 hover:text-white"
                      >
                        <span>Recent ({Math.min(chatCount, 5)})</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Upgrade Plan"
                  render={<Link to="/upgrade" />}
                  className="text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
                >
                  <Wallet01 className="h-5 w-5 shrink-0" />
                  <span>Upgrade Plan</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-transparent px-2 pb-4">
        <SidebarSeparator className="bg-zinc-800 my-2" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Profile"
              render={<a href="/profile" />}
              className="text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
            >
              <User01 className="h-5 w-5 shrink-0" />
              <span>Profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Settings"
              render={<a href="/settings" />}
              className="text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
            >
              <Settings01 className="h-5 w-5 shrink-0" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              render={<button type="button" onClick={handleLogout} />}
              className="text-zinc-400 hover:bg-rose-950/40 hover:text-rose-400"
            >
              <LogOut01 className="h-5 w-5 shrink-0" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
