import React from 'react';
import { PlatformCard } from './PlatformCard';
import type { CaptionsResponse } from '@/lib/api';
import { Skeleton } from "@/components/ui/skeleton";

interface ResultGridProps {
    results: CaptionsResponse | null;
    loading: boolean;
}

export const ResultGrid: React.FC<ResultGridProps> = ({ results, loading }) => {
    const platforms = ['twitter', 'linkedin', 'instagram', 'youtube'] as const;

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
                {platforms.map((p) => (
                    <div key={p} className="h-[200px] rounded-xl border border-border bg-card p-4">
                        <Skeleton className="h-4 w-[100px] mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                ))}
            </div>
        );
    }

    if (!results) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
            <PlatformCard platform="X (Twitter)" content={results.twitter} />
            <PlatformCard platform="LinkedIn" content={results.linkedin} />
            <PlatformCard platform="Instagram" content={results.instagram} />
            <PlatformCard platform="YouTube" content={results.youtube} />
        </div>
    );
};
