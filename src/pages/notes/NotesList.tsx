import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { notesService } from '@/services/notesService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, StickyNote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Note = {
  id: string;
  title: string | null;
  content: string | null;
  tags: string[] | null;
  color: string | null;
  is_archived: boolean | null;
  updated_at: string;
};

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  const loadNotes = async () => {
    try {
      const data = await notesService.getNotes(user!.id, { archived: false });
      setNotes(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load notes',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter(note =>
    (note.title?.toLowerCase().includes(search.toLowerCase()) || false) ||
    (note.content?.toLowerCase().includes(search.toLowerCase()) || false)
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
              Quick Notes
            </h1>
            <p className="text-muted-foreground mt-2">Capture your thoughts and ideas</p>
          </div>
          <Button onClick={() => navigate('/notes/create')} size="lg" className="shadow-lg">
            <Plus className="mr-2 h-5 w-5" />
            New Note
          </Button>
        </div>

        <Card className="mb-6 border-2 shadow-lg">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <StickyNote className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No notes found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <Card 
                key={note.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/notes/edit/${note.id}`)}
              >
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-1">
                    {note.title || 'Untitled'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {note.content || 'No content'}
                  </p>
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {note.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-3">
                    {new Date(note.updated_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
