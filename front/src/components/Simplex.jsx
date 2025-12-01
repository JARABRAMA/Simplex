import { SimplexSolution } from "./SimplexSolution";
import { SimplexProblem } from "./SimplexProblem";
import { SimplexDialog } from "./LoadingDialog";
import { useProblem } from "../hooks/useProblem";

export function Simplex() {
  const {
    setEquations,
    setVariables,
    equations,
    variables,
    refMatrix,
    refDialog,
    refObjetiveFunction,
    handleGetMatrixInputs,
    handleToggleType,
    type,
    error,
    setError,
  } = useProblem();

  return (
    <>
      <SimplexProblem
        equations={equations}
        setEquations={(equations) => setEquations(equations)}
        setVariables={(variables) => setVariables(variables)}
        variables={variables}
        refMatrix={refMatrix}
        refObjetiveFunction={refObjetiveFunction}
        handleGetMatrixInputs={handleGetMatrixInputs}
        handleToggleType={handleToggleType}
        type={type}
      />

      <SimplexSolution />

      <dialog ref={refDialog}>
        <SimplexDialog
          error={error}
          handleClearError={() => {
            refDialog.current.close();
            setError(null);
          }}
        />
      </dialog>
    </>
  );
}
