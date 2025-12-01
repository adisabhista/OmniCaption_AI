import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface PlatformCardProps {
    platform: string;
    content: string;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({ platform, content }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="h-full flex flex-col bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {platform}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8">
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                    {content || <span className="text-muted-foreground italic">Waiting for generation...</span>}
                </div>
            </CardContent>
        </Card>
    );
};
