import styles from "./styles/Solution.module.css";
import { formatNumber } from "../utils";

export function Solution({ solution, z }) {
  return (
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
  );
}
