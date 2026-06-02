"use client";

import { User, Settings, CreditCard, Key, Activity, LogOut } from "lucide-react";

export default function UserDashboardPage() {
  return (
    <div className="section-container py-12 flex-1 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3 mb-6 p-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              JD
            </div>
            <div>
              <div className="font-semibold text-sm">John Doe</div>
              <div className="text-xs text-muted-foreground">Pro Plan</div>
            </div>
          </div>
          
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 p-2 rounded-lg bg-primary/10 text-primary font-medium text-sm">
              <Activity className="w-4 h-4" /> Usage & Stats
            </a>
            <a href="#" className="flex items-center gap-3 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors text-sm">
              <Settings className="w-4 h-4" /> Profile Settings
            </a>
            <a href="#" className="flex items-center gap-3 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors text-sm">
              <Key className="w-4 h-4" /> API Keys
            </a>
            <a href="#" className="flex items-center gap-3 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors text-sm">
              <CreditCard className="w-4 h-4" /> Billing
            </a>
          </nav>
          
          <div className="mt-8 pt-4 border-t border-border/50">
            <button className="flex items-center gap-3 p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-sm w-full">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-8">
        <h1 className="text-3xl font-bold">Account Overview</h1>
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <div className="text-muted-foreground text-sm font-medium mb-2">Scans this month</div>
            <div className="text-3xl font-bold">1,248 <span className="text-sm font-normal text-muted-foreground">/ ∞</span></div>
          </div>
          <div className="glass-card p-6">
            <div className="text-muted-foreground text-sm font-medium mb-2">API Calls</div>
            <div className="text-3xl font-bold">8,492 <span className="text-sm font-normal text-muted-foreground">/ 10k</span></div>
            <div className="w-full h-1 bg-background rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-amber-500 w-[84%]"></div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="text-muted-foreground text-sm font-medium mb-2">Avg AI Score</div>
            <div className="text-3xl font-bold text-yellow-500">42%</div>
          </div>
        </div>

        {/* API Keys */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">API Keys</h2>
            <button className="btn-primary py-1.5 px-4 text-xs">Generate New Key</button>
          </div>
          <div className="border border-border/50 rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-background/50 border-b border-border/50 text-muted-foreground">
                <tr>
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Key</th>
                  <th className="p-3 font-medium">Created</th>
                  <th className="p-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <tr>
                  <td className="p-3 font-medium">Production App</td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">sk_live_8f92...a3b1</td>
                  <td className="p-3 text-muted-foreground">Oct 12, 2025</td>
                  <td className="p-3 text-right"><button className="text-red-400 hover:text-red-300 text-xs">Revoke</button></td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Development Testing</td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">sk_test_1c44...9d0f</td>
                  <td className="p-3 text-muted-foreground">Jan 04, 2026</td>
                  <td className="p-3 text-right"><button className="text-red-400 hover:text-red-300 text-xs">Revoke</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
