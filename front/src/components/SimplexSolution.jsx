import { Table } from "./Table";
import styles from "./styles/SimplexSolution.module.css";
import { Solution } from "./Solution";

export function SimplexSolution({ result, onClearSolution }) {
  console.log(result.historial);
  console.log(result.grafica);
  return (
    <section className={styles.solutionSection}>
      <Solution
        solution={result.solucion}
        z={result.Z}
        graphic={result.grafica}
      />

      <main className={styles.container}>
        {result.historial.map((iter, index) => {
          return <Table key={index} iteration={iter} />;
        })}
      </main>

      <button className={styles.clearButton} onClick={onClearSolution}>
        Limpiar
      </button>
    </section>
  );
}
