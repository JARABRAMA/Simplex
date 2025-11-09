import { useRef, useState } from "react";

import { SimplexSolution } from "./SimplexSolution";
import { SimplexProblem } from "./SimplexProblem";
import matrixStyles from "./styles/Matrix.module.css";
import objetiveStyles from "./styles/Coeficients.module.css";
import { SimplexDialog } from "./LoadingDialog";

const mapType = {
  max: "max",
  min: "min",
};

function chunkArray(array, chunkSize) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

export function Simplex() {
  const [variables, setVariables] = useState(2);
  const [equations, setEquations] = useState(2);
  const [solution, setSolution] = useState(null);
  const [type, setType] = useState(mapType.max);
  const refDialog = useRef();
  const [error, setError] = useState(null);

  const refMatrix = useRef();
  const refObjetiveFunction = useRef();

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleGetMatrixInputs = async () => {
    refDialog.current.showModal();
    const matrixList = Array.from(
      refMatrix.current.querySelectorAll(`.${matrixStyles.matrix} input`)
    ).map((input) => Number(input.value || 0));

    const matrix = chunkArray(matrixList, variables);

    const independients = Array.from(
      refMatrix.current.querySelectorAll(`.${matrixStyles.independients} input`)
    ).map((input) => Number(input.value || 0));

    const restrictions = Array.from(
      refMatrix.current.querySelectorAll(`.${matrixStyles.eqSelector}`)
    ).map((select) => select.value);

    console.log("[restrictions]: ", restrictions);

    const objetiveFunction = Array.from(
      refObjetiveFunction.current.querySelectorAll(
        `.${objetiveStyles.objetiveFunction} input`
      )
    ).map((input) => Number(input.value || 0));

    const problem = {
      A: matrix,
      b: independients,
      c: objetiveFunction,
      restrictions: restrictions,
      type: type,
    };

    console.log("[Simplex Problem] problem: ", problem);

    try {
      const url = `${apiUrl}/simplex`;
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(problem),
      };

      const res = await fetch(url, options);

      if (!res.ok) {
        throw new Error(`response error http staatus: ${res.status}`);
      }

      const data = await res.json();

      setSolution(data);
      refDialog.current.close();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleType = () => {
    setType(type == mapType.max ? mapType.min : mapType.max);
  };

  return (
    <>
      <SimplexProblem
        equations={equations}
        setEquations={setEquations}
        setVariables={setVariables}
        variables={variables}
        refMatrix={refMatrix}
        refObjetiveFunction={refObjetiveFunction}
        handleGetMatrixInputs={handleGetMatrixInputs}
        handleToggleType={handleToggleType}
        type={type}
      />
      {solution && (
        <SimplexSolution
          result={solution}
          onClearSolution={() => {
            setSolution(null);
          }}
        />
      )}
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
