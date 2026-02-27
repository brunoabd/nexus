"use client";

import { Project } from "../../lib/types/project.types";

const columns: Array<Project["status"]> = ["todo", "in_progress", "done"];

type Props = {
  projects: Project[];
};

export function ProjectKanban({ projects }: Props) {
  return (
    <div className="kanban-grid">
      {columns.map((column) => (
        <section key={column} className="kanban-column">
          <h3>{column}</h3>
          {projects
            .filter((project) => project.status === column)
            .map((project) => (
              <article key={project.id} className="kanban-card">
                <strong>{project.name}</strong>
                <p>{project.description}</p>
              </article>
            ))}
        </section>
      ))}
    </div>
  );
}
