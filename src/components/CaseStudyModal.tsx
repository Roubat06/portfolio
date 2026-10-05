import React, { useEffect } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { PortfolioProject } from '../data/projects';

interface CaseStudyModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
  onAskRagAboutProject: (projectTitle: string) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  onClose,
  onAskRagAboutProject,
}) => {
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const { caseStudy } = project;
  const hasTechSection =
    caseStudy.technologies &&
    Object.values(caseStudy.technologies).some((arr) => arr && arr.length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 md:p-8 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#F4F4F0] text-[#050505] rounded-2xl border border-[#D4D4D0] p-6 md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar inside modal */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-[#E4E4E0]">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600 font-mono-tabular mb-2">
              <span>Priority 0{project.priority}</span>
              <span aria-hidden="true">·</span>
              <span>{project.category}</span>
              <span aria-hidden="true">·</span>
              <span>
                {project.verificationStatus === 'verified-full-repo'
                  ? 'Verified Source Implementation'
                  : project.verificationStatus === 'verified-partial-repo'
                  ? 'Concise Record (Public Repo Unpopulated)'
                  : 'In Development (Coming Soon)'}
              </span>
            </div>
            <h2
              id="case-study-title"
              className="text-2xl md:text-4xl font-bold tracking-tight text-[#050505]"
            >
              {project.title}
            </h2>
            <p className="mt-2 text-sm md:text-base text-neutral-700 max-w-2xl">
              {project.tagline}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close case study"
            className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#D4D4D0] text-neutral-700 hover:bg-[#050505] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-[#E4E4E0] text-xs">
          <div className="text-neutral-600 font-mono-tabular">
            {project.repoFullName ? (
              <span>Repository: {project.repoFullName}</span>
            ) : (
              <span>Repository: Private / In Development</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onAskRagAboutProject(project.title);
              }}
              className="px-4 py-2 rounded-lg border border-[#050505] text-[#050505] font-semibold hover:bg-[#050505] hover:text-white transition-colors whitespace-nowrap cursor-pointer"
            >
              Query in RAG Assistant
            </button>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] text-white font-semibold hover:bg-[#1D4ED8] transition-colors whitespace-nowrap"
              >
                <span>Inspect GitHub Source</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* 01 - 07 Structured Sections (Only rendered when verified data exists) */}
        <div className="divide-y divide-[#E4E4E0]">
          {/* 01 — Overview */}
          {caseStudy.overview && (
            <section className="py-7">
              <h3 className="text-xs font-mono-tabular font-semibold text-[#2563EB] mb-2">
                01 — Overview
              </h3>
              <p className="text-base leading-relaxed text-neutral-800 max-w-[72ch]">
                {caseStudy.overview}
              </p>
            </section>
          )}

          {/* 02 — Problem */}
          {caseStudy.problem && (
            <section className="py-7">
              <h3 className="text-xs font-mono-tabular font-semibold text-[#2563EB] mb-2">
                02 — Problem
              </h3>
              <p className="text-base leading-relaxed text-neutral-800 max-w-[72ch]">
                {caseStudy.problem}
              </p>
            </section>
          )}

          {/* 03 — Solution */}
          {caseStudy.solution && (
            <section className="py-7">
              <h3 className="text-xs font-mono-tabular font-semibold text-[#2563EB] mb-2">
                03 — Solution
              </h3>
              <p className="text-base leading-relaxed text-neutral-800 max-w-[72ch]">
                {caseStudy.solution}
              </p>
            </section>
          )}

          {/* 04 — Technical Implementation */}
          {caseStudy.technicalImplementation &&
            caseStudy.technicalImplementation.length > 0 && (
              <section className="py-7">
                <h3 className="text-xs font-mono-tabular font-semibold text-[#2563EB] mb-3">
                  04 — Technical Implementation
                </h3>
                <ul className="space-y-3">
                  {caseStudy.technicalImplementation.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm md:text-base leading-relaxed text-neutral-800 pl-4 border-l-2 border-[#D4D4D0]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

          {/* 05 — Technologies */}
          {hasTechSection && caseStudy.technologies && (
            <section className="py-7">
              <h3 className="text-xs font-mono-tabular font-semibold text-[#2563EB] mb-4">
                05 — Technologies
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {caseStudy.technologies.frontend &&
                  caseStudy.technologies.frontend.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-neutral-500 mb-1">
                        Frontend
                      </div>
                      <p className="text-sm text-neutral-900 leading-relaxed">
                        {caseStudy.technologies.frontend.join(' · ')}
                      </p>
                    </div>
                  )}
                {caseStudy.technologies.backend &&
                  caseStudy.technologies.backend.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-neutral-500 mb-1">
                        Backend
                      </div>
                      <p className="text-sm text-neutral-900 leading-relaxed">
                        {caseStudy.technologies.backend.join(' · ')}
                      </p>
                    </div>
                  )}
                {caseStudy.technologies.database &&
                  caseStudy.technologies.database.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-neutral-500 mb-1">
                        Database & Persistence
                      </div>
                      <p className="text-sm text-neutral-900 leading-relaxed">
                        {caseStudy.technologies.database.join(' · ')}
                      </p>
                    </div>
                  )}
                {caseStudy.technologies.aiAndLibraries &&
                  caseStudy.technologies.aiAndLibraries.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-neutral-500 mb-1">
                        AI Models & Core Libraries
                      </div>
                      <p className="text-sm text-neutral-900 leading-relaxed">
                        {caseStudy.technologies.aiAndLibraries.join(' · ')}
                      </p>
                    </div>
                  )}
                {caseStudy.technologies.devops &&
                  caseStudy.technologies.devops.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-neutral-500 mb-1">
                        Infrastructure & Deployment
                      </div>
                      <p className="text-sm text-neutral-900 leading-relaxed">
                        {caseStudy.technologies.devops.join(' · ')}
                      </p>
                    </div>
                  )}
              </div>
            </section>
          )}

          {/* 06 — Challenges */}
          {caseStudy.challenges && caseStudy.challenges.length > 0 && (
            <section className="py-7">
              <h3 className="text-xs font-mono-tabular font-semibold text-[#2563EB] mb-3">
                06 — Challenges
              </h3>
              <ul className="space-y-2.5">
                {caseStudy.challenges.map((challenge, idx) => (
                  <li
                    key={idx}
                    className="text-sm md:text-base leading-relaxed text-neutral-800 pl-4 border-l-2 border-neutral-300"
                  >
                    {challenge}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 07 — GitHub */}
          {caseStudy.github && (
            <section className="py-7">
              <h3 className="text-xs font-mono-tabular font-semibold text-[#2563EB] mb-3">
                07 — GitHub
              </h3>
              <div className="p-5 rounded-xl bg-[#EAEAE4] border border-[#D4D4D0]">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="text-sm font-semibold text-[#050505] font-mono-tabular">
                      {caseStudy.github.repoName} ({caseStudy.github.branch})
                    </div>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      {caseStudy.github.verificationNote}
                    </p>
                  </div>
                  <a
                    href={caseStudy.github.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline whitespace-nowrap"
                  >
                    <span>{caseStudy.github.url}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
                {caseStudy.github.structureSummary.length > 0 && (
                  <div className="space-y-1.5 pt-3 border-t border-[#D4D4D0]">
                    <div className="text-xs font-semibold text-neutral-600 mb-2">
                      Inspected Repository Structure:
                    </div>
                    {caseStudy.github.structureSummary.map((line, i) => (
                      <div
                        key={i}
                        className="text-xs font-mono-tabular text-neutral-800 leading-relaxed"
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
