"use client";
import React, { useState } from 'react';
import ComponentCard from '../../common/ComponentCard';
import Label from '../Label';
import Input from '../input/InputField';
import Select from '../Select';
import { BoxIcon, ChevronDownIcon, EyeCloseIcon, EyeIcon, TimeIcon } from '../../../icons';
import DatePicker from '@/components/form/date-picker';
import TextArea from '../input/TextArea';
import Button from '@/components/ui/button/Button';

export default function DefaultInputs() {
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };
  return (
    <ComponentCard title="Default Inputs">
      <div className="space-y-6">
        <div>
          <Label>Remitente</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Remitente</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Remitente</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Correo del destinatario</Label>
          <Input type="text" placeholder="prueba-phishing@gmail.com" />
        </div>
        <div>
          <Label>Remitente</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Asunto</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Cuerpo del mensaje</Label>
          <TextArea
            value={message}
            onChange={(value) => setMessage(value)}
            rows={6}
          />
        </div>
        <div>
          <DatePicker
            id="date-picker"
            label="Date Picker Input"
            placeholder="Select a date"
            onChange={(dates, currentDateString) => {
              // Handle your logic
              console.log({ dates, currentDateString });
            }}
          />
        </div>
        <Button size="sm" variant="primary" endIcon={<BoxIcon />}>
              Enviar
        </Button>
      </div>
    </ComponentCard>
  );
}
