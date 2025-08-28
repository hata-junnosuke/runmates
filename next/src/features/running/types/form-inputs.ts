// Server Actions用の型定義
// 注意: TypeScript/JavaScriptではキャメルケースを使用
// Rails APIへの送信時はスネークケースに変換される

export interface RunningRecordInput {
  date: string;
  distance: number;
}

export interface MonthlyGoalInput {
  distanceGoal: number; // Rails APIではdistance_goalに変換
}

export interface YearlyGoalInput {
  distanceGoal: number; // Rails APIではdistance_goalに変換
}
