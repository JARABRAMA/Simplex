import styles from "./styles/Table.module.css";

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
          <div>
            {iteration.basicas.map((variable) => {
              return <span className={styles.cell}>{variable}</span>;
            })}
          </div>
        </small>
      </header>
      <main>
        <div className={styles.row}>
          {variables.map((value) => {
            return <span className={styles.cell}>{value}</span>;
          })}
        </div>

        {values.map((row, index) => {
          return (
            <div className={styles.row} key={index}>
              {row.map((value) => {
                return <span className={styles.cell}>{value.toFixed(3)}</span>;
              })}
            </div>
          );
        })}
      </main>
      <footer>
        <span>Cj - Zj</span>
        <div className={styles.footerRow}>
          {footerRow.map((value, index) => {
            return <span key={index}>{value}</span>;
          })}
        </div>
      </footer>
    </article>
  );
}
