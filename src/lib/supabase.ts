import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipi per le tabelle del database
export interface Meeting {
  id: number;
  created_at: string;
  date: string;
}

export interface Team {
  id: number;
  created_at: string;
  company: string;
}

export interface KeyResult {
  id: number;
  created_at: string;
  indicator: string;
  forecast: number;
  target: number;
  gap: number;
  result_type: number;
  date: string;
  meeting_id: number;
  value: number;
  team_id: number;
}

export interface SharedRisk {
  id: number;
  created_at: string;
  description: string;
  meeting_id: number;
  team_id: number;
  key_result_id: number;
}

export interface NewInitiative {
  id: number;
  created_at: string;
  description: string;
  meeting_id: number;
  team_id: number;
  shared_risk_id: number;
}

export interface SharedInitiative {
  id: number;
  created_at: string;
  description: string;
  meeting_id: number;
  team_id: number;
  shared_risk_id: number;
}

// Funzioni helper per le operazioni CRUD
export const getMeetings = async () => {
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
};

export const getTeams = async () => {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

export const getKeyResults = async (meetingId: number) => {
  const { data, error } = await supabase
    .from("key_results")
    .select("*")
    .eq("meeting_id", meetingId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

export const getSharedRisks = async (meetingId: number) => {
  const { data, error } = await supabase
    .from("shared_risks")
    .select("*")
    .eq("meeting_id", meetingId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

export const getInitiatives = async (meetingId: number) => {
  const { data: newInitiatives, error: newError } = await supabase
    .from("new_initiatives")
    .select("*")
    .eq("meeting_id", meetingId)
    .order("created_at", { ascending: true });

  if (newError) throw newError;

  const { data: sharedInitiatives, error: sharedError } = await supabase
    .from("shared_initiatives")
    .select("*")
    .eq("meeting_id", meetingId)
    .order("created_at", { ascending: true });

  if (sharedError) throw sharedError;

  return {
    new: newInitiatives,
    shared: sharedInitiatives,
  };
};

export const createMeeting = async (date: string) => {
  const { data, error } = await supabase
    .from("meetings")
    .insert([{ date }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createTeam = async (company: string) => {
  const { data, error } = await supabase
    .from("teams")
    .insert([{ company }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createKeyResult = async (
  keyResult: Omit<KeyResult, "id" | "created_at">
) => {
  const { data, error } = await supabase
    .from("key_results")
    .insert([keyResult])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createSharedRisk = async (
  risk: Omit<SharedRisk, "id" | "created_at">
) => {
  const { data, error } = await supabase
    .from("shared_risks")
    .insert([risk])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createInitiative = async (
  initiative: Omit<NewInitiative | SharedInitiative, "id" | "created_at">,
  type: "new" | "shared"
) => {
  const table = type === "new" ? "new_initiatives" : "shared_initiatives";
  const { data, error } = await supabase
    .from(table)
    .insert([initiative])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Funzioni per le metriche
export const getTeamEffectiveness = async (teamId: number) => {
  const { data, error } = await supabase
    .from("new_initiatives")
    .select("*")
    .eq("team_id", teamId);

  if (error) throw error;
  return data.length; // Numero di New Initiatives generate dal team
};

export const getMeetingEffectiveness = async (meetingId: number) => {
  const { data, error } = await supabase
    .from("new_initiatives")
    .select("*")
    .eq("meeting_id", meetingId);

  if (error) throw error;
  return data.length; // Numero di New Initiatives generate nel meeting
};
