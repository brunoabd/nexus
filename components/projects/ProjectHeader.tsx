"use client";

type Props = {
  view: "list" | "kanban";
  onChangeView: (view: "list" | "kanban") => void;
};

export function ProjectHeader({ view, onChangeView }: Props) {
  return (
    <header className="projects-header">
      <h1>Projetos</h1>
      <div className="view-toggle">
        <button className={view === "list" ? "active" : ""} onClick={() => onChangeView("list")}>
          Lista
        </button>
        <button className={view === "kanban" ? "active" : ""} onClick={() => onChangeView("kanban")}>
          Kanban
        </button>
      </div>
    </header>
  );
}
