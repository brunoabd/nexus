"use client";

import { ProjectList } from "../projects/ProjectList";
import { Project } from "../../lib/types/project.types";

type TaskItem = {
  id?: string;
  title?: string;
  name?: string;
};

type Props = {
  toolName: string;
  content: unknown;
};

function renderJson(content: unknown) {
  if (typeof content === "object" && content !== null) {
    return <pre className="tool-json">{JSON.stringify(content, null, 2)}</pre>;
  }
  return <p>{String(content)}</p>;
}

export function ToolResponseRenderer({ toolName, content }: Props) {
  switch (toolName) {
    case "list_projects":
      return Array.isArray(content) ? <ProjectList projects={content as Project[]} /> : renderJson(content);
    case "list_today_tasks": {
      if (!Array.isArray(content)) return renderJson(content);

      const tasks = content as TaskItem[];
      return (
        <ul>
          {tasks.map((task, index) => (
            <li key={task.id ?? `${task.title ?? task.name ?? "task"}-${index}`}>
              {task.title ?? task.name ?? String(task)}
            </li>
          ))}
        </ul>
      );
    }
    default:
      return renderJson(content);
  }
}
