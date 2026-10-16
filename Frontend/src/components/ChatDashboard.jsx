import { useState } from "react";
import { X, Activity, Bell, TrendingUp, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ChatDashboard({ onClose }) {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  // Save preferences (persisted in localStorage) and close the dashboard
  const handleSavePreferences = () => {
    const preferences = { emailAlerts, twoFactor };
    try {
      localStorage.setItem("snarly-preferences", JSON.stringify(preferences));
    } catch (error) {
      console.error("Failed to save preferences:", error);
    }
    onClose?.();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-transparent animate-in fade-in duration-200">
      <Card className="mx-auto w-full max-w-xl overflow-hidden border border-white/10 bg-transparent text-white shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200">
        <Tabs defaultValue="overview" className="w-full">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center justify-between w-full">
              <CardTitle className="text-lg font-bold">Dashboard</CardTitle>
              <Button variant="ghost" className="p-2 text-zinc-400 hover:text-white hover:bg-white/10" onClick={onClose}><X className="size-5" /></Button>
            </div>
            <TabsList className="grid h-9 w-full grid-cols-3 rounded-lg">
              <TabsTrigger value="overview" className="rounded-lg text-[11px]">Uses</TabsTrigger>
              <TabsTrigger value="analytics" className="rounded-lg text-[11px]">Analytics</TabsTrigger>
              <TabsTrigger value="settings" className="rounded-lg text-[11px]">Settings</TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="mt-4">
            <TabsContent value="overview" className="mt-0 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <Avatar className="size-9 border border-white/10"><AvatarFallback className="bg-transparent"><Activity className="size-4" /></AvatarFallback></Avatar>
                  <div>
                    <p className="text-sm font-semibold">Snarly Ai</p>
                    <p className="text-xs text-zinc-400">Get your Unlimited Chats with Accuracy</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-500">91.42% Uptime</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Card className="border border-white/10 bg-white/5 p-3 shadow-none backdrop-blur-md">
                  <p className="text-xs text-zinc-400">Tokens Used</p>
                  <p className="text-xl font-bold mt-1">1.2M</p>
                </Card>
                <Card className="border border-white/10 bg-white/5 p-3 shadow-none backdrop-blur-md">
                  <p className="text-xs text-zinc-400">Money Saved With Snarly Ai</p>
                  <p className="text-xl font-bold mt-1">1,230$/Mo</p>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-0 space-y-4">
              <Card className="border border-white/10 bg-white/5 p-4 shadow-none backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10 border border-white/10"><AvatarFallback className="bg-transparent"><TrendingUp className="size-5" /></AvatarFallback></Avatar>
                  <div>
                    <p className="text-xs text-zinc-400">Users /Month OverAll</p>
                    <h3 className="text-xl font-black">233.8k</h3>
                  </div>
                </div>
              </Card>
              <ul className="space-y-2">
                <li className="flex justify-between text-sm py-2 border-b border-white/10">
                  <div className="flex items-center gap-2 text-zinc-400"><Users className="size-4"/>Avg Tokens Used in /Chat</div>
                  <span className="font-semibold">8,472</span>
                </li>
                <li className="flex justify-between text-sm py-2 border-b border-white/10">
                  <div className="flex items-center gap-2 text-zinc-400"><Users className="size-4"/> Avg. PDFs per Chat</div>
                  <span className="font-semibold">5</span>
                </li>
                <li className="flex justify-between text-sm py-2 border-b border-white/10">
                  <div className="flex items-center gap-2 text-zinc-400"><Users className="size-4"/> Avg Money Saved (This Month)</div>
                  <span className="font-semibold">2135$</span>
                </li>
              </ul>
            </TabsContent>

            <TabsContent value="settings" className="mt-0 space-y-4">
              <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-white/5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <Bell className="size-4 text-zinc-400" />
                  <div>
                    <p className="text-sm">Snarly Reply Alerts</p>
                    <p className="text-md text-zinc-400 font-bold">Notify users when their PDFs finish processing</p>
                  </div>
                </div>
                <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
              </div>
              <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-white/5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <Users className="size-4 text-zinc-400" />
                  <div>
                    <p className="text-sm">Chat Mode</p>
                    <p className="text-md text-zinc-400 font-bold">Allow Your Chats To Save In Snarly.</p>
                  </div>
                </div>
                <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
              </div>
            </TabsContent>
          </CardContent>

          <CardFooter className="flex justify-end gap-2 border-t border-white/10 pt-4">
            <Button variant="ghost" className="hover:bg-white/10" onClick={onClose}>Cancel</Button>
            <Button className="bg-white/10 border border-white/10 backdrop-blur-md hover:bg-white/20" onClick={handleSavePreferences}>Save Preferences</Button>
          </CardFooter>
        </Tabs>
      </Card>
    </div>
  );
}
