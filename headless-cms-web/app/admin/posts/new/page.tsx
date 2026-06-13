'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreatePost } from '@/hooks/usePosts';
import { useQuery } from '@tanstack/react-query';
import { usersApi, categoriesApi } from '@/lib/api';
import { RichEditor } from '@/components/RichEditor';
import toast from 'react-hot-toast';

export default function NewPostPage() {
  const router = useRouter();
  const createPost = useCreatePost();

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
      await createPost.mutateAsync({
        title,
        slug,
        content,
        excerpt: excerpt || undefined,
        published,
        authorId,
        categoryId: categoryId || undefined,
      });
      toast.success('Post created!');
      router.push('/admin/posts');
    } catch {
      toast.error('Failed to create post');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
            }}
            className="w-full border rounded px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm font-mono"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Author</label>
          <select
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
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
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">No category</option>
            {categories?.data?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Published
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <RichEditor content={content} onChange={setContent} />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={createPost.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {createPost.isPending ? 'Creating...' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/posts')}
            className="px-4 py-2 border rounded text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
