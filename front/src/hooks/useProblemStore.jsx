import { create } from "zustand";

export const useProblemStore = create((set) => ({
  A: null,
  b: null,
  c: null,
  type: null,
  restrictions: null,

  setProblem: (problem) => set({ ...problem }),

  resetProblem: () =>
    set({
      restrictionsMatrix: null,
      resourcesVector: null,
      objetiveFunctionVector: null,
      type: null,
      typeRestrictions: null,
    }),
}));
