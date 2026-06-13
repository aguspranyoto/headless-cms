'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateProject } from '@/hooks/useProjects';
import { useQuery } from '@tanstack/react-query';
import { usersApi, categoriesApi } from '@/lib/api';
import { RichEditor } from '@/components/RichEditor';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function NewProjectPage() {
  const router = useRouter();
  const createProject = useCreateProject();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [published, setPublished] = useState(false);
  const [authorId, setAuthorId] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const { data: users } = useQuery({
    queryKey: ['users', 1, 100],
    queryFn: () => usersApi.list({ page: 1, limit: 100 }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories', 1, 100],
    queryFn: () => categoriesApi.list({ page: 1, limit: 100 }),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject.mutateAsync({
        title,
        slug,
        content,
        excerpt: excerpt || undefined,
        published,
        authorId,
        categoryId: categoryId || undefined,
      });
      toast.success('Project created!');
      router.push('/admin/projects');
    } catch {
      toast.error('Failed to create project');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <Button variant="outline" onClick={() => router.push('/admin/projects')}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
                    }}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <RichEditor content={content} onChange={setContent} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                <Button type="submit" className="w-full" disabled={createProject.isPending}>
                  {createProject.isPending ? 'Saving...' : 'Save Project'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    className="font-mono text-sm"
                  />
                </div>
                
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

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">No category</option>
                    {categories?.data?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
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
