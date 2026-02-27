"use client";

import { Project } from "../../lib/types/project.types";

type Props = {
  projects: Project[];
};

export function ProjectList({ projects }: Props) {
  return (
    <ul className="project-list">
      {projects.map((project) => (
        <li key={project.id}>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <small>Status: {project.status}</small>
        </li>
      ))}
    </ul>
  );
}
