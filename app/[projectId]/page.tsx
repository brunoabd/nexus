"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProjectDetailsPage() {
  const params = useParams<{ projectId: string }>();

  return (
    <main className="page-shell">
      <h1>Projeto: {params.projectId}</h1>
      <p>Página placeholder do projeto.</p>
      <Link href="/projects">Voltar para projetos</Link>
    </main>
  );
}
