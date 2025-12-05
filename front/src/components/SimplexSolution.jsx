import { Table } from "./Table";
import styles from "./styles/SimplexSolution.module.css";
import { Solution } from "./Solution";
import { useSolution } from "../hooks/useSolution";
import { SimplexSensivility } from "./sensivility/SimplexSensivility";
import { getIncomingAndOutgoingBasicVariables } from "../utils";
export function SimplexSolution() {
  const { isSolved } = useSolution();

  if (!isSolved) return;

  return (
    <section className={styles.solutionSection}>
      <Solution />
      <IterationsSolution />
      <SimplexSensivility />
      <ClearSolutionButton />
    </section>
  );
}

function IterationsSolution() {
  const { iterations } = useSolution();
  return (
    <main className={styles.container}>
      {iterations.map((iter, index) => {
        const iteration = { ...iter };
        if (index !== 0 && index !== iterations.length - 1)
          iteration.incomingOutgoing = getIncomingAndOutgoingBasicVariables(
            iter.basicas,
            iterations[index - 1].basicas
          );
        return <Table key={index} iteration={iteration} />;
      })}
    </main>
  );
}

function ClearSolutionButton() {
  const { resetSolution } = useSolution();
  return (
    <button className={styles.clearButton} onClick={resetSolution}>
      Limpiar
    </button>
  );
}
