
import React from 'react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface DatabaseSelectProps {
  value: string;
  databases: Array<{ value: string; label: string; }>;
  onValueChange: (value: string) => void;
}

export function DatabaseSelect({ value, databases, onValueChange }: DatabaseSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="database" className="font-bold">Base de datos</Label>
      <Select
        value={value}
        onValueChange={onValueChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecciona la base de datos" />
        </SelectTrigger>
        <SelectContent>
          {databases.map((db) => (
            <SelectItem key={db.value} value={db.value}>
              {db.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
