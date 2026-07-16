export interface Source {
  id: string;
  name: string;
  text: string;
  createdAt: string;
}

export interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  answered?: boolean;
  selected?: number | null;
}

export interface ProgressRecord {
  id: string;
  topic: string;
  correct: boolean;
  timestamp: string;
}

export interface MCQState {
  sources: Source[];
  activeSourceId: string | null;

  topics: string[];
  activeTopic: string | null;

  records: ProgressRecord[];
}