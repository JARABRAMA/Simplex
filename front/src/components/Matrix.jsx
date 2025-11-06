import styles from "./styles/Matrix.module.css";
import "katex/dist/katex.min.js";

export function Matrix({ equations, variables, refMatrix }) {
  const vars = Array.from({ length: variables }, (_, i) => i + 1);
  const matrix = Array.from({ length: equations * variables }, (_, i) => i + 1);
  const independients = Array.from({ length: equations }, (_, i) => i + 1);

  const matrixStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${variables}, 1fr)`,
  };

  return (
    <fieldset className={styles.container} ref={refMatrix}>
      <legend>Coeficientes de la Matriz de Restricciones</legend>

      <div>
        <div className={styles.variables}>
          {vars.map((index) => {
            return <span>x{index}</span>;
          })}
        </div>

        <div className={styles.matrix} style={matrixStyle}>
          {matrix.map((index) => {
            return <input type="number" required key={index} />;
          })}
        </div>
      </div>

      <div className={styles.independients}>
        <span>b</span>
        {independients.map((i) => {
          return (
            <div key={i}>
              <RestrictionSelector />
              <input type="number" required />
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

function RestrictionSelector() {
  return (
    <select className={styles.eqSelector}>
      <option value="<=">≤</option>
      <option value="=">=</option>
      <option value=">=">≥</option>
    </select>
  );
}
