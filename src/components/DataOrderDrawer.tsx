import React from 'react';
import { ArrowDown, ArrowUp, RotateCcw, X } from 'lucide-react';
import { PortfolioProject } from '../data/projects';

interface DataOrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: PortfolioProject[];
  onMovePriority: (projectId: string, direction: 'up' | 'down') => void;
  onToggleFeatured: (projectId: string) => void;
  onToggleComingSoonVisibility: (projectId: string) => void;
  onResetDefault: () => void;
}

export const DataOrderDrawer: React.FC<DataOrderDrawerProps> = ({
  isOpen,
  onClose,
  projects,
  onMovePriority,
  onToggleFeatured,
  onToggleComingSoonVisibility,
  onResetDefault,
}) => {
  if (!isOpen) return null;

  const sorted = [...projects].sort((a, b) => a.priority - b.priority);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="data-config-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#F4F4F0] text-[#050505] h-full overflow-y-auto p-6 md:p-8 border-l border-[#D4D4D0] flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#D4D4D0]">
            <div>
              <div className="text-xs font-mono-tabular text-neutral-600 mb-1">
                Data-Driven Portfolio Schema · src/data/projects.ts
              </div>
              <h2 id="data-config-title" className="text-2xl font-bold tracking-tight">
                Project Display Order & Status Configuration
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                The portfolio layout is strictly driven by structured project objects (id, title, featured, priority, status). Reorder priorities or explicitly toggle coming-soon projects below.
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close configuration drawer"
              className="p-2 rounded-lg border border-[#D4D4D0] hover:bg-[#050505] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-tabular text-neutral-600">
              {sorted.filter((p) => p.status === 'completed').length} Active Completed ·{' '}
              {sorted.filter((p) => p.status === 'coming-soon').length} Hidden Coming-Soon
            </span>
            <button
              onClick={onResetDefault}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#D4D4D0] hover:border-[#050505] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default Order</span>
            </button>
          </div>

          {/* Structured Table of All Projects */}
          <div className="divide-y divide-[#E4E4E0] border border-[#D4D4D0] rounded-xl bg-white overflow-hidden">
            {sorted.map((proj, idx) => (
              <div
                key={proj.id}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  proj.status === 'coming-soon' ? 'opacity-65 bg-[#F9F9F6]' : ''
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono-tabular text-neutral-500">
                    <span>priority: {proj.priority}</span>
                    <span>·</span>
                    <span>id: "{proj.id}"</span>
                    <span>·</span>
                    <span>status: "{proj.status}"</span>
                  </div>
                  <div className="text-sm font-bold text-[#050505]">{proj.title}</div>
                  <div className="text-xs text-neutral-600 font-mono-tabular">
                    featured: {String(proj.featured)} ·{' '}
                    {proj.repoFullName ? `repo: ${proj.repoFullName}` : 'Hidden Future Project'}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onMovePriority(proj.id, 'up')}
                    disabled={idx === 0}
                    aria-label={`Move ${proj.title} priority up`}
                    className="p-2 rounded-lg border border-[#D4D4D0] hover:border-[#050505] disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMovePriority(proj.id, 'down')}
                    disabled={idx === sorted.length - 1}
                    aria-label={`Move ${proj.title} priority down`}
                    className="p-2 rounded-lg border border-[#D4D4D0] hover:border-[#050505] disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {proj.status === 'completed' && (
                    <button
                      type="button"
                      onClick={() => onToggleFeatured(proj.id)}
                      className={`px-3 py-1.5 text-xs font-mono-tabular rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                        proj.featured
                          ? 'bg-[#050505] text-white border-[#050505]'
                          : 'bg-transparent text-neutral-700 border-[#D4D4D0] hover:border-[#050505]'
                      }`}
                    >
                      featured: {String(proj.featured)}
                    </button>
                  )}

                  {proj.tier === 'future' && (
                    <button
                      type="button"
                      onClick={() => onToggleComingSoonVisibility(proj.id)}
                      className={`px-3 py-1.5 text-xs font-mono-tabular rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                        proj.status === 'completed'
                          ? 'bg-[#2563EB] text-white border-[#2563EB]'
                          : 'bg-transparent text-neutral-700 border-[#D4D4D0] hover:border-[#050505]'
                      }`}
                    >
                      {proj.status === 'coming-soon' ? 'Hidden (Enable)' : 'Enabled (Hide)'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-[#D4D4D0] text-xs font-mono-tabular text-neutral-600">
          Default order: 1. Striveda · 2. v0-commerce-student-platform · 3. LifeCoachX · 4. Sonor · 5. TamperLock
        </div>
      </div>
    </div>
  );
};
