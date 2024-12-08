"use client";

import { format } from "date-fns";
import { it } from "date-fns/locale";

interface KeyResultProps {
  title: string;
  current: number;
  target: number;
  forecast: number;
  forecastDate: Date;
}

export function KeyResultCard({
  title,
  current,
  target,
  forecast,
  forecastDate,
}: KeyResultProps) {
  const progress = (current / target) * 100;
  const formattedDate = format(forecastDate, "dd/MM/yyyy", { locale: it });

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between mb-2">
        <span className="font-medium">{title}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Current: {current}</span>
            <span>Target: {target}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-500">
        Forecast: {forecast} • {formattedDate}
      </div>
    </div>
  );
}
