const mapType = {
  max: "max",
  min: "min",
};
import { useRef, useState } from "react";
import matrixStyles from "../components/styles/Matrix.module.css";
import objetiveStyles from "../components/styles/Coeficients.module.css";
import { chunkArray } from "../utils";
import { useSolution } from "./useSolution";

export function useProblem() {
  const [variables, setVariables] = useState(2);
  const [equations, setEquations] = useState(2);
  const [type, setType] = useState(mapType.max);
  const refDialog = useRef();
  const [error, setError] = useState(null);

  const { setSolution } = useSolution();

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

  return {
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
  };
}
