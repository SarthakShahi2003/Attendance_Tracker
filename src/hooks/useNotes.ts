import { useState, useEffect } from 'react';
import { AcademicYear, UploadedFile, Semester } from '@/types/notes';

const NOTES_STORAGE_KEY = 'student_notes';

const defaultAcademicYears: AcademicYear[] = [
  {
    id: 'first-year',
    name: 'First Year',
    semesters: [
      { id: 'semester-1', name: 'First Semester', files: [] },
      { id: 'semester-2', name: 'Second Semester', files: [] }
    ]
  },
  {
    id: 'second-year',
    name: 'Second Year',
    semesters: [
      { id: 'semester-3', name: 'Third Semester', files: [] },
      { id: 'semester-4', name: 'Fourth Semester', files: [] }
    ]
  },
  {
    id: 'third-year',
    name: 'Third Year',
    semesters: [
      { id: 'semester-5', name: 'Fifth Semester', files: [] },
      { id: 'semester-6', name: 'Sixth Semester', files: [] }
    ]
  },
  {
    id: 'fourth-year',
    name: 'Fourth Year',
    semesters: [
      { id: 'semester-7', name: 'Seventh Semester', files: [] },
      { id: 'semester-8', name: 'Eighth Semester', files: [] }
    ]
  }
];

export const useNotes = () => {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(defaultAcademicYears);

  useEffect(() => {
    const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setAcademicYears(parsedNotes);
      } catch (error) {
        console.error('Error parsing saved notes:', error);
      }
    }
  }, []);

  const saveToStorage = (years: AcademicYear[]) => {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(years));
    setAcademicYears(years);
  };

  const addFile = (yearId: string, semesterId: string, file: UploadedFile) => {
    const updatedYears = academicYears.map(year => {
      if (year.id === yearId) {
        return {
          ...year,
          semesters: year.semesters.map(semester => {
            if (semester.id === semesterId) {
              return {
                ...semester,
                files: [...semester.files, file]
              };
            }
            return semester;
          })
        };
      }
      return year;
    });
    saveToStorage(updatedYears);
  };

  const deleteFile = (yearId: string, semesterId: string, fileId: string) => {
    const updatedYears = academicYears.map(year => {
      if (year.id === yearId) {
        return {
          ...year,
          semesters: year.semesters.map(semester => {
            if (semester.id === semesterId) {
              return {
                ...semester,
                files: semester.files.filter(file => file.id !== fileId)
              };
            }
            return semester;
          })
        };
      }
      return year;
    });
    saveToStorage(updatedYears);
  };

  const getTotalFiles = () => {
    return academicYears.reduce((total, year) => 
      total + year.semesters.reduce((semesterTotal, semester) => 
        semesterTotal + semester.files.length, 0), 0);
  };

  const searchFiles = (query: string): { year: AcademicYear; semester: Semester; file: UploadedFile }[] => {
    const results: { year: AcademicYear; semester: Semester; file: UploadedFile }[] = [];
    
    academicYears.forEach(year => {
      year.semesters.forEach(semester => {
        semester.files.forEach(file => {
          if (file.name.toLowerCase().includes(query.toLowerCase())) {
            results.push({ year, semester, file });
          }
        });
      });
    });
    
    return results;
  };

  return {
    academicYears,
    addFile,
    deleteFile,
    getTotalFiles,
    searchFiles
  };
};