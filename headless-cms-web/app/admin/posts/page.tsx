import { PostsClient } from './PostsClient';

export default async function PostsPage() {
  let initialData = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/posts?page=1&limit=10`,
      { cache: 'no-store' },
    );
    if (res.ok) {
      initialData = await res.json();
    }
  } catch {
    // API not available during build — client will fetch
  }

  return <PostsClient initialPage={1} initialData={initialData} />;
}
