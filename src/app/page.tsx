"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { MeetingHeader } from "@/components/ui/meeting-header";
import { KeyResultCard } from "@/components/ui/key-result-card";
import { TeamSidebar } from "@/components/ui/team-sidebar";
import { AddItemDialog } from "@/components/ui/add-item-dialog";
import {
  Meeting,
  Team,
  KeyResult,
  SharedRisk,
  NewInitiative,
  SharedInitiative,
  getMeetings,
  getTeams,
  getKeyResults,
  getSharedRisks,
  getInitiatives,
  createMeeting,
  createTeam,
  createKeyResult,
  createSharedRisk,
  createInitiative,
  getTeamEffectiveness,
  getMeetingEffectiveness,
} from "@/lib/supabase";

interface KeyResultFormData {
  title: string;
  current: number;
  target: number;
  forecast: number;
  forecastDate: string;
}

interface RiskFormData {
  description: string;
  keyResultId: number;
}

interface InitiativeFormData {
  description: string;
  riskId: number;
}

export default function Home() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [keyResults, setKeyResults] = useState<KeyResult[]>([]);
  const [sharedRisks, setSharedRisks] = useState<SharedRisk[]>([]);
  const [initiatives, setInitiatives] = useState<{
    new: NewInitiative[];
    shared: SharedInitiative[];
  }>({ new: [], shared: [] });
  const [teamEffectiveness, setTeamEffectiveness] = useState<number>(0);
  const [meetingEffectiveness, setMeetingEffectiveness] = useState<number>(0);

  useEffect(() => {
    loadMeetings();
    loadTeams();
  }, []);

  useEffect(() => {
    if (selectedMeeting) {
      loadKeyResults();
      loadSharedRisks();
      loadInitiatives();
      loadMeetingEffectiveness();
    }
  }, [selectedMeeting]);

  useEffect(() => {
    if (selectedTeam) {
      loadTeamEffectiveness();
    }
  }, [selectedTeam]);

  const loadMeetings = async () => {
    try {
      const data = await getMeetings();
      setMeetings(data);
      if (data.length > 0 && !selectedMeeting) {
        setSelectedMeeting(data[0]);
      }
    } catch (error) {
      console.error("Error loading meetings:", error);
    }
  };

  const loadTeams = async () => {
    try {
      const data = await getTeams();
      setTeams(data);
    } catch (error) {
      console.error("Error loading teams:", error);
    }
  };

  const loadKeyResults = async () => {
    if (!selectedMeeting) return;
    try {
      const data = await getKeyResults(selectedMeeting.id);
      setKeyResults(data);
    } catch (error) {
      console.error("Error loading key results:", error);
    }
  };

  const loadSharedRisks = async () => {
    if (!selectedMeeting) return;
    try {
      const data = await getSharedRisks(selectedMeeting.id);
      setSharedRisks(data);
    } catch (error) {
      console.error("Error loading shared risks:", error);
    }
  };

  const loadInitiatives = async () => {
    if (!selectedMeeting) return;
    try {
      const data = await getInitiatives(selectedMeeting.id);
      setInitiatives(data);
    } catch (error) {
      console.error("Error loading initiatives:", error);
    }
  };

  const loadTeamEffectiveness = async () => {
    if (!selectedTeam) return;
    try {
      const effectiveness = await getTeamEffectiveness(selectedTeam.id);
      setTeamEffectiveness(effectiveness);
    } catch (error) {
      console.error("Error loading team effectiveness:", error);
    }
  };

  const loadMeetingEffectiveness = async () => {
    if (!selectedMeeting) return;
    try {
      const effectiveness = await getMeetingEffectiveness(selectedMeeting.id);
      setMeetingEffectiveness(effectiveness);
    } catch (error) {
      console.error("Error loading meeting effectiveness:", error);
    }
  };

  const handleAddMeeting = async (date: string) => {
    try {
      await createMeeting(date);
      await loadMeetings();
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
  };

  const handleAddTeam = async (company: string) => {
    try {
      await createTeam(company);
      await loadTeams();
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const handleAddKeyResult = async (data: KeyResultFormData) => {
    if (!selectedMeeting || !selectedTeam) return;
    try {
      const keyResult = {
        indicator: data.title,
        forecast: data.forecast,
        target: data.target,
        gap: data.target - data.forecast,
        result_type: 1,
        date: data.forecastDate,
        meeting_id: selectedMeeting.id,
        value: data.current,
        team_id: selectedTeam.id,
      };
      await createKeyResult(keyResult);
      await loadKeyResults();
    } catch (error) {
      console.error("Error creating key result:", error);
    }
  };

  const handleAddRisk = async (data: RiskFormData) => {
    if (!selectedMeeting || !selectedTeam) return;
    try {
      const risk = {
        description: data.description,
        meeting_id: selectedMeeting.id,
        team_id: selectedTeam.id,
        key_result_id: data.keyResultId,
      };
      await createSharedRisk(risk);
      await loadSharedRisks();
    } catch (error) {
      console.error("Error creating risk:", error);
    }
  };

  const handleAddInitiative = async (
    data: InitiativeFormData & { type: "new" | "shared" }
  ) => {
    if (!selectedMeeting || !selectedTeam) return;
    try {
      const initiative = {
        description: data.description,
        meeting_id: selectedMeeting.id,
        team_id: selectedTeam.id,
        shared_risk_id: data.riskId,
      };
      await createInitiative(initiative, data.type);
      await loadInitiatives();
      if (data.type === "new") {
        await loadTeamEffectiveness();
        await loadMeetingEffectiveness();
      }
    } catch (error) {
      console.error("Error creating initiative:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <TeamSidebar
        teams={teams}
        selectedTeam={selectedTeam}
        onSelectTeam={setSelectedTeam}
        onAddTeam={handleAddTeam}
        teamEffectiveness={teamEffectiveness}
      />
      <main className="flex-1 overflow-auto bg-gray-50 p-8">
        <MeetingHeader
          meetings={meetings}
          selectedMeeting={selectedMeeting}
          onSelectMeeting={setSelectedMeeting}
          onAddMeeting={handleAddMeeting}
          meetingEffectiveness={meetingEffectiveness}
        />
        <div className="mt-8 space-y-8">
          <section>
            <h3 className="flex items-center justify-between text-lg font-semibold">
              Key Results
              <AddItemDialog
                title="Aggiungi Key Result"
                trigger={
                  <button className="text-sm font-normal text-blue-600">
                    + Aggiungi
                  </button>
                }
                fields={[
                  {
                    name: "title",
                    label: "Indicatore",
                    type: "text",
                    required: true,
                  },
                  {
                    name: "current",
                    label: "Valore Attuale",
                    type: "number",
                    required: true,
                  },
                  {
                    name: "target",
                    label: "Target",
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
                    label: "Data Previsione",
                    type: "date",
                    required: true,
                  },
                ]}
                onSubmit={handleAddKeyResult}
              />
            </h3>
            <div className="space-y-4">
              {keyResults.map((keyResult) => (
                <KeyResultCard
                  key={keyResult.id}
                  title={keyResult.indicator}
                  current={keyResult.value}
                  target={keyResult.target}
                  forecast={keyResult.forecast}
                  forecastDate={format(
                    new Date(keyResult.date),
                    "d MMMM yyyy",
                    { locale: it }
                  )}
                />
              ))}
            </div>
          </section>

          <section>
            <h3 className="flex items-center justify-between text-lg font-semibold">
              Rischi Condivisi
              <AddItemDialog
                title="Aggiungi Rischio"
                trigger={
                  <button className="text-sm font-normal text-blue-600">
                    + Aggiungi
                  </button>
                }
                fields={[
                  {
                    name: "description",
                    label: "Descrizione",
                    type: "text",
                    required: true,
                  },
                  {
                    name: "keyResultId",
                    label: "ID Key Result",
                    type: "number",
                    required: true,
                  },
                ]}
                onSubmit={handleAddRisk}
              />
            </h3>
            <div className="space-y-2">
              {sharedRisks.map((risk) => (
                <div
                  key={risk.id}
                  className="rounded-lg border bg-white p-4 shadow-sm"
                >
                  <p>{risk.description}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-8">
            <section>
              <h3 className="flex items-center justify-between text-lg font-semibold">
                Iniziative Condivise
                <AddItemDialog
                  title="Aggiungi Iniziativa Condivisa"
                  trigger={
                    <button className="text-sm font-normal text-blue-600">
                      + Aggiungi
                    </button>
                  }
                  fields={[
                    {
                      name: "description",
                      label: "Descrizione",
                      type: "text",
                      required: true,
                    },
                    {
                      name: "riskId",
                      label: "ID Rischio",
                      type: "number",
                      required: true,
                    },
                  ]}
                  onSubmit={(data) =>
                    handleAddInitiative({ ...data, type: "shared" })
                  }
                />
              </h3>
              <div className="space-y-2">
                {initiatives.shared.map((initiative) => (
                  <div
                    key={initiative.id}
                    className="rounded-lg border bg-white p-4 shadow-sm"
                  >
                    <p>{initiative.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="flex items-center justify-between text-lg font-semibold">
                Nuove Iniziative
                <AddItemDialog
                  title="Aggiungi Nuova Iniziativa"
                  trigger={
                    <button className="text-sm font-normal text-blue-600">
                      + Aggiungi
                    </button>
                  }
                  fields={[
                    {
                      name: "description",
                      label: "Descrizione",
                      type: "text",
                      required: true,
                    },
                    {
                      name: "riskId",
                      label: "ID Rischio",
                      type: "number",
                      required: true,
                    },
                  ]}
                  onSubmit={(data) =>
                    handleAddInitiative({ ...data, type: "new" })
                  }
                />
              </h3>
              <div className="space-y-2">
                {initiatives.new.map((initiative) => (
                  <div
                    key={initiative.id}
                    className="rounded-lg border bg-white p-4 shadow-sm"
                  >
                    <p>{initiative.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
