import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface ToneSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

const tones = [
    { value: "Profesional", label: "Profesional" },
    { value: "Santai/Gaul", label: "Santai / Gaul" },
    { value: "Inspiratif", label: "Inspiratif" },
    { value: "Jualan/Promosi", label: "Jualan / Promosi" },
    { value: "Lucu/Receh", label: "Lucu / Receh" },
    { value: "Edukatif", label: "Edukatif" },
];

export const ToneSelector: React.FC<ToneSelectorProps> = ({ value, onChange }) => {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih Nada" />
            </SelectTrigger>
            <SelectContent>
                {tones.map((tone) => (
                    <SelectItem key={tone.value} value={tone.value}>
                        {tone.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
