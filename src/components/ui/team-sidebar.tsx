"use client";

import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";

interface TeamSidebarProps {
  teams: string[];
  selectedTeam: string;
  onTeamSelect: (team: string) => void;
  onTeamAdd: (team: string) => void;
}

export function TeamSidebar({
  teams,
  selectedTeam,
  onTeamSelect,
  onTeamAdd,
}: TeamSidebarProps) {
  const [newTeam, setNewTeam] = useState("");

  const handleAddTeam = () => {
    if (newTeam.trim()) {
      onTeamAdd(newTeam.trim());
      setNewTeam("");
    }
  };

  return (
    <aside className="w-64 bg-[#3a88ff] text-white p-6 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-6">Teams</h2>
      <nav className="space-y-2 flex-1">
        {teams.map((team) => (
          <Button
            key={team}
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-blue-600 ${
              selectedTeam === team ? "bg-blue-600" : ""
            }`}
            onClick={() => onTeamSelect(team)}
          >
            {team}
          </Button>
        ))}
      </nav>
      <div className="pt-4 border-t border-blue-400">
        <Input
          type="text"
          placeholder="Team name..."
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
          Add
        </Button>
      </div>
    </aside>
  );
}
