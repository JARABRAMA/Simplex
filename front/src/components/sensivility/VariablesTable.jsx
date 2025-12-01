import styles from "./Sensivility.module.css";
import { useSolution } from "../../hooks/useSolution";

export function VariablesTable() {
  const { optimalValues, sensivility } = useSolution();
  console.log(sensivility);
  const variables = optimalValues.map((_, index) => `x${index + 1}`);

  return (
    <article className={styles.sensivilityCard}>
      <h4>Tabla de Variables</h4>
      <div className={styles.table}>
        <VariablesColumn variables={variables} />
        <OptimalValuesColumn optimalValues={optimalValues} />
        <ReducedCostColumn
          reducedCost={sensivility["costos_reducidos"]}
          variables={variables}
        />
        <AllowableIncreaseColumn
          variables={variables}
          optimalityRages={sensivility["rangos_optimalidad"]}
        />
        <AllowableDecreaseColumn
          variables={variables}
          optimalityRages={sensivility["rangos_optimalidad"]}
        />
      </div>
    </article>
  );
}

function AllowableDecreaseColumn({ variables, optimalityRages }) {
  return (
    <div className={styles.column}>
      <span>Decremento Permitido</span>
      {variables.map((variable, index) => {
        const range = optimalityRages[variable];
        if (!range) {
          return <span key={index}>-</span>;
        }
        const value = range.min;
        return <span key={index}>{value == null ? "-" : value}</span>;
      })}
    </div>
  );
}

function AllowableIncreaseColumn({ variables, optimalityRages }) {
  return (
    <div className={styles.column}>
      <span>Incremento Permitido</span>
      {variables.map((variable, index) => {
        const range = optimalityRages[variable];
        if (!range) {
          return <span key={index}>-</span>;
        }
        const value = range.max;
        return <span key={index}>{value == null ? "-" : value}</span>;
      })}
    </div>
  );
}

function ReducedCostColumn({ reducedCost, variables }) {
  console.log(reducedCost);
  return (
    <div className={styles.column}>
      <span>Costos Reducidos</span>
      {variables.map((variable, index) => {
        const value = reducedCost[variable];
        console.log(value);

        return <span key={index}>{value == null ? "-" : value}</span>;
      })}
    </div>
  );
}

function OptimalValuesColumn({ optimalValues }) {
  return (
    <div className={styles.column}>
      <span>Valores Optimos</span>
      {optimalValues.map((value, index) => (
        <span key={index}>{value}</span>
      ))}
    </div>
  );
}

function VariablesColumn({ variables }) {
  return (
    <div className={styles.column}>
      <span>Variables</span>
      {variables.map((variable, index) => (
        <span key={index}>{variable}</span>
      ))}
    </div>
  );
}
