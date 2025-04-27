
import React from 'react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { DatabaseType } from '../../types/api.types';

interface DatabaseTypeSelectProps {
  value: DatabaseType;
  onValueChange: (value: DatabaseType) => void;
}

export function DatabaseTypeSelect({ value, onValueChange }: DatabaseTypeSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="dbType" className="font-bold">Tipo de Base de Datos</Label>
      <Select
        value={value}
        onValueChange={(value: DatabaseType) => onValueChange(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecciona el tipo de base de datos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sqlserver">SQL Server</SelectItem>
          <SelectItem value="postgresql">PostgreSQL</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
