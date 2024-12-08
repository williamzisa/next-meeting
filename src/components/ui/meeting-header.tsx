"use client";

import { Button } from "./button";
import { CalendarIcon, PlusIcon, TrashIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface MeetingHeaderProps {
  title: string;
  description: string;
  date: Date;
  onDelete: () => void;
  onAdd: () => void;
  onDateChange: (date: Date) => void;
}

export function MeetingHeader({
  title,
  description,
  date,
  onDelete,
  onAdd,
  onDateChange,
}: MeetingHeaderProps) {
  const formattedDate = format(date, "dd MMMM yyyy", { locale: it });

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {formattedDate}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {[7, 14, 30].map((days) => (
                <DropdownMenuItem
                  key={days}
                  onClick={() => {
                    const newDate = new Date();
                    newDate.setDate(newDate.getDate() + days);
                    onDateChange(newDate);
                  }}
                >
                  + {days} giorni
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-gray-500">{description}</p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="text-red-500 border-red-500"
          onClick={onDelete}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
        <Button size="icon" onClick={onAdd}>
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
