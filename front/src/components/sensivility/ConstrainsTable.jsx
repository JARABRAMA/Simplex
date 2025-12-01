import { useSolution } from "../../hooks/useSolution";
import styles from "./Sensivility.module.css";

export function ConstrainsTable() {
  const { sensivility } = useSolution();
  const restrictions = Object.keys(sensivility["rangos_factibilidad"]);
  return (
    <article className={styles.sensivilityCard}>
      <h4>Tabla de Restricciones</h4>
      <div className={styles.table}>
        <RestrictionsColumn restrictions={restrictions} />
        <ShadowPrices
          shadowPrices={restrictions.map(
            (value) => sensivility["precios_sombra"][value]
          )}
        />
        <AllowableIncreaseColumn
          sensivility={sensivility}
          restrictions={restrictions}
        />
        <AllowableDecreaseColumn
          sensivility={sensivility}
          restrictions={restrictions}
        />
      </div>
    </article>
  );
}

function AllowableDecreaseColumn({ restrictions, sensivility }) {
  return (
    <div className={styles.column}>
      <span>Decremento Permitido</span>
      {restrictions.map((value, index) => (
        <span key={index}>
          {sensivility["rangos_factibilidad"][value]["disminucion_max"]}
        </span>
      ))}
    </div>
  );
}
function AllowableIncreaseColumn({ sensivility, restrictions }) {
  return (
    <div className={styles.column}>
      <span>Incremento Permitido</span>
      {restrictions.map((value, index) => (
        <span key={index}>
          {sensivility["rangos_factibilidad"][value]["aumento_max"]}
        </span>
      ))}
    </div>
  );
}

function ShadowPrices({ shadowPrices }) {
  return (
    <div className={styles.column}>
      <span>Precios Sombra</span>
      {shadowPrices.map((value, index) => (
        <span key={index}>{value}</span>
      ))}
    </div>
  );
}

function RestrictionsColumn({ restrictions }) {
  return (
    <div className={styles.column}>
      <span>Restricciones</span>
      {restrictions.map((_, index) => (
        <span key={index}>restricción {index + 1}</span>
      ))}
    </div>
  );
}
