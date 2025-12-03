import styles from "./styles/Table.module.css";
import { formatNumber } from "../utils";

export function Table({ iteration }) {
  console.log(iteration);
  const variables = Object.keys(iteration.tabla[0]);
  const values = iteration.tabla.map((row) => Object.values(row));
  const footerRow = iteration.Cj.map((cj, i) => cj - iteration.Zj[i]);

  return (
    <article className={styles.tableCard}>
      <header>
        <span className={styles.title}>{iteration.descripcion}</span>

        <small>
          <span>Variables Basicas</span>
          <div className={styles.basicVariablesRow}>
            {iteration.basicas.map((variable) => {
              return (
                <span key={variable} className={styles.cell}>
                  {variable}
                </span>
              );
            })}
          </div>
          {iteration.incomingOutgoing && (
            <div className={styles.incomingOutgoing}>
              <span>
                {`${iteration.incomingOutgoing.incoming}  -> ${iteration.incomingOutgoing.outgoing}`}
              </span>
            </div>
          )}
        </small>
      </header>
      <main>
        <div className={styles.row}>
          {variables.map((value, index) => {
            return (
              <span key={index} className={styles.cell}>
                {formatNumber(value)}
              </span>
            );
          })}
        </div>

        {values.map((row, index) => {
          return (
            <div className={styles.row} key={index}>
              {row.map((value, index) => {
                return (
                  <span key={index} className={styles.cell}>
                    {formatNumber(value)}
                  </span>
                );
              })}
            </div>
          );
        })}
      </main>
      <footer>
        <span>Cj - Zj</span>
        <div className={styles.footerRow}>
          {footerRow.map((value, index) => {
            return <span key={index}>{formatNumber(value)}</span>;
          })}
        </div>
      </footer>
    </article>
  );
}
