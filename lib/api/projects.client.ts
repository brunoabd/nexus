import { Project } from "../types/project.types";

const mockProjects: Project[] = [
  {
    id: "p1",
    name: "NEXUS MVP",
    description: "Fluxo principal do chat",
    status: "in_progress",
  },
  {
    id: "p2",
    name: "Dashboard Inicial",
    description: "Estrutura base do front-end",
    status: "todo",
  },
  {
    id: "p3",
    name: "Release Alpha",
    description: "Preparar entrega para validação",
    status: "done",
  },
];

export async function getProjects(): Promise<Project[]> {
  return Promise.resolve(mockProjects);
}
