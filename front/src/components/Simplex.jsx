import { useRef, useState } from "react";

import { SimplexSolution } from "./SimplexSolution";
import { SimplexProblem } from "./SimplexProblem";
import matrixStyles from "./styles/Matrix.module.css";
import objetiveStyles from "./styles/Coeficients.module.css";

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

  const refMatrix = useRef();
  const refObjetiveFunction = useRef();

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleGetMatrixInputs = async () => {
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

    const response = await fetch(
      `${apiUrl || "http://localhost:8000"}/simplex`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(problem),
      }
    );

    const data = await response.json();

    console.log("[simplex] data: ", data);
    setSolution(data);
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
    </>
  );
}
