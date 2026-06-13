'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUpdatePost, useDeletePost } from '@/hooks/usePosts';
import { useQuery } from '@tanstack/react-query';
import { postsApi, usersApi, categoriesApi } from '@/lib/api';
import { RichEditor } from '@/components/RichEditor';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [published, setPublished] = useState(false);
  const [categoryId, setCategoryId] = useState('');

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postsApi.get(id),
    enabled: !!id,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories', 1, 100],
    queryFn: () => categoriesApi.list({ page: 1, limit: 100 }),
  });

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setSlug(post.slug);
      setContent(post.content);
      setExcerpt(post.excerpt ?? '');
      setPublished(post.published);
      setCategoryId(post.categoryId ?? '');
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePost.mutateAsync({
        id,
        data: {
          title,
          slug,
          content,
          excerpt: excerpt || undefined,
          published,
          categoryId: categoryId || undefined,
        },
      });
      toast.success('Post updated!');
      router.push('/admin/posts');
    } catch {
      toast.error('Failed to update post');
    }
  };

  const handleDelete = async () => {
    if (confirm('Delete this post?')) {
      try {
        await deletePost.mutateAsync(id);
        toast.success('Post deleted');
        router.push('/admin/posts');
      } catch {
        toast.error('Failed to delete post');
      }
    }
  };

  if (isLoading) return <div className="text-muted-foreground p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="outline" onClick={() => router.push('/admin/posts')}>
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
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                  <Label htmlFor="published">Published</Label>
                </div>
                <Button type="submit" className="w-full" disabled={updatePost.isPending}>
                  {updatePost.isPending ? 'Saving...' : 'Save Changes'}
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
