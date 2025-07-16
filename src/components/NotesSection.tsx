import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNotes } from '@/hooks/useNotes';
import { FileUpload } from './FileUpload';
import { FileViewer } from './FileViewer';
import { useToast } from '@/hooks/use-toast';
import { 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown, 
  FileText,
  BookOpen,
  ArrowLeft 
} from 'lucide-react';
import { AcademicYear, Semester, UploadedFile } from '@/types/notes';

export const NotesSection = () => {
  const { academicYears, addFile, deleteFile, getTotalFiles } = useNotes();
  const { toast } = useToast();
  
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());
  const [selectedSemester, setSelectedSemester] = useState<{
    year: AcademicYear;
    semester: Semester;
  } | null>(null);

  const toggleYear = (yearId: string) => {
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(yearId)) {
      newExpanded.delete(yearId);
    } else {
      newExpanded.add(yearId);
    }
    setExpandedYears(newExpanded);
  };

  const selectSemester = (year: AcademicYear, semester: Semester) => {
    setSelectedSemester({ year, semester });
  };

  const handleFileUpload = (file: UploadedFile) => {
    if (!selectedSemester) return;
    
    addFile(selectedSemester.year.id, selectedSemester.semester.id, file);
    toast({
      title: "File uploaded successfully",
      description: `${file.name} has been uploaded to ${selectedSemester.semester.name}`,
    });
  };

  const handleFileDelete = (fileId: string) => {
    if (!selectedSemester) return;
    
    deleteFile(selectedSemester.year.id, selectedSemester.semester.id, fileId);
    toast({
      title: "File deleted",
      description: "The file has been removed from your notes",
    });
  };

  const handleFileDownload = (file: UploadedFile) => {
    // Create a download link for the file
    const link = document.createElement('a');
    link.href = file.content;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "File downloaded",
      description: `${file.name} has been downloaded`,
    });
  };

  const goBack = () => {
    setSelectedSemester(null);
  };

  const getTotalFilesInYear = (year: AcademicYear) => {
    return year.semesters.reduce((total, semester) => total + semester.files.length, 0);
  };

  if (selectedSemester) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={goBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{selectedSemester.semester.name}</h2>
            <p className="text-muted-foreground">{selectedSemester.year.name}</p>
          </div>
        </div>

        {/* File Upload */}
        <FileUpload onUpload={handleFileUpload} />

        {/* Files List */}
        <FileViewer
          files={selectedSemester.semester.files}
          onDelete={handleFileDelete}
          onDownload={handleFileDownload}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Notes & Documents</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Organize your study materials by year and semester
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary/10 p-4 rounded-lg text-center">
          <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold">{getTotalFiles()}</p>
          <p className="text-sm text-muted-foreground">Total Files</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {academicYears.length}
          </div>
          <p className="text-sm text-muted-foreground">Academic Years</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">
            {academicYears.reduce((total, year) => total + year.semesters.length, 0)}
          </div>
          <p className="text-sm text-muted-foreground">Semesters</p>
        </div>
      </div>

      {/* Academic Years */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Academic Years</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {academicYears.map((year) => (
            <Card key={year.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {expandedYears.has(year.id) ? (
                      <FolderOpen className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Folder className="h-5 w-5 text-blue-500" />
                    )}
                    {year.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {getTotalFilesInYear(year)} files
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleYear(year.id)}
                      className="p-1"
                    >
                      {expandedYears.has(year.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {expandedYears.has(year.id) && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {year.semesters.map((semester) => (
                      <Button
                        key={semester.id}
                        variant="ghost"
                        className="w-full justify-between p-3 h-auto"
                        onClick={() => selectSemester(year, semester)}
                      >
                        <div className="flex items-center gap-2">
                          <Folder className="h-4 w-4 text-amber-500" />
                          <span>{semester.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {semester.files.length} files
                          </span>
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};