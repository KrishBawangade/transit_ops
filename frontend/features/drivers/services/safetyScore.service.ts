import { SafetyScoreRecord } from "../types";

const SAFETY_STORAGE_KEY = "transit_ops_safety_scores";

const getOffsetDate = (daysOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split("T")[0];
};

export const safetyScoreService = {
  getSafetyScores(): Promise<SafetyScoreRecord[]> {
    if (typeof window === "undefined") {
      return Promise.resolve([]);
    }
    const data = localStorage.getItem(SAFETY_STORAGE_KEY);
    if (!data) {
      // Seed default safety score records
      const initial: SafetyScoreRecord[] = [
        {
          id: "dc-101",
          name: "Alex Rivera",
          employeeId: "EMP-101",
          safetyScore: 95,
          harshBrakingEvents: 2,
          overspeedingEvents: 1,
          accidentCount: 0,
          lastUpdated: getOffsetDate(-1),
          riskLevel: "Low"
        },
        {
          id: "dc-102",
          name: "Dave Miller",
          employeeId: "EMP-102",
          safetyScore: 82,
          harshBrakingEvents: 12,
          overspeedingEvents: 8,
          accidentCount: 0,
          lastUpdated: getOffsetDate(-3),
          riskLevel: "Medium"
        },
        {
          id: "dc-103",
          name: "Elena Rostova",
          employeeId: "EMP-103",
          safetyScore: 58,
          harshBrakingEvents: 35,
          overspeedingEvents: 22,
          accidentCount: 1,
          lastUpdated: getOffsetDate(-2),
          riskLevel: "High"
        },
        {
          id: "dc-104",
          name: "Marcus Vance",
          employeeId: "EMP-104",
          safetyScore: 91,
          harshBrakingEvents: 4,
          overspeedingEvents: 2,
          accidentCount: 0,
          lastUpdated: getOffsetDate(-4),
          riskLevel: "Low"
        },
        {
          id: "dc-105",
          name: "Sarah Jenkins",
          employeeId: "EMP-105",
          safetyScore: 71,
          harshBrakingEvents: 20,
          overspeedingEvents: 15,
          accidentCount: 0,
          lastUpdated: getOffsetDate(-1),
          riskLevel: "Medium"
        },
        {
          id: "dc-106",
          name: "Jameson Blake",
          employeeId: "EMP-106",
          safetyScore: 45,
          harshBrakingEvents: 42,
          overspeedingEvents: 30,
          accidentCount: 2,
          lastUpdated: getOffsetDate(-5),
          riskLevel: "High"
        }
      ];
      localStorage.setItem(SAFETY_STORAGE_KEY, JSON.stringify(initial));
      return Promise.resolve(initial);
    }
    try {
      return Promise.resolve(JSON.parse(data));
    } catch {
      return Promise.resolve([]);
    }
  }
};
