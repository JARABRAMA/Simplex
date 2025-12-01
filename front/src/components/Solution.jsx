import styles from "./styles/Solution.module.css";
import { formatNumber } from "../utils";
import { useSolution } from "../hooks/useSolution";

export function Solution() {
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
        <OptimalSolutionCard />
        <SolutionValueCard />
      </section>

      <Graphic />
    </article>
  );
}

function Graphic() {
  const { graphic } = useSolution();
  return graphic && <img src={graphic} alt="solucion grafica del problema" />;
}

function SolutionValueCard() {
  const { solutionValue } = useSolution();
  return (
    <section className={styles.solutionContainer}>
      <span>Z</span>
      <span>=</span>
      <span>{solutionValue.toFixed(3)}</span>
    </section>
  );
}

function OptimalSolutionCard() {
  const { optimalValues } = useSolution();
  return (
    <section className={styles.solutionContainer}>
      <div className={styles.vector}>
        {optimalValues.map((_, index) => {
          return <span key={index}>x{index + 1}</span>;
        })}
      </div>

      <span> = </span>
      <div className={styles.vector}>
        {optimalValues.map((value, index) => {
          return <span key={index}>{formatNumber(value)}</span>;
        })}
      </div>
    </section>
  );
}
