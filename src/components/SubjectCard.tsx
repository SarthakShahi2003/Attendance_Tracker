import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Subject } from '@/types/attendance';
import { 
  Check, 
  X, 
  Trash2, 
  Edit3, 
  Save, 
  AlertTriangle, 
  CheckCircle, 
  Target 
} from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
  onMarkPresent: (id: string) => void;
  onMarkAbsent: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Subject>) => void;
}

export const SubjectCard = ({ 
  subject, 
  onMarkPresent, 
  onMarkAbsent, 
  onDelete, 
  onUpdate 
}: SubjectCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(subject.name);
  const [editTarget, setEditTarget] = useState(subject.target);

  const attendancePercentage = subject.total > 0 ? (subject.present / subject.total) * 100 : 0;
  const isAboveTarget = attendancePercentage >= subject.target;
  
  // Calculate safe bunks
  const calculateSafeBunks = () => {
    if (subject.total === 0) return 0;
    const requiredPresent = Math.ceil(subject.target / 100 * subject.total);
    const currentPresent = subject.present;
    
    if (currentPresent >= requiredPresent) {
      // Can safely bunk some classes
      const maxTotal = Math.floor(currentPresent / (subject.target / 100));
      return Math.max(0, maxTotal - subject.total);
    }
    return 0;
  };

  // Calculate required attendance
  const calculateRequiredAttendance = () => {
    if (subject.total === 0) return 0;
    const requiredPresent = Math.ceil(subject.target / 100 * (subject.total + 1));
    const currentPresent = subject.present;
    return Math.max(0, requiredPresent - currentPresent);
  };

  const safeBunks = calculateSafeBunks();
  const requiredAttendance = calculateRequiredAttendance();

  const handleSave = () => {
    if (editName.trim()) {
      onUpdate(subject.id, { name: editName.trim(), target: editTarget });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditName(subject.name);
    setEditTarget(subject.target);
    setIsEditing(false);
  };

  const getStatusColor = () => {
    if (attendancePercentage >= subject.target) return 'success';
    if (attendancePercentage >= subject.target - 10) return 'warning';
    return 'destructive';
  };

  const getStatusIcon = () => {
    if (attendancePercentage >= subject.target) return <CheckCircle className="h-4 w-4" />;
    if (attendancePercentage >= subject.target - 10) return <AlertTriangle className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1"
                placeholder="Subject name"
              />
              <Input
                type="number"
                value={editTarget}
                onChange={(e) => setEditTarget(Number(e.target.value))}
                className="w-20"
                min="1"
                max="100"
              />
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{subject.name}</CardTitle>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {subject.target}%
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(subject.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Attendance Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Present</p>
            <p className="text-2xl font-bold text-green-600">{subject.present}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{subject.total}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Percentage</p>
            <p className="text-2xl font-bold">{attendancePercentage.toFixed(1)}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Progress</span>
            <Badge variant={getStatusColor() as any} className="flex items-center gap-1">
              {getStatusIcon()}
              {isAboveTarget ? 'On Track' : 'Below Target'}
            </Badge>
          </div>
          <Progress value={attendancePercentage} className="h-2" />
        </div>

        {/* Safe Bunks / Required Attendance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isAboveTarget && safeBunks > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                Safe Bunks
              </p>
              <p className="text-lg font-bold text-green-800 dark:text-green-200">
                {safeBunks} classes
              </p>
            </div>
          )}
          
          {!isAboveTarget && requiredAttendance > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                Need to Attend
              </p>
              <p className="text-lg font-bold text-red-800 dark:text-red-200">
                {requiredAttendance} more classes
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => onMarkPresent(subject.id)}
            className="flex-1"
            size="lg"
          >
            <Check className="h-4 w-4 mr-2" />
            Present
          </Button>
          <Button
            onClick={() => onMarkAbsent(subject.id)}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            <X className="h-4 w-4 mr-2" />
            Absent
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};