"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

interface Field {
  name: string;
  label: string;
  type: "text" | "number" | "date";
  required?: boolean;
}

interface FormData {
  [key: string]: string | number | Date;
}

interface AddItemDialogProps {
  title: string;
  trigger: React.ReactNode;
  onSubmit: (data: FormData) => void;
  fields: Field[];
}

export function AddItemDialog({
  title,
  trigger,
  onSubmit,
  fields,
}: AddItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({});
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                type={field.type}
                required={field.required}
                value={formData[field.name] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [field.name]:
                      field.type === "number"
                        ? Number(e.target.value)
                        : e.target.value,
                  }))
                }
              />
            </div>
          ))}
          <Button type="submit" className="w-full">
            Aggiungi
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
