"use client";
import type { Project } from "@/lib/types";
import { formatCredits } from "@/lib/types";
import { DashboardCard } from "./DashboardCard";

export function CommunityProjects({
  projects,
  userId,
  onCreate,
  onContribute,
  onCloseProject,
}: {
  projects: Project[];
  userId: string;
  onCreate: () => void;
  onContribute: (project: Project) => void;
  onCloseProject: (project: Project) => void;
}) {
  return (
    <DashboardCard
      title="Community projects"
      eyebrow="Volunteer hours"
      onAdd={onCreate}
      addLabel="Start a project"
    >
      <p className="-mt-2 mb-4 text-sm text-slate-600">
        Log volunteer time to show collective progress. Project hours do not add
        credits to personal balances.
      </p>
      {projects.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
          No projects yet. Start one around something your neighbors want to
          build.
        </p>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const progress = project.goal_minutes
              ? Math.min(
                  100,
                  (100 * project.current_minutes) / project.goal_minutes,
                )
              : 0;
            return (
              <article
                key={project.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="rounded-full bg-teal-50 px-2 py-1 text-[.68rem] font-bold text-teal-800">
                      {project.category}
                    </span>
                    <h3 className="mt-2 font-bold">{project.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {project.description}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${project.active ? "bg-green-50 text-green-800" : "bg-slate-100 text-slate-600"}`}
                  >
                    {project.active ? "Open" : "Closed"}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>
                      {formatCredits(project.current_minutes)} /{" "}
                      {formatCredits(project.goal_minutes)} hours
                    </span>
                    <span>{project.contributor_count} contributors</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-teal-600"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                {project.active && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => onContribute(project)}
                      className="button-primary"
                    >
                      Log volunteer hours
                    </button>
                    {project.owner_id === userId && (
                      <button
                        onClick={() => onCloseProject(project)}
                        className="button-secondary"
                      >
                        Close project
                      </button>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </DashboardCard>
  );
}
