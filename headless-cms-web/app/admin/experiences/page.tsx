import { ExperiencesClient } from './ExperiencesClient';

export default async function ExperiencesPage() {
  let initialData = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/Experiences?page=1&limit=10`,
      { cache: 'no-store' },
    );
    if (res.ok) {
      initialData = await res.json();
    }
  } catch {
    // API not available during build — client will fetch
  }

  return <ExperiencesClient initialPage={1} initialData={initialData} />;
}
