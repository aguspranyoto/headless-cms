'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateExperience } from '@/hooks/useExperiences';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function NewExperiencePage() {
  const router = useRouter();
  const createExperience = useCreateExperience();

  const [year, setYear] = useState('');
  const [roleField, setRoleField] = useState('');
  const [company, setCompany] = useState('');
  const [desc, setDesc] = useState('');
  const [stacksStr, setStacksStr] = useState('');
  const [published, setPublished] = useState(false);
  const [authorId, setAuthorId] = useState('');

  const { data: users } = useQuery({
    queryKey: ['users', 1, 100],
    queryFn: () => usersApi.list({ page: 1, limit: 100 }),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const stacks = stacksStr.split(',').map(s => s.trim()).filter(Boolean);
      await createExperience.mutateAsync({
        year,
        role: roleField,
        company,
        desc: desc || undefined,
        stacks: stacks.length > 0 ? stacks : undefined,
        published,
        authorId,
      });
      toast.success('Experience created!');
      router.push('/admin/experiences');
    } catch {
      toast.error('Failed to create Experience');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create New Experience</h1>
        <Button variant="outline" onClick={() => router.push('/admin/experiences')}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year (e.g. 2021-Present)</Label>
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
                    placeholder="React, Node.js, Go"
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
                  <Label htmlFor="published">Publish immediately</Label>
                </div>
                <Button type="submit" className="w-full" disabled={createExperience.isPending}>
                  {createExperience.isPending ? 'Saving...' : 'Save Experience'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <select
                    id="author"
                    value={authorId}
                    onChange={(e) => setAuthorId(e.target.value)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select author...</option>
                    {users?.data?.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.username}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
