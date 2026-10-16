import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  MessageSquareText,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react"

//  ------------------------------ | STATS - BENTO | ------------------------------  //

export default function StatsBento() {
  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {/* STATUS — wide */}
      <Card className="border border-white/10 bg-white/5 shadow-none backdrop-blur-md sm:col-span-2">
        <CardContent className="flex flex-wrap items-center justify-between gap-2 p-3.5">
          <div className="flex flex-1 items-center gap-3">
            <Avatar className="size-9 shrink-0 border border-white/10">
              <AvatarFallback className="bg-transparent">
                <Activity className="size-4" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold">Chatbot Status</p>
              <p className="text-xs text-zinc-400">
                AI engine operational — processing PDFs
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="shrink-0 border-green-500/50 bg-green-500/10 text-green-500"
          >
            99.9% Uptime
          </Badge>
        </CardContent>
      </Card>

      {/* TOTAL USERS */}
      <Card className="border border-white/10 bg-white/5 shadow-none backdrop-blur-md">
        <CardContent className="p-3.5">
          <div className="flex items-center gap-2 text-zinc-400">
            <Users className="size-4" />
            <p className="text-xs">Total Users</p>
          </div>
          <p className="mt-1.5 text-xl font-bold text-white">1,248</p>
        </CardContent>
      </Card>

      {/* PDFS UPLOADED */}
      <Card className="border border-white/10 bg-white/5 shadow-none backdrop-blur-md">
        <CardContent className="p-3.5">
          <div className="flex items-center gap-2 text-zinc-400">
            <FileText className="size-4" />
            <p className="text-xs">PDFs Uploaded</p>
          </div>
          <p className="mt-1.5 text-xl font-bold text-white">34,210</p>
        </CardContent>
      </Card>

      {/* QUESTIONS ANSWERED — wide */}
      <Card className="border border-white/10 bg-white/5 shadow-none backdrop-blur-md sm:col-span-2">
        <CardContent className="flex flex-wrap items-center justify-between gap-2 p-4">
          <div className="flex flex-1 items-center gap-3">
            <Avatar className="size-10 shrink-0 border border-white/10">
              <AvatarFallback className="bg-transparent">
                <TrendingUp className="size-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs text-zinc-400">Questions Answered</p>
              <h3 className="text-xl font-black text-white sm:text-2xl">
                128,904
              </h3>
            </div>
          </div>
          <Badge className="shrink-0 bg-green-500/10 text-green-500">
            +18.4%
          </Badge>
        </CardContent>
      </Card>

      {/* ACTIVE USERS THIS WEEK */}
      <Card className="border border-white/10 bg-white/5 shadow-none backdrop-blur-md">
        <CardContent className="p-3.5">
          <div className="flex items-center gap-2 text-zinc-400">
            <MessageSquareText className="size-4" />
            <p className="text-xs">Active Users This Week</p>
          </div>
          <div className="mt-1.5 flex flex-wrap items-baseline gap-1.5">
            <p className="text-xl font-bold text-white">8,472</p>
            <span className="flex shrink-0 items-center text-[11px] font-medium text-emerald-500">
              +12% <ArrowUpRight className="size-3" />
            </span>
          </div>
        </CardContent>
      </Card>

      {/* AVG PDFS PER USER */}
      <Card className="border border-white/10 bg-white/5 shadow-none backdrop-blur-md">
        <CardContent className="p-3.5">
          <div className="flex items-center gap-2 text-zinc-400">
            <CheckCircle2 className="size-4" />
            <p className="text-xs">Avg. PDFs per User</p>
          </div>
          <p className="mt-1.5 text-xl font-bold text-white">12</p>
        </CardContent>
      </Card>

      {/* NEW USERS — wide */}
      <Card className="border border-white/10 bg-white/5 shadow-none backdrop-blur-md sm:col-span-2">
        <CardContent className="flex flex-wrap items-center justify-between gap-2 p-3.5">
          <div className="flex items-center gap-2 text-zinc-400">
            <UserPlus className="size-4" />
            <p className="text-xs">New Users (This Month)</p>
          </div>
          <p className="text-xl font-bold text-white">+642</p>
        </CardContent>
      </Card>
    </div>
  )
}
