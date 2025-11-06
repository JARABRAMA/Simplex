import styles from "./styles/Coeficients.module.css";

export function Coeficients({ number, objetiveFunctionRef }) {
  const variables = Array.from({ length: number }, (_, i) => i + 1);

  return (
    <fieldset ref={objetiveFunctionRef} className={styles.objetiveFunction}>
      <legend>Coeficientes de la Función Objetivo</legend>
      {variables.map((index) => {
        return (
          <div key={index}>
            <label htmlFor={`x${index}`}>{`x${index}`}</label>
            <input type="number" name={`x${index}`} id={`x${index}`} required />
          </div>
        );
      })}
    </fieldset>
  );
}
