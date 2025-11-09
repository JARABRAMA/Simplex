import styles from "./styles/LoadingDialog.module.css";

function ErrorDialog({ handleClearError, error }) {
  return (
    <article>
      <header>
        <h3 className={styles.isError}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M11.001 10h2v5h-2zM11 16h2v2h-2z" />
            <path
              fill="currentColor"
              d="M13.768 4.2C13.42 3.545 12.742 3.138 12 3.138s-1.42.407-1.768 1.063L2.894 18.064a1.99 1.99 0 0 0 .054 1.968A1.98 1.98 0 0 0 4.661 21h14.678c.708 0 1.349-.362 1.714-.968a1.99 1.99 0 0 0 .054-1.968zM4.661 19L12 5.137L19.344 19z"
            />
          </svg>
          Error
        </h3>
      </header>
      <main>
        <span>No se ha podido cargar la solucion error: {error}</span>
      </main>
      <button onClick={handleClearError}>Cerrar</button>
    </article>
  );
}

function LoadingDialog() {
  return (
    <article>
      <header>
        <h3>
          Cargando...
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            >
              <path
                strokeDasharray="16"
                strokeDashoffset="16"
                d="M12 3c4.97 0 9 4.03 9 9"
              >
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  dur="0.3s"
                  values="16;0"
                />
                <animateTransform
                  attributeName="transform"
                  dur="1.5s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="0 12 12;360 12 12"
                />
              </path>
              <path
                strokeDasharray="64"
                strokeDashoffset="64"
                strokeOpacity=".3"
                d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"
              >
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  dur="1.2s"
                  values="64;0"
                />
              </path>
            </g>
          </svg>
        </h3>
      </header>
      <main>
        <span>Por favor espera un momento mientras se carga la solución</span>
      </main>
    </article>
  );
}

export function SimplexDialog({ error, handleClearError }) {
  return error ? (
    <ErrorDialog handleClearError={handleClearError} error={error} />
  ) : (
    <LoadingDialog />
  );
}
