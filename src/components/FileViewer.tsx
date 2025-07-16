import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  File, 
  FileText, 
  Image, 
  Download, 
  Trash2, 
  Search,
  Filter,
  Calendar,
  FileImage
} from 'lucide-react';
import { UploadedFile, FileFilter } from '@/types/notes';

interface FileViewerProps {
  files: UploadedFile[];
  onDelete: (fileId: string) => void;
  onDownload: (file: UploadedFile) => void;
}

export const FileViewer = ({ files, onDelete, onDownload }: FileViewerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fileFilter, setFileFilter] = useState<FileFilter>('all');

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <FileImage className="h-6 w-6" />;
    if (type.includes('pdf')) return <FileText className="h-6 w-6 text-red-500" />;
    if (type.includes('doc')) return <FileText className="h-6 w-6 text-blue-500" />;
    if (type.includes('presentation') || type.includes('powerpoint')) {
      return <FileText className="h-6 w-6 text-orange-500" />;
    }
    return <File className="h-6 w-6" />;
  };

  const getFileTypeColor = (type: string) => {
    if (type.includes('image')) return 'bg-green-100 text-green-800';
    if (type.includes('pdf')) return 'bg-red-100 text-red-800';
    if (type.includes('doc')) return 'bg-blue-100 text-blue-800';
    if (type.includes('presentation') || type.includes('powerpoint')) {
      return 'bg-orange-100 text-orange-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = fileFilter === 'all' || 
      (fileFilter === 'pdf' && file.type.includes('pdf')) ||
      (fileFilter === 'docx' && file.type.includes('doc')) ||
      (fileFilter === 'ppt' && file.type.includes('presentation')) ||
      (fileFilter === 'txt' && file.type.includes('text')) ||
      (fileFilter === 'image' && file.type.includes('image'));
    
    return matchesSearch && matchesFilter;
  });

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <File className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No files uploaded</h3>
        <p className="text-muted-foreground">Upload your first file to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={fileFilter}
            onChange={(e) => setFileFilter(e.target.value as FileFilter)}
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
          >
            <option value="all">All Files</option>
            <option value="pdf">PDF</option>
            <option value="docx">Documents</option>
            <option value="ppt">Presentations</option>
            <option value="txt">Text</option>
            <option value="image">Images</option>
          </select>
        </div>
      </div>

      {/* Files List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate" title={file.name}>
                      {file.name}
                    </h4>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(file.uploadDate)}
                  </span>
                  <span>{formatFileSize(file.size)}</span>
                </div>
                
                <Badge variant="secondary" className={getFileTypeColor(file.type)}>
                  {file.type.split('/').pop()?.toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDownload(file)}
                  className="flex-1"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(file.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFiles.length === 0 && files.length > 0 && (
        <div className="text-center py-8">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No files found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter</p>
        </div>
      )}
    </div>
  );
};