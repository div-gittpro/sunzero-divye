import { useState, Dispatch, SetStateAction } from 'react';
import { Check, Clock, Calendar, FileText, Lock, ChevronDown, ChevronUp, Construction } from 'lucide-react';
import { InstallationStep } from '../types';

interface InstallationViewProps {
  steps: InstallationStep[];
  setSteps: Dispatch<SetStateAction<InstallationStep[]>>;
}

export default function InstallationView({ steps, setSteps }: InstallationViewProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>('step-2');

  const toggleStep = (id: string) => {
    setExpandedStep(expandedStep === id ? null : id);
  };

  // Callback to allow checking-off or toggling simulated installation stages
  const advanceStepStatus = (id: string, newStatus: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING') => {
    setSteps((prev) =>
      prev.map((step) => {
        if (step.id === id) {
          return { ...step, status: newStatus };
        }
        return step;
      })
    );
  };

  return (
    <div id="installation-view-container" className="space-y-8 animate-fade-in text-wrap">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Installation Progress</h2>
          <p className="text-sm text-secondary mt-1">
            Real-time construction scheduling, regulatory approvals, and interconnection timelines.
          </p>
        </div>
      </section>

      {/* Main Grid: Interactive Checklist stepper & document tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step checklist details */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-8 hover:shadow-lg transition-all space-y-4">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 mb-2">
            <Construction className="w-5 h-5 text-primary" /> Core Project Gantt Stepper
          </h3>

          <div className="space-y-2">
            {steps.map((step, idx) => {
              const isCompleted = step.status === 'COMPLETED';
              const isInProgress = step.status === 'IN_PROGRESS';
              const isPending = step.status === 'PENDING';
              const isExpanded = expandedStep === step.id;

              return (
                <div
                  key={step.id}
                  className={`border rounded-xl transition-all ${
                    isExpanded ? 'border-primary bg-neutral-50/20' : 'border-outline-variant bg-white'
                  }`}
                >
                  {/* Stepper Header */}
                  <div
                    onClick={() => toggleStep(step.id)}
                    className="flex justify-between items-center p-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-4">
                      {/* Interactive visual bullet dot indicators */}
                      {isCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white stroke-[3.5]" />
                        </div>
                      ) : isInProgress ? (
                        <div className="w-6 h-6 rounded-full bg-[#ffdbcc] border-2 border-primary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300" />
                      )}

                      <div>
                        <span className="text-xs font-bold text-[#7a3000] uppercase block">
                          Step {idx + 1}
                        </span>
                        <h4 className="text-sm font-extrabold text-on-surface">{step.title}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                          isCompleted
                            ? 'bg-orange-50 text-primary'
                            : isInProgress
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-gray-100 text-secondary'
                        }`}
                      >
                        {step.status}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-secondary" /> : <ChevronDown className="w-4 h-4 text-secondary" />}
                    </div>
                  </div>

                  {/* Accordion body panels */}
                  {isExpanded && (
                    <div className="p-4 border-t border-outline-variant bg-white rounded-b-xl space-y-3 text-xs animate-fade-in">
                      <p className="text-secondary leading-relaxed">{step.description}</p>
                      
                      {/* Nested detailed checkpoints list */}
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <span className="font-extrabold text-[10px] text-secondary uppercase tracking-wider block">
                          Step Milestones Checklist:
                        </span>
                        <ul className="space-y-1.5 text-secondary">
                          {step.details.map((detail, dIdx) => (
                            <li key={dIdx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Interactive test overrides */}
                      <div className="flex justify-end gap-3 pt-2">
                        {isPending && (
                          <button
                            onClick={() => advanceStepStatus(step.id, 'IN_PROGRESS')}
                            className="bg-[#ffdbcc]/15 text-primary border border-primary/20 hover:bg-orange-100/30 px-3 py-1.5 rounded text-[10px] font-extrabold cursor-pointer"
                          >
                            Mark as In Progress
                          </button>
                        )}
                        {(isInProgress || isPending) && (
                          <button
                            onClick={() => advanceStepStatus(step.id, 'COMPLETED')}
                            className="bg-primary text-white hover:bg-orange-850 px-3 py-1.5 rounded text-[10px] font-extrabold cursor-pointer"
                          >
                            Mark Complete
                          </button>
                        )}
                        {isCompleted && (
                          <p className="text-emerald-600 font-extrabold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Stage Fully Vested
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Construction Details sidebar panel */}
        <div id="construction-docs-panel" className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-4 hover:shadow-lg transition-all text-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 border-b border-outline-variant pb-2">
              <FileText className="w-4 h-4 text-primary" /> Active Site Documents
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-orange-50/20 transition-colors cursor-pointer">
                <div>
                  <p className="font-semibold text-on-surface">Structural_Audit_R0.pdf</p>
                  <span className="text-[9px] text-secondary">2.4 MB · Site Clearance approved</span>
                </div>
                <Clock className="w-4 h-4 text-emerald-600" />
              </div>

              <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-orange-50/20 transition-colors cursor-pointer">
                <div>
                  <p className="font-semibold text-on-surface">Rooftop_Photogram_Blueprint.dwg</p>
                  <span className="text-[9px] text-secondary">15.8 MB · Engineering CAD</span>
                </div>
                <Clock className="w-4 h-4 text-emerald-600" />
              </div>

              <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center opacity-60">
                <div>
                  <p className="font-semibold text-on-surface">Grid_Net_Inter_Signed_Permit.pdf</p>
                  <span className="text-[9px] text-secondary font-medium">Locked until Meter Interconnect completes</span>
                </div>
                <Lock className="w-4 h-4 text-secondary" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-orange-50/50 rounded-xl border border-primary/10 mt-6 select-none font-medium leading-relaxed">
            Need urgent assistance with physical installation staging or mounting equipment? Reach out to our physical crew instantly via the <strong>Support</strong> tab!
          </div>
        </div>
      </div>
    </div>
  );
}
