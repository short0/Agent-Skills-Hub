import { create } from 'zustand';
import { PRESETS, Preset, Skill } from '@/lib/data';

interface StudioState {
  currentPreset: Preset | null;
  taskText: string;
  activeSkills: Skill[];
  mode: 'simulated' | 'live';
  hasRun: boolean;
  history: {
    past: Array<Partial<StudioState>>;
    future: Array<Partial<StudioState>>;
  };

  // Actions
  setPreset: (presetId: string) => void;
  setTaskText: (text: string) => void;
  toggleSkill: (skill: Skill) => void;
  setMode: (mode: 'simulated' | 'live') => void;
  runComparison: () => void;
  resetSession: () => void;
  undo: () => void;
  redo: () => void;
}

const saveState = (state: Partial<StudioState>) => {
  const { currentPreset, taskText, activeSkills, mode, hasRun } = state;
  const toSave = {
    presetId: currentPreset?.id,
    taskText,
    activeSkillIds: activeSkills?.map(s => s.id),
    mode,
    hasRun
  };
  localStorage.setItem('agent-skills-studio-state', JSON.stringify(toSave));
};

const loadState = () => {
  try {
    const saved = localStorage.getItem('agent-skills-studio-state');
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    const preset = PRESETS.find(p => p.id === parsed.presetId) || null;
    const activeSkills = preset 
      ? preset.skills.filter(s => parsed.activeSkillIds?.includes(s.id))
      : [];
      
    return {
      currentPreset: preset,
      taskText: parsed.taskText || '',
      activeSkills,
      mode: parsed.mode || 'simulated',
      hasRun: !!parsed.hasRun
    };
  } catch (e) {
    return null;
  }
};

export const useStudioStore = create<StudioState>((set, get) => {
  const initialState = loadState() || {
    currentPreset: null,
    taskText: '',
    activeSkills: [],
    mode: 'simulated',
    hasRun: false,
  };

  return {
    ...initialState,
    history: { past: [], future: [] },

    setPreset: (presetId: string) => {
      const preset = PRESETS.find(p => p.id === presetId);
      if (!preset) return;
      
      set((state) => {
        const newState = {
          currentPreset: preset,
          taskText: preset.task,
          activeSkills: [...preset.skills],
          hasRun: false
        };
        
        saveState({ ...state, ...newState });
        return {
          ...newState,
          history: {
            past: [...state.history.past, { currentPreset: state.currentPreset, taskText: state.taskText, activeSkills: state.activeSkills, hasRun: state.hasRun }],
            future: []
          }
        };
      });
    },

    setTaskText: (text: string) => {
      set((state) => {
        saveState({ ...state, taskText: text, hasRun: false });
        return {
          taskText: text,
          hasRun: false,
          history: {
            past: [...state.history.past, { taskText: state.taskText, hasRun: state.hasRun }],
            future: []
          }
        };
      });
    },

    toggleSkill: (skill: Skill) => {
      set((state) => {
        const isSelected = state.activeSkills.some(s => s.id === skill.id);
        const newSkills = isSelected 
          ? state.activeSkills.filter(s => s.id !== skill.id)
          : [...state.activeSkills, skill];
          
        saveState({ ...state, activeSkills: newSkills, hasRun: false });
        return {
          activeSkills: newSkills,
          hasRun: false,
          history: {
            past: [...state.history.past, { activeSkills: state.activeSkills, hasRun: state.hasRun }],
            future: []
          }
        };
      });
    },

    setMode: (mode: 'simulated' | 'live') => {
      set((state) => {
        saveState({ ...state, mode });
        return { mode };
      });
    },

    runComparison: () => {
      set((state) => {
        saveState({ ...state, hasRun: true });
        return {
          hasRun: true,
          history: {
            past: [...state.history.past, { hasRun: state.hasRun }],
            future: []
          }
        };
      });
    },

    resetSession: () => {
      set((state) => {
        const newState = {
          currentPreset: null,
          taskText: '',
          activeSkills: [],
          hasRun: false
        };
        saveState({ ...state, ...newState });
        return {
          ...newState,
          history: {
            past: [...state.history.past, { currentPreset: state.currentPreset, taskText: state.taskText, activeSkills: state.activeSkills, hasRun: state.hasRun }],
            future: []
          }
        };
      });
    },

    undo: () => {
      set((state) => {
        if (state.history.past.length === 0) return state;
        
        const previous = state.history.past[state.history.past.length - 1];
        const newPast = state.history.past.slice(0, -1);
        
        const currentStateSnapshot = {
          currentPreset: state.currentPreset,
          taskText: state.taskText,
          activeSkills: state.activeSkills,
          hasRun: state.hasRun
        };
        
        const newState = { ...state, ...previous };
        saveState(newState);
        
        return {
          ...newState,
          history: {
            past: newPast,
            future: [currentStateSnapshot, ...state.history.future]
          }
        };
      });
    },

    redo: () => {
      set((state) => {
        if (state.history.future.length === 0) return state;
        
        const next = state.history.future[0];
        const newFuture = state.history.future.slice(1);
        
        const currentStateSnapshot = {
          currentPreset: state.currentPreset,
          taskText: state.taskText,
          activeSkills: state.activeSkills,
          hasRun: state.hasRun
        };
        
        const newState = { ...state, ...next };
        saveState(newState);
        
        return {
          ...newState,
          history: {
            past: [...state.history.past, currentStateSnapshot],
            future: newFuture
          }
        };
      });
    }
  };
});
