import styles from "./styles/Simplex.module.css";
import { Coeficients } from "./Coeficients";
import { NumberController } from "./NumberController";
import { Matrix } from "./Matrix";

const mapTypeButton = {
  max: "Maximizar",
  min: "Minimizar",
};

export function SimplexProblem({
  equations,
  setEquations,
  setVariables,
  variables,
  refMatrix,
  refObjetiveFunction,
  handleGetMatrixInputs,
  handleToggleType,
  type,
}) {
  const buttonText = mapTypeButton[type];
  return (
    <section className={styles.problemContainer}>
      <h1>Método Simplex Gran M</h1>

      <p>
        Esta página te permite ingresar un problema de programación lineal y
        resolverlo paso a paso usando el método Simplex con Gran M. Solo pones
        tus datos y el sistema construye las tablas y muestra la solución
        óptima.
      </p>

      <form>
        <button
          className={styles.toggleType}
          onClick={(event) => {
            event.preventDefault();
            handleToggleType();
          }}
        >
          {buttonText}
        </button>
        <fieldset className={styles.length}>
          <legend>Longitud del Problema</legend>
          <NumberController
            title={"Número de Restricciones"}
            value={equations}
            onIncrease={(event) => {
              event.preventDefault();
              setEquations(equations + 1);
            }}
            onDecrease={(event) => {
              event.preventDefault();
              if (equations === 2) return;
              setEquations(equations - 1);
            }}
          />
          <NumberController
            title={"Número de Variables"}
            value={variables}
            onIncrease={(event) => {
              event.preventDefault();
              setVariables(variables + 1);
            }}
            onDecrease={(event) => {
              event.preventDefault();
              if (variables == 2) return;
              setVariables(variables - 1);
            }}
          />
        </fieldset>
        <Coeficients
          number={variables}
          objetiveFunctionRef={refObjetiveFunction}
        />

        <Matrix
          equations={equations}
          variables={variables}
          refMatrix={refMatrix}
        />

        <button
          onClick={(e) => {
            e.preventDefault();
            handleGetMatrixInputs();
          }}
          className={styles.submitButton}
        >
          Calcular
        </button>
      </form>
    </section>
  );
}
