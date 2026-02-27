export type ProjectStatus = "todo" | "in_progress" | "done";

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
};
