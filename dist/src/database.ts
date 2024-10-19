export interface DailySummary {
    avgTemp: number;
    maxTemp: number;
    minTemp: number;
    dominantCondition: string;
}

const dailySummaries: { [date: string]: DailySummary } = {};

export function saveDailySummary(date: string, summary: DailySummary): void {
    dailySummaries[date] = summary;
}

export function getDailySummary(date: string): DailySummary | null {
    return dailySummaries[date] || null;
}
