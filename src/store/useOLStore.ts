import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OLCharRecord, OLPart } from '../types/overload';
import { db } from '../db';

interface State {
  chars: OLCharRecord[];
  addChar(): void;
  rename(id: string, name: string): void;
  removeChar(id: string): void;
  setPart(id: string, part: OLPart): void;
  reorderChar(fromIndex: number, toIndex: number): void;
}

export const useOLStore = create<State>()(
  persist(
    (set, get) => ({
      chars: [],
      addChar: () => {
        const id = crypto.randomUUID();
        const newChar: OLCharRecord = {
          nikkeId: id,
          displayName: 'New',
          parts: {
            helm: { part: 'helm', subs: [] },
            armor: { part: 'armor', subs: [] },
            glove: { part: 'glove', subs: [] },
            boot: { part: 'boot', subs: [] },
          },
        };
        set((s) => ({ chars: [...s.chars, newChar] }));
        db.chars.put(newChar);
      },
      rename: (id, name) => {
        const chars = get().chars.map((c) =>
          c.nikkeId === id ? { ...c, displayName: name } : c
        );
        set({ chars });
        db.chars.update(id, { displayName: name });
      },
      removeChar: (id) => {
        set((s) => ({ chars: s.chars.filter((c) => c.nikkeId !== id) }));
        db.chars.delete(id);
      },
      setPart: (id, part) => {
        const chars = get().chars.map((c) =>
          c.nikkeId === id ? { ...c, parts: { ...c.parts, [part.part]: part } } : c
        );
        set({ chars });
        db.chars.get(id).then((c) => {
          if (c) db.chars.put({ ...c, parts: { ...c.parts, [part.part]: part } });
        });
      },
      reorderChar: (fromIndex, toIndex) => {
        const chars = [...get().chars];
        const [moved] = chars.splice(fromIndex, 1);
        chars.splice(toIndex, 0, moved);
        set({ chars });
      },
    }),
    { name: 'ol-local' }
  )
);
