import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface AddSubjectFormProps {
  onAddSubject: (name: string, target: number) => void;
}

export const AddSubjectForm = ({ onAddSubject }: AddSubjectFormProps) => {
  const [name, setName] = useState('');
  const [target, setTarget] = useState(75);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddSubject(name.trim(), target);
      setName('');
      setTarget(75);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Subject
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject-name">Subject Name</Label>
              <Input
                id="subject-name"
                type="text"
                placeholder="e.g., Mathematics, Physics"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendance-target">Target Attendance (%)</Label>
              <Input
                id="attendance-target"
                type="number"
                min="1"
                max="100"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};