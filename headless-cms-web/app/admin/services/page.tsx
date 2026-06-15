import { ServicesClient } from './ServicesClient';

export default async function ServicesPage() {
  let initialData = undefined;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/Services?page=1&limit=10`,
      { cache: 'no-store' },
    );
    if (res.ok) {
      initialData = await res.json();
    }
  } catch {
    // API not available during build — client will fetch
  }

  return <ServicesClient initialPage={1} initialData={initialData} />;
}
