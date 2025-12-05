import { useProblemStore } from "../../hooks/useProblemStore";
import { useSolution } from "../../hooks/useSolution";
import { getUsedResources } from "../../utils";
import styles from "./Sensivility.module.css";

export function ConstrainsTable() {
  const { sensivility, optimalValues } = useSolution();
  const restrictions = Object.keys(sensivility["rangos_factibilidad"]);
  const { A } = useProblemStore();
  const usedReources = getUsedResources(optimalValues, A);

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

        {/* <UsedResourcesColumn usedReources={usedReources} /> */}
        <AllowableIncreaseColumn
          sensivility={sensivility}
          restrictions={restrictions}
        />
        <AllowableDecreaseColumn
          sensivility={sensivility}
          restrictions={restrictions}
        />
        {/* 
        <MaxValuesColumn
          restrictions={restrictions}
          sensivility={sensivility}
          usedReources={usedReources}
        />

        <MinValuesColumn
          restrictions={restrictions}
          sensivility={sensivility}
          usedReources={usedReources}
        /> */}
      </div>
    </article>
  );
}

function MaxValuesColumn({ restrictions, sensivility, usedReources }) {
  const maxValues = restrictions.map((value) =>
    sensivility["rangos_factibilidad"][value]["aumento_max"]
      ? sensivility["rangos_factibilidad"][value]["aumento_max"]
      : 0
  );
  console.log(maxValues);

  return (
    <div className={styles.column}>
      <span>Valor Maximo</span>
      {usedReources.map((value, index) => (
        <span key={index}>{value + maxValues[index]}</span>
      ))}
    </div>
  );
}

function MinValuesColumn({ restrictions, sensivility, usedReources }) {
  const minValues = restrictions.map((value) =>
    sensivility["rangos_factibilidad"][value]["disminucion_max"]
      ? sensivility["rangos_factibilidad"][value]["disminucion_max"]
      : 0
  );
  console.log(minValues);

  return (
    <div className={styles.column}>
      <span>Valor Minimo</span>
      {usedReources.map((value, index) => (
        <span key={index}>{value - minValues[index]}</span>
      ))}
    </div>
  );
}

function UsedResourcesColumn({ usedReources }) {
  return (
    <div className={styles.column}>
      <span>Recursos Usados</span>
      {usedReources.map((value, index) => (
        <span key={index}>{value}</span>
      ))}
    </div>
  );
}

function AllowableDecreaseColumn({ restrictions, sensivility }) {
  return (
    <div className={styles.column}>
      <span>Decremento Permitido</span>
      {restrictions.map((value, index) => (
        <span key={index}>
          {sensivility["rangos_factibilidad"][value]["disminucion_max"]
            ? sensivility["rangos_factibilidad"][value]["disminucion_max"]
            : "-"}
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
          {sensivility["rangos_factibilidad"][value]["aumento_max"]
            ? sensivility["rangos_factibilidad"][value]["aumento_max"]
            : "-"}
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
