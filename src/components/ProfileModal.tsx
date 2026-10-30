import React, { useState } from 'react';
import { UserProfile, VWOLevel, VWOProfile } from '../types';
import { VWO_SUBJECTS } from '../data/vwoData';
import { X, Check, GraduationCap, Compass, BookOpen } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [level, setLevel] = useState<VWOLevel>(profile.level);
  const [vwoProfile, setVwoProfile] = useState<VWOProfile>(profile.profile);
  const [favoriteSubjects, setFavoriteSubjects] = useState<string[]>(profile.favoriteSubjects);

  if (!isOpen) return null;

  const toggleSubject = (name: string) => {
    if (favoriteSubjects.includes(name)) {
      setFavoriteSubjects(favoriteSubjects.filter((s) => s !== name));
    } else {
      setFavoriteSubjects([...favoriteSubjects, name]);
    }
  };

  const handleSave = () => {
    onSave({
      level,
      profile: vwoProfile,
      favoriteSubjects,
    });
    onClose();
  };

  const levels: VWOLevel[] = ['VWO 4', 'VWO 5', 'VWO 6 (Examenjaar)'];
  const profiles: { label: VWOProfile; desc: string }[] = [
    { label: 'Natuur & Techniek (NT)', desc: 'Wiskunde B, Natuurkunde, Scheikunde' },
    { label: 'Natuur & Gezondheid (NG)', desc: 'Biologie, Scheikunde, Wiskunde A/B' },
    { label: 'Economie & Maatschappij (EM)', desc: 'Economie, Geschiedenis, Wiskunde A' },
    { label: 'Cultuur & Maatschappij (CM)', desc: 'Geschiedenis, Kunst/Filosofie, Talen' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Jouw VWO Profiel & Niveau</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Leerjaar */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              1. Leerjaar
            </label>
            <div className="grid grid-cols-3 gap-2">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    level === lvl
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Profiel */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              2. Examenprofiel
            </label>
            <div className="space-y-2">
              {profiles.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setVwoProfile(p.label)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between ${
                    vwoProfile === p.label
                      ? 'bg-indigo-50 border-indigo-600 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{p.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{p.desc}</div>
                  </div>
                  {vwoProfile === p.label && (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 ml-2">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Vakken focus */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              3. Jouw Vakkenpakket
            </label>
            <div className="grid grid-cols-2 gap-2">
              {VWO_SUBJECTS.map((sub) => {
                const isSelected = favoriteSubjects.includes(sub.name);
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => toggleSubject(sub.name)}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{sub.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Annuleren
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            Opslaan & Toepassen
          </button>
        </div>
      </div>
    </div>
  );
};
