import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path
from tabulate import tabulate
from itertools import combinations


class GranM:
    def __init__(self, c, A, b, tipo_restr, tipo_obj="max", M=1e6):
        """
        Inicializa el problema de PL:
        Max/Min Z = (c^T)*x
        s.a. A*x(<=,=,>=)b
        A: matriz de restricciones
        b: vector de términos independientes
        c: vector de coeficientes de la función objetivo (vector de costos)
        tipo_restr: lista de tipos de restricciones ('<=', '=', '>=') ('menor o igual que', 'igual que', 'mayor o igual que')
        tipo_obj: tipo de función objetivo ('max' o 'min')
        """
        self.c = np.array(c, dtype=float)
        self.A = np.array(A, dtype=float)
        self.b = np.array(b, dtype=float)
        self.A_original = [fila.copy() for fila in A]
        self.b_original = b.copy()
        self.tipo_restr = tipo_restr
        self.tipo_obj = tipo_obj
        self.M = M
        self.historial = []

    def construir_tabla_inicial(self):
        """
        Construye la tabla inicial del método de la gran M
        m: número de restricciones
        n: número de variables
        """
        m, n = self.A.shape
        self.vars = [f"x{i+1}" for i in range(n)]
        self.A_ext = self.A.copy()
        self.c_ext = np.copy(self.c)

        artificiales = []
        for i, t in enumerate(self.tipo_restr):
            """
            i: indice de la restriccion
            t: tipo de restriccion
            """
            if t == "<=":
                col = np.zeros((m, 1))
                col[i, 0] = 1  # Se agrega variable de holgura (1*si)
                self.A_ext = np.hstack(
                    (self.A_ext, col)
                )  # Se aumenta la matriz con la columna asociada a la nueva variable de holgura (si)
                self.c_ext = np.append(
                    self.c_ext, 0
                )  # Se agrega un cero al vector costos asociado con la variable de holgura (0*si)
                self.vars.append(
                    f"s{i+1}"
                )  # Se agrega la variable de holgura a una lista auxiliar de variables
            elif t == ">=":
                col_exceso = np.zeros((m, 1))
                col_exceso[i, 0] = -1  # Se agrega variable de exceso (-1*ei)
                col_artif = np.zeros((m, 1))
                col_artif[i, 0] = 1  # Se agrega variable artificial (1*ai)
                self.A_ext = np.hstack(
                    (self.A_ext, col_exceso)
                )  # Se aumenta la matriz con la columna asociada a la nueva variable de exceso (ei)
                self.A_ext = np.hstack(
                    (self.A_ext, col_artif)
                )  # Se aumenta la matriz con la columna asociada a la nueva variable artificial (ai)
                self.c_ext = np.append(
                    self.c_ext, [0, -self.M]
                )  # Se agrega un cero al vector costos asociado con la variable de exceso (0*ei) y la constante de penalización (M) debida a la(s) variable(s) artifical(es).
                self.vars.extend(
                    [f"e{i+1}", f"a{i+1}"]
                )  # Se agregan la variables de holgura y artificiales a una lista auxiliar de variables
                artificiales.append(f"a{i+1}")
            elif t == "=":
                col = np.zeros((m, 1))
                col[i, 0] = 1  # Se agrega variable artificial (1*ai)
                self.A_ext = np.hstack(
                    (self.A_ext, col)
                )  # Se aumenta la matriz con la columna asociada a la nueva variable artificial (ai)
                self.c_ext = np.append(
                    self.c_ext, -self.M
                )  # Se agrega la constante de penalización (M) debida a la(s) variable(s) artifical(es).
                self.vars.append(
                    f"a{i+1}"
                )  # Se agrega la variable artificial a una lista auxiliar de variables
                artificiales.append(f"a{i+1}")

        if self.tipo_obj == "min":
            self.c_ext *= (
                -1
            )  # Si el problema es de minimización entonces se maximiza a -Z.

        self.basicas = []
        for i, t in enumerate(self.tipo_restr):
            if t == "<=":
                self.basicas.append(f"s{i+1}")
            elif t in (">=", "="):
                self.basicas.append(f"a{i+1}")

        self.tabla = pd.DataFrame(
            self.A_ext, columns=self.vars
        )  # Df auxiliar con la matriz de restricciones aumentada y las variables (iniciales+holgura+exceso+artificiales)
        self.tabla["b"] = self.b  # Se agrega el vector de términos independientes
        self.Zj = np.zeros(
            len(self.vars)
        )  # Vector auxiliar para operar filas (función objetivo)
        self.Cj = self.c_ext  # Vector auxiliar para operar filas
        self.iteracion = 0
        self.guardar_iteracion("Tabla inicial")

    def guardar_iteracion(self, descripcion):
        """
        Guarda el estado actual del método
        Clave para la representación gráfica de cada iteración
        """
        estado = {
            "iteracion": self.iteracion,
            "descripcion": descripcion,
            "tabla": self.tabla.copy(),
            "Zj": np.copy(self.Zj),
            "Cj": np.copy(self.Cj),
            "basicas": self.basicas.copy(),
        }
        self.historial.append(estado)
        self.mostrar_iteracion(estado)

    def mostrar_iteracion(self, estado):
        """
        Imprime en consola la tabla de la iteración con tabulate
        """
        print(f"\n{'='*60}")
        print(f" Iteración {estado['iteracion']} → {estado['descripcion']}")
        print(f" Variables básicas: {', '.join(estado['basicas'])}")
        print(
            tabulate(estado["tabla"], headers="keys", tablefmt="github", floatfmt=".3f")
        )
        print(f"Cj - Zj: {np.round(estado['Cj'] - estado['Zj'], 3)}")
        print(f"{'='*60}\n")

    def graficar(self, solucion):
        """
        Grafica la región factible, las restricciones y la solución óptima.
        SOLO si el problema tiene exactamente dos variables de decisión.
        Ahora se sombrea únicamente el polígono factible real.
        """
        if len(self.c) != 2:
            print(
                "Problema con más de dos variables de decisión: no se aplica el método gráfico."
            )
            return

        A = np.array(self.A_original, dtype=float)
        b = np.array(self.b_original, dtype=float)

        # Rango de visualización basado en intersecciones
        bound = max(b) * 1.1
        x1_vals = np.linspace(0, bound, 400)

        plt.figure(figsize=(9, 7))

        # Graficar las restricciones
        for i in range(len(A)):
            Ai = A[i]
            bi = b[i]

            if Ai[1] != 0:
                x2 = (bi - Ai[0] * x1_vals) / Ai[1]
                plt.plot(x1_vals, x2, label=f"{Ai[0]:.1f}x₁ + {Ai[1]:.1f}x₂ = {bi}")
            else:
                x_const = bi / Ai[0]
                if x_const >= 0:
                    plt.axvline(x_const, label=f"{Ai[0]:.1f}x₁ = {bi}")

        # Calcular intersecciones entre todas las restricciones
        puntos = []

        # Añadimos también restricciones de positividad, xi>0.
        A_ext = np.vstack([A, [1, 0], [0, 1]])
        b_ext = np.hstack([b, [0, 0]])

        for i, j in combinations(range(len(A_ext)), 2):
            Ai, bi = A_ext[i], b_ext[i]
            Aj, bj = A_ext[j], b_ext[j]

            M = np.array([Ai, Aj])
            if np.linalg.matrix_rank(M) == 2:
                punto = np.linalg.solve(M, np.array([bi, bj]))
                if np.all(punto >= -1e-6):  # tolerancia
                    puntos.append(punto)

        # Filtrar los puntos que realmente pertenecen a la región factible
        factibles = []
        for p in puntos:
            if np.all(A @ p <= b + 1e-6) and p[0] >= 0 and p[1] >= 0:
                factibles.append(p)

        factibles = np.array(factibles)
        if len(factibles) == 0:
            print("No hay región factible para graficar.")
            return

        # rdenar puntos para formar el polígono factible
        centro = factibles.mean(axis=0)
        angulos = np.arctan2(factibles[:, 1] - centro[1], factibles[:, 0] - centro[0])
        orden = np.argsort(angulos)
        poligono = factibles[orden]

        # Sombrear el polígono factible
        plt.fill(poligono[:, 0], poligono[:, 1], color="gray", alpha=0.3)

        # Dibujar la solución óptima
        x_opt = solucion[:2]
        plt.scatter(
            x_opt[0],
            x_opt[1],
            color="red",
            s=120,
            label=f"Solución óptima ({x_opt[0]:.2f}, {x_opt[1]:.2f})",
        )

        plt.xlim(0, bound)
        plt.ylim(0, bound)
        plt.xlabel("x₁")
        plt.ylabel("x₂")
        plt.title("Método gráfico aplicado automáticamente (solo 2 variables)")
        plt.grid(True)
        plt.legend()
        plt.savefig("../front/public/images/grafica.png")
        return "../../public/images/grafica.png"

    def resolver(self):
        """
        Ejecuta el método de la Gran M
        """
        self.construir_tabla_inicial()
        m, n = self.A_ext.shape
        no_optimo = True

        while no_optimo:
            # calcular Zj y Cj-Zj
            idx_bas = [self.vars.index(b) for b in self.basicas]
            Cb = self.Cj[idx_bas]
            self.Zj = np.dot(Cb, self.A_ext)
            CZ = self.Cj - self.Zj

            # condición de optimalidad
            if all(
                CZ <= 1e-8
            ):  # 1e-8 es un límite de tolerancia sugerido para las operaciones float
                no_optimo = False
                self.guardar_iteracion("Solución óptima encontrada")
                break

            # variable entrante
            col_in = np.argmax(CZ)
            if CZ[col_in] <= 0:
                no_optimo = False
                self.guardar_iteracion("Solución óptima encontrada")
                break

            # ratios
            ratios = []
            for i in range(m):
                if self.A_ext[i, col_in] > 0:
                    ratios.append(self.b[i] / self.A_ext[i, col_in])
                else:
                    ratios.append(np.inf)
            fila_pivote = np.argmin(ratios)
            pivote = self.A_ext[fila_pivote, col_in]
            if pivote == 0 or np.isinf(pivote):
                self.guardar_iteracion("Solución ilimitada")
                break

            # pivoteo
            self.A_ext[fila_pivote, :] /= pivote
            self.b[fila_pivote] /= pivote
            for i in range(m):
                if i != fila_pivote:
                    factor = self.A_ext[i, col_in]
                    self.A_ext[i, :] -= factor * self.A_ext[fila_pivote, :]
                    self.b[i] -= factor * self.b[fila_pivote]

            self.basicas[fila_pivote] = self.vars[col_in]
            self.tabla = pd.DataFrame(self.A_ext, columns=self.vars)
            self.tabla["b"] = self.b
            self.iteracion += 1
            self.guardar_iteracion(f"Iteración {self.iteracion}")

        # calcular solución final
        solucion = np.zeros(len(self.vars))
        for i, b in enumerate(self.basicas):
            j = self.vars.index(b)
            solucion[j] = self.b[i]

        Z_final = np.dot(self.c, solucion[: len(self.c)])
        if (
            self.tipo_obj == "min"
        ):  # Si el problema es de minimización entonces se debe revertir el signo para recuperar los coeficientes originales: -(-Z)
            Z_final *= -1

        # Graficación automática si el problema es de dos variables
        if len(self.c) == 2:
            return (
                solucion[: len(self.c)],
                Z_final,
                self.historial,
                self.graficar(solucion),
            )

        return solucion[: len(self.c)], Z_final, self.historial


if __name__ == "__main__":
    # Ejemplo de uso con dos variables
    c = [3, 5]
    A = [[2, 3], [2, 1]]
    b = [8, 4]
    tipo_restr = ["<=", "="]

    modelo = GranM(c, A, b, tipo_restr, tipo_obj="max")
    solucion, Z, historial = modelo.resolver()
