"use client";

import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Team } from "@/lib/supabase";

interface TeamSidebarProps {
  teams: Team[];
  selectedTeam: Team | null;
  onSelectTeam: (team: Team) => void;
  onAddTeam: (company: string) => void;
  teamEffectiveness: number;
}

export function TeamSidebar({
  teams,
  selectedTeam,
  onSelectTeam,
  onAddTeam,
  teamEffectiveness,
}: TeamSidebarProps) {
  const [newTeam, setNewTeam] = useState("");

  const handleAddTeam = () => {
    if (newTeam.trim()) {
      onAddTeam(newTeam.trim());
      setNewTeam("");
    }
  };

  return (
    <aside className="w-64 bg-[#3a88ff] text-white p-6 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-6">Teams</h2>
      <div className="mb-4">
        <div className="text-sm opacity-80">Efficacia del Team</div>
        <div className="text-2xl font-bold">{teamEffectiveness}</div>
      </div>
      <nav className="space-y-2 flex-1">
        {teams.map((team) => (
          <Button
            key={team.id}
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-blue-600 ${
              selectedTeam?.id === team.id ? "bg-blue-600" : ""
            }`}
            onClick={() => onSelectTeam(team)}
          >
            {team.company}
          </Button>
        ))}
      </nav>
      <div className="pt-4 border-t border-blue-400">
        <Input
          type="text"
          placeholder="Nome team..."
          value={newTeam}
          onChange={(e) => setNewTeam(e.target.value)}
          className="w-full bg-blue-600 text-white placeholder-blue-300 border-none focus:ring-2 focus:ring-white"
          onKeyDown={(e) => e.key === "Enter" && handleAddTeam()}
        />
        <Button
          variant="ghost"
          className="mt-2 w-full text-white hover:bg-blue-600"
          onClick={handleAddTeam}
        >
          Aggiungi
        </Button>
      </div>
    </aside>
  );
}
