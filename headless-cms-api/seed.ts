import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from './src/common/database/schema';
import { services } from './src/common/database/schema/services.schema';
import { experiences } from './src/common/database/schema/experiences.schema';

const servicesData = [
  {
    icon: "Code2",
    title: "Web Development",
    desc: "Building scalable, high-performance web applications using Next.js, React, and Node.",
  },
  {
    icon: "Smartphone",
    title: "React Native Development",
    desc: "Creating cross-platform mobile apps with React Native, focusing on smooth UI and native performance.",
  },
  {
    icon: "Paintbrush",
    title: "Figma to Code",
    desc: "Converting Figma designs into pixel-perfect, responsive HTML/CSS and React components.",
  },
  {
    icon: "Rocket",
    title: "Performance Optimization",
    desc: "Improving web app performance through code splitting, lazy loading, and efficient state management.",
  },
];

const experiencesData = [
  {
    year: "Sept 2025 - Present",
    role: "Frontend Developer — Contract",
    company: "PT Indocyber Global Teknologi",
    stacks: [
      "Next.js",
      "Material UI",
      "TanStack Query",
      "Zustand",
      "React Hook Form",
      "Zod",
      "TypeScript",
    ],
    desc: "Project: Satu Wings (Wings Group). Contributed as a frontend developer using Next.js 15, Material UI, Zustand, TanStack Query, React Hook Form, Zod, and TypeScript within a multi-zone / micro-frontend architecture. Built reusable UI components, worked with CI/CD and Git-based workflows, and integrated REST APIs with backend teams.",
  },
  {
    year: "Jun 2024 - Sept 2025",
    role: "Frontend Developer — Full time",
    company: "PT Global Indonesia Asia Sejahtera",
    stacks: [
      "Next.js",
      "Nuxt.js",
      "Laravel",
      "React Flow",
      "NextAuth",
      "TanStack Table",
      "Prisma",
      "MongoDB",
      "Shadcn UI",
      "Tailwind CSS",
    ],
    desc: "Built documentation and profile websites using Next.js 15, Nuxt.js, Laravel, React Flow, NextAuth v5, TanStack Table, Prisma, MongoDB, Shadcn UI, and Tailwind CSS with role-based access control. Converted Figma designs to responsive UIs, implemented SPA/SSR patterns, improved production performance, and used Docker (Laradock), Ubuntu, Jira, and Git/GitLab workflows.",
  },
  {
    year: "Jan 2024 - Apr 2024",
    role: "Junior Frontend Engineer — Contract",
    company: "PT Summit Global Teknologi",
    stacks: ["Vue.js", "Nuxt.js", "SCSS", "Swiper.js", "ScrollMagic"],
    desc: "Worked on responsive front-end projects using Vue.js/Nuxt and SCSS; converted Photoshop designs into HTML/SCSS, implemented animations with Swiper.js and ScrollMagic, and collaborated via Git for version control.",
  },
  {
    year: "Jul 2022 - Dec 2022",
    role: "Front End Engineering — Intern",
    company: "PT Surya Citra Media",
    stacks: ["Vue.js 3", "Vuexy", "Laravel 9"],
    desc: "Contributed to the SCM Hub project: installed VPN tools to access repos, cloned and redesigned the project, and developed frontend views using Vue.js 3 and Laravel 9.",
  },
  {
    year: "Apr 2022 - Jun 2022",
    role: "Web Developer — Intern",
    company: "PT Sugity Creatives",
    stacks: ["CodeIgniter 3", "Bootstrap", "XAMPP"],
    desc: "Designed and tested a Truck Arrival Monitoring website using CodeIgniter 3, installed XAMPP for local dev, and created QR codes for driver scanning workflows.",
  },
];

async function seed() {
  const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/headless_cms';
  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);

  console.log('Seeding data...');
  
  // Find a user
  const userList = await db.select().from(users).limit(1);
  if (userList.length === 0) {
    console.error('No users found in database. Cannot seed.');
    process.exit(1);
  }
  const authorId = userList[0].id;

  // Insert services
  for (const s of servicesData) {
    const slug = s.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    await db.insert(services).values({
      title: s.title,
      slug,
      desc: s.desc,
      icon: s.icon,
      published: true,
      authorId,
    }).onConflictDoNothing();
  }

  // Insert experiences
  for (const e of experiencesData) {
    await db.insert(experiences).values({
      year: e.year,
      role: e.role,
      company: e.company,
      desc: e.desc,
      stacks: e.stacks,
      published: true,
      authorId,
    }).onConflictDoNothing();
  }

  console.log('Seed completed successfully!');
  await sql.end();
}

seed().catch(console.error);
