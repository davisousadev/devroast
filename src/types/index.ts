export interface LeaderboardItem {
  id: string;
  rank: number;
  score: number;
  code: string;
  language: string;
  createdAt?: string;
}

export interface CodeSubmission {
  id: string;
  code: string;
  language: string;
  roastMode: boolean;
  score?: number;
  createdAt?: string;
}

export interface RoastResult {
  score: number;
  issues: RoastIssue[];
}

export interface RoastIssue {
  type: "critical" | "warning" | "good";
  title: string;
  description: string;
  line?: number;
}

export interface Stats {
  totalCodesRoasted: number;
  averageScore: number;
}
