export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  content: string; // base64 encoded content for localStorage
}

export interface Semester {
  id: string;
  name: string;
  files: UploadedFile[];
}

export interface AcademicYear {
  id: string;
  name: string;
  semesters: Semester[];
}

export type FileFilter = 'all' | 'pdf' | 'docx' | 'ppt' | 'txt' | 'image';