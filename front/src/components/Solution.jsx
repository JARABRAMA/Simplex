import styles from "./styles/Solution.module.css";
import { formatNumber } from "../utils";

export function Solution({ solution, z, graphic }) {
  return (
    <article className={styles.solutionSection}>
      <section className={styles.notacionCard}>
        <h4>Notacion</h4>
        <div>
          <span>Variables de holgura</span>
          <span className={styles.notacionCardSpan}>si</span>
          <span>Variables de exceso</span>
          <span className={styles.notacionCardSpan}>ei</span>
          <span>Variables artificiales</span>
          <span className={styles.notacionCardSpan}>ai</span>
        </div>
      </section>

      <section className={styles.container}>
        <h4>Solucion</h4>
        <section className={styles.solutionContainer}>
          <div className={styles.vector}>
            {solution.map((_, index) => {
              return <span key={index}>x{index + 1}</span>;
            })}
          </div>
          <span> = </span>
          <div className={styles.vector}>
            {solution.map((value, index) => {
              return <span key={index}>{formatNumber(value)}</span>;
            })}
          </div>
        </section>

        <section className={styles.solutionContainer}>
          <span>Z</span>
          <span>=</span>
          <span>{z.toFixed(3)}</span>
        </section>
      </section>

      {graphic && <img src={graphic} alt="solucion grafica del problema" />}
    </article>
  );
}
