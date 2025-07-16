export interface Subject {
  id: string;
  name: string;
  target: number;
  present: number;
  total: number;
  createdAt: string;
}

export interface AttendanceData {
  subjects: Subject[];
}