'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUpdateExperience, useDeleteExperience } from '@/hooks/useExperiences';
import { useQuery } from '@tanstack/react-query';
import { experiencesApi } from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EditExperiencePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const updateExperience = useUpdateExperience();
  const deleteExperience = useDeleteExperience();

  const [year, setYear] = useState('');
  const [roleField, setRoleField] = useState('');
  const [company, setCompany] = useState('');
  const [desc, setDesc] = useState('');
  const [stacksStr, setStacksStr] = useState('');
  const [published, setPublished] = useState(false);

  const { data: experience, isLoading } = useQuery({
    queryKey: ['experience', id],
    queryFn: () => experiencesApi.get(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (experience) {
      setYear(experience.year);
      setRoleField(experience.role);
      setCompany(experience.company);
      setDesc(experience.desc ?? '');
      setStacksStr(experience.stacks?.join(', ') ?? '');
      setPublished(experience.published);
    }
  }, [experience]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const stacks = stacksStr.split(',').map(s => s.trim()).filter(Boolean);
      await updateExperience.mutateAsync({
        id,
        data: {
          year,
          role: roleField,
          company,
          desc: desc || undefined,
          stacks: stacks.length > 0 ? stacks : undefined,
          published,
        },
      });
      toast.success('Experience updated!');
      router.push('/admin/experiences');
    } catch {
      toast.error('Failed to update experience');
    }
  };

  const handleDelete = async () => {
    if (confirm('Delete this experience?')) {
      try {
        await deleteExperience.mutateAsync(id);
        toast.success('Experience deleted');
        router.push('/admin/experiences');
      } catch {
        toast.error('Failed to delete experience');
      }
    }
  };

  if (isLoading) return <div className="text-muted-foreground p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Experience</h1>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="outline" onClick={() => router.push('/admin/experiences')}>
            Cancel
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={roleField}
                    onChange={(e) => setRoleField(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <textarea
                    id="desc"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stacks">Tech Stacks (comma separated)</Label>
                  <Input
                    id="stacks"
                    value={stacksStr}
                    onChange={(e) => setStacksStr(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
                <Button type="submit" className="w-full" disabled={updateExperience.isPending}>
                  {updateExperience.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
