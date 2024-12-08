"use client";

import { Button } from "./button";
import { CalendarIcon, PlusIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Meeting } from "@/lib/supabase";

interface MeetingHeaderProps {
  selectedMeeting: Meeting | null;
  meetings: Meeting[];
  onSelectMeeting: (meeting: Meeting) => void;
  onAddMeeting: (date: string) => void;
  meetingEffectiveness: number;
}

export function MeetingHeader({
  selectedMeeting,
  meetings,
  onSelectMeeting,
  onAddMeeting,
  meetingEffectiveness,
}: MeetingHeaderProps) {
  if (!selectedMeeting) {
    return (
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Seleziona un Meeting</h1>
          <p className="text-gray-500">
            Scegli un meeting esistente o creane uno nuovo
          </p>
        </div>
        <Button onClick={() => onAddMeeting(new Date().toISOString())}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Nuovo Meeting
        </Button>
      </div>
    );
  }

  const formattedDate = format(new Date(selectedMeeting.date), "dd MMMM yyyy", {
    locale: it,
  });

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">Meeting {formattedDate}</h1>
          <div className="text-sm text-gray-500">
            Efficacia:{" "}
            <span className="font-medium">{meetingEffectiveness}</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {formattedDate}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {meetings.map((meeting) => (
              <DropdownMenuItem
                key={meeting.id}
                onClick={() => onSelectMeeting(meeting)}
              >
                {format(new Date(meeting.date), "dd MMMM yyyy", { locale: it })}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              onClick={() => onAddMeeting(new Date().toISOString())}
            >
              + Nuovo Meeting
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
