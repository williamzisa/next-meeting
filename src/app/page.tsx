"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TeamSidebar } from "@/components/ui/team-sidebar";
import { MeetingHeader } from "@/components/ui/meeting-header";
import { KeyResultCard } from "@/components/ui/key-result-card";
import { AddItemDialog } from "@/components/ui/add-item-dialog";
import { v4 as uuidv4 } from "uuid";

interface Meeting {
  id: string;
  title: string;
  date: Date;
  description: string;
}

interface KeyResult {
  id: string;
  title: string;
  current: number;
  target: number;
  forecast: number;
  forecastDate: Date;
}

interface Risk {
  id: string;
  description: string;
}

interface Initiative {
  id: string;
  description: string;
  isNew: boolean;
}

interface TeamData {
  keyResults: KeyResult[];
  risks: Risk[];
  initiatives: Initiative[];
}

interface KeyResultFormData {
  title: string;
  current: number;
  target: number;
  forecast: number;
  forecastDate: string;
}

interface RiskFormData {
  description: string;
}

interface InitiativeFormData {
  description: string;
  type: "new" | "shared";
}

export default function Home() {
  const [teams, setTeams] = useState<string[]>([
    "CEO",
    "Marketing",
    "Operations",
  ]);
  const [selectedTeam, setSelectedTeam] = useState("CEO");
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "Monthly OKR Meeting",
      date: new Date(),
      description: "Review and discuss team progress, initiatives, and risks",
    },
  ]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting>(meetings[0]);

  const [teamData, setTeamData] = useState<Record<string, TeamData>>({
    CEO: {
      keyResults: [
        {
          id: "1",
          title: "Fatturato complessivo",
          current: 8,
          target: 10,
          forecast: 7,
          forecastDate: new Date("2024-12-08"),
        },
      ],
      risks: [
        {
          id: "1",
          description: "Nuovo rischio connesso",
        },
      ],
      initiatives: [
        {
          id: "1",
          description:
            "Comunicazione su % da assegnare PCG; altrimenti ci sarà standard",
          isNew: true,
        },
      ],
    },
    Marketing: { keyResults: [], risks: [], initiatives: [] },
    Operations: { keyResults: [], risks: [], initiatives: [] },
  });

  const handleAddTeam = (team: string) => {
    setTeams((prev) => [...prev, team]);
    setTeamData((prev) => ({
      ...prev,
      [team]: { keyResults: [], risks: [], initiatives: [] },
    }));
  };

  const handleDeleteMeeting = () => {
    setMeetings((prev) => prev.filter((m) => m.id !== selectedMeeting.id));
    if (meetings.length > 1) {
      setSelectedMeeting(meetings[0]);
    }
  };

  const handleAddMeeting = () => {
    const newMeeting: Meeting = {
      id: uuidv4(),
      title: "New OKR Meeting",
      date: new Date(),
      description: "Review and discuss team progress, initiatives, and risks",
    };
    setMeetings((prev) => [...prev, newMeeting]);
    setSelectedMeeting(newMeeting);
  };

  const handleAddKeyResult = (data: KeyResultFormData) => {
    const newKeyResult: KeyResult = {
      id: uuidv4(),
      title: data.title,
      current: data.current,
      target: data.target,
      forecast: data.forecast,
      forecastDate: new Date(data.forecastDate),
    };

    setTeamData((prev) => ({
      ...prev,
      [selectedTeam]: {
        ...prev[selectedTeam],
        keyResults: [...prev[selectedTeam].keyResults, newKeyResult],
      },
    }));
  };

  const handleAddRisk = (data: RiskFormData) => {
    const newRisk: Risk = {
      id: uuidv4(),
      description: data.description,
    };

    setTeamData((prev) => ({
      ...prev,
      [selectedTeam]: {
        ...prev[selectedTeam],
        risks: [...prev[selectedTeam].risks, newRisk],
      },
    }));
  };

  const handleAddInitiative = (data: InitiativeFormData) => {
    const newInitiative: Initiative = {
      id: uuidv4(),
      description: data.description,
      isNew: data.type === "new",
    };

    setTeamData((prev) => ({
      ...prev,
      [selectedTeam]: {
        ...prev[selectedTeam],
        initiatives: [...prev[selectedTeam].initiatives, newInitiative],
      },
    }));
  };

  return (
    <div className="flex h-screen bg-white">
      <TeamSidebar
        teams={teams}
        selectedTeam={selectedTeam}
        onTeamSelect={setSelectedTeam}
        onTeamAdd={handleAddTeam}
      />

      <main className="flex-1 p-8 overflow-y-auto">
        <MeetingHeader
          title={selectedMeeting.title}
          description={selectedMeeting.description}
          date={selectedMeeting.date}
          onDelete={handleDeleteMeeting}
          onAdd={handleAddMeeting}
          onDateChange={(date) => {
            setSelectedMeeting((prev) => ({ ...prev, date }));
            setMeetings((prev) =>
              prev.map((m) =>
                m.id === selectedMeeting.id ? { ...m, date } : m
              )
            );
          }}
        />

        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{selectedTeam}</h2>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex justify-between items-center">
              Key Results
              <AddItemDialog
                title="Aggiungi Key Result"
                trigger={
                  <Button variant="ghost" size="sm">
                    Add Key Result
                  </Button>
                }
                fields={[
                  {
                    name: "title",
                    label: "Titolo",
                    type: "text",
                    required: true,
                  },
                  {
                    name: "current",
                    label: "Valore attuale",
                    type: "number",
                    required: true,
                  },
                  {
                    name: "target",
                    label: "Obiettivo",
                    type: "number",
                    required: true,
                  },
                  {
                    name: "forecast",
                    label: "Previsione",
                    type: "number",
                    required: true,
                  },
                  {
                    name: "forecastDate",
                    label: "Data previsione",
                    type: "date",
                    required: true,
                  },
                ]}
                onSubmit={handleAddKeyResult}
              />
            </h3>
            <div className="space-y-4">
              {teamData[selectedTeam].keyResults.map((kr) => (
                <KeyResultCard key={kr.id} {...kr} />
              ))}
            </div>
          </Card>
        </section>

        <section className="mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex justify-between items-center">
              Shared Risks
              <AddItemDialog
                title="Aggiungi Rischio"
                trigger={
                  <Button variant="ghost" size="sm">
                    Add Risk
                  </Button>
                }
                fields={[
                  {
                    name: "description",
                    label: "Descrizione",
                    type: "text",
                    required: true,
                  },
                ]}
                onSubmit={handleAddRisk}
              />
            </h3>
            <div className="space-y-2">
              {teamData[selectedTeam].risks.map((risk) => (
                <div
                  key={risk.id}
                  className="flex items-center gap-2 text-amber-500"
                >
                  <span>⚠️</span>
                  <span>{risk.description}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex justify-between items-center">
              Shared Initiatives
              <AddItemDialog
                title="Aggiungi Iniziativa Condivisa"
                trigger={
                  <Button variant="ghost" size="sm">
                    Add Initiative
                  </Button>
                }
                fields={[
                  {
                    name: "description",
                    label: "Descrizione",
                    type: "text",
                    required: true,
                  },
                  { name: "type", label: "Tipo", type: "text", required: true },
                ]}
                onSubmit={(data) =>
                  handleAddInitiative({ ...data, type: "shared" })
                }
              />
            </h3>
            <div className="space-y-2">
              {teamData[selectedTeam].initiatives
                .filter((i) => !i.isNew)
                .map((initiative) => (
                  <div key={initiative.id} className="flex items-center gap-2">
                    <span>{initiative.description}</span>
                  </div>
                ))}
            </div>
          </Card>
        </section>

        <section>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex justify-between items-center">
              New Initiatives
              <AddItemDialog
                title="Aggiungi Nuova Iniziativa"
                trigger={
                  <Button variant="ghost" size="sm">
                    Add New Initiative
                  </Button>
                }
                fields={[
                  {
                    name: "description",
                    label: "Descrizione",
                    type: "text",
                    required: true,
                  },
                  { name: "type", label: "Tipo", type: "text", required: true },
                ]}
                onSubmit={(data) =>
                  handleAddInitiative({ ...data, type: "new" })
                }
              />
            </h3>
            <div className="space-y-2">
              {teamData[selectedTeam].initiatives
                .filter((i) => i.isNew)
                .map((initiative) => (
                  <div key={initiative.id} className="flex items-center gap-2">
                    <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                      new
                    </span>
                    <span>{initiative.description}</span>
                  </div>
                ))}
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
