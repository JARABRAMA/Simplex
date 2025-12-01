import { Table } from "./Table";
import styles from "./styles/SimplexSolution.module.css";
import { Solution } from "./Solution";
import { useSolution } from "../hooks/useSolution";

export function SimplexSolution() {
  const { isSolved } = useSolution();

  if (!isSolved) return;

  return (
    <section className={styles.solutionSection}>
      <Solution />
      <IterationsSolution />
      <ClearSolutionButton />
    </section>
  );
}

function IterationsSolution() {
  const { iterations } = useSolution();
  return (
    <main className={styles.container}>
      {iterations.map((iter, index) => {
        return <Table key={index} iteration={iter} />;
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
