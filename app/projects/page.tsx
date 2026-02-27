"use client";

import { useEffect, useState } from "react";
import { ProjectHeader } from "../../components/projects/ProjectHeader";
import { ProjectKanban } from "../../components/projects/ProjectKanban";
import { ProjectList } from "../../components/projects/ProjectList";
import { getProjects } from "../../lib/api/projects.client";
import { Project } from "../../lib/types/project.types";

export default function ProjectsPage() {
  const [view, setView] = useState<"list" | "kanban">("list");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  return (
    <main className="page-shell projects-page">
      <ProjectHeader view={view} onChangeView={setView} />
      {view === "list" ? <ProjectList projects={projects} /> : <ProjectKanban projects={projects} />}
    </main>
  );
}
