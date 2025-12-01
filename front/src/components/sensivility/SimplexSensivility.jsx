import { ConstrainsTable } from "./ConstrainsTable";
import { VariablesTable } from "./VariablesTable";
import styles from "./Sensivility.module.css";

export function SimplexSensivility() {
  return (
    <section className={styles.tablesSection}>
      <h3>Análisis de Sensibilidad</h3>
      <VariablesTable />
      <ConstrainsTable />
    </section>
  );
}
