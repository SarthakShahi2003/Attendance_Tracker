import { useState } from 'react';
import { AddSubjectForm } from '@/components/AddSubjectForm';
import { SubjectCard } from '@/components/SubjectCard';
import { NotesSection } from '@/components/NotesSection';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAttendance } from '@/hooks/useAttendance';
import { RefreshCw, BookOpen, GraduationCap, FileText } from 'lucide-react';

export const AttendanceTracker = () => {
  const { 
    subjects, 
    addSubject, 
    deleteSubject, 
    updateSubject, 
    markPresent, 
    markAbsent, 
    resetAllData 
  } = useAttendance();

  const totalSubjects = subjects.length;
  const totalClasses = subjects.reduce((sum, subject) => sum + subject.total, 0);
  const averageAttendance = totalClasses > 0 
    ? subjects.reduce((sum, subject) => {
        const percentage = subject.total > 0 ? (subject.present / subject.total) * 100 : 0;
        return sum + percentage;
      }, 0) / totalSubjects
    : 0;

  const AttendanceContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Attendance Tracker</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Track your attendance and never miss your target!
        </p>
      </div>

      {/* Statistics */}
      {totalSubjects > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary/10 p-4 rounded-lg text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{totalSubjects}</p>
            <p className="text-sm text-muted-foreground">Total Subjects</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {totalClasses}
            </div>
            <p className="text-sm text-muted-foreground">Total Classes</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {averageAttendance.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">Average Attendance</p>
          </div>
        </div>
      )}

      {/* Add Subject Form */}
      <AddSubjectForm onAddSubject={addSubject} />

      {/* Subjects Grid */}
      {subjects.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Subjects</h2>
            <Button 
              variant="outline" 
              onClick={resetAllData}
              className="text-destructive hover:text-destructive"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset All Data
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onMarkPresent={markPresent}
                onMarkAbsent={markAbsent}
                onDelete={deleteSubject}
                onUpdate={updateSubject}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No subjects added yet</h3>
          <p className="text-muted-foreground">
            Add your first subject above to start tracking your attendance!
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Main Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <GraduationCap className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">Student Dashboard</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Your complete academic companion
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            <AttendanceContent />
          </TabsContent>

          <TabsContent value="notes">
            <NotesSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};