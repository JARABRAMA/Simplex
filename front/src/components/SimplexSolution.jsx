import { Table } from "./Table";
import styles from "./styles/SimplexSolution.module.css";
import { Solution } from "./Solution";

export function SimplexSolution({ result, onClearSolution }) {
  console.log(result.historial);
  return (
    <section>
      <Solution solution={result.solucion} z={result.Z} />

      <main className={styles.container}>
        {result.historial.map((iter) => {
          return <Table key={iter.iteracion} iteration={iter} />;
        })}
      </main>

      <button onClick={onClearSolution}>Limpiar</button>
    </section>
  );
}
