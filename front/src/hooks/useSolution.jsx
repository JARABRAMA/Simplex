import { create } from "zustand";

export const useSolution = create((set, store) => ({
  iterations: [],
  optimalValues: [],
  solutionValue: undefined,
  graphic: undefined,
  sensivility: undefined,
  isSolved: false,

  setSolution: (result) =>
    set(() => ({
      iterations: result.historial,
      optimalValues: result.solucion,
      solutionValue: result["Z"],
      graphic: result.grafica,
      sensivility: result.sensibuilidad,
      isSolved: true,
    })),

  resetSolution: () => {
    set(store.getInitialState);
  },
}));
