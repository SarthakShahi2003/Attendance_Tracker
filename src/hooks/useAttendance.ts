import { useState, useEffect } from 'react';
import { Subject, AttendanceData } from '@/types/attendance';

const STORAGE_KEY = 'attendance-tracker-data';

export const useAttendance = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed: AttendanceData = JSON.parse(savedData);
        setSubjects(parsed.subjects || []);
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever subjects change
  useEffect(() => {
    const dataToSave: AttendanceData = { subjects };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [subjects]);

  const addSubject = (name: string, target: number = 75) => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name,
      target,
      present: 0,
      total: 0,
      createdAt: new Date().toISOString(),
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(subject => subject.id !== id));
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === id ? { ...subject, ...updates } : subject
      )
    );
  };

  const markPresent = (id: string) => {
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === id 
          ? { ...subject, present: subject.present + 1, total: subject.total + 1 }
          : subject
      )
    );
  };

  const markAbsent = (id: string) => {
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === id 
          ? { ...subject, total: subject.total + 1 }
          : subject
      )
    );
  };

  const resetAllData = () => {
    setSubjects([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    subjects,
    addSubject,
    deleteSubject,
    updateSubject,
    markPresent,
    markAbsent,
    resetAllData,
  };
};