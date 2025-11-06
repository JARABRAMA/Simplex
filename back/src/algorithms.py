import numpy as np

import pandas as pd
import numpy as np
from tabulate import tabulate


class GranM:
    def __init__(self, c, A, b, tipo_restr, tipo_obj="max", M=1e6):
        self.c = np.array(c, dtype=float)
        self.A = np.array(A, dtype=float)
        self.b = np.array(b, dtype=float)
        self.tipo_restr = tipo_restr
        self.tipo_obj = tipo_obj
        self.M = M
        self.historial = []

    def construir_tabla_inicial(self):
        m, n = self.A.shape
        self.vars = [f"x{i + 1}" for i in range(n)]
        self.A_ext = self.A.copy()
        self.c_ext = np.copy(self.c)
        artificiales = []

        for i, t in enumerate(self.tipo_restr):
            if t == "<=":
                col = np.zeros((m, 1))
                col[i, 0] = 1
                self.A_ext = np.hstack((self.A_ext, col))
                self.c_ext = np.append(self.c_ext, 0)
                self.vars.append(f"s{i + 1}")
            elif t == ">=":
                col_exceso = np.zeros((m, 1))
                col_exceso[i, 0] = -1
                col_artif = np.zeros((m, 1))
                col_artif[i, 0] = 1
                self.A_ext = np.hstack((self.A_ext, col_exceso))
                self.A_ext = np.hstack((self.A_ext, col_artif))
                self.c_ext = np.append(self.c_ext, [0, -self.M])
                self.vars.extend([f"e{i + 1}", f"a{i + 1}"])
                artificiales.append(f"a{i + 1}")
            elif t == "=":
                col = np.zeros((m, 1))
                col[i, 0] = 1
                self.A_ext = np.hstack((self.A_ext, col))
                self.c_ext = np.append(self.c_ext, -self.M)
                self.vars.append(f"a{i + 1}")
                artificiales.append(f"a{i + 1}")

        if self.tipo_obj == "min":
            self.c_ext *= -1

        self.basicas = []
        for i, t in enumerate(self.tipo_restr):
            if t == "<=":
                self.basicas.append(f"s{i + 1}")
            elif t in (">=", "="):
                self.basicas.append(f"a{i + 1}")

        self.tabla = pd.DataFrame(self.A_ext, columns=self.vars)
        self.tabla["b"] = self.b
        self.Zj = np.zeros(len(self.vars))
        self.Cj = self.c_ext
        self.iteracion = 0
        self.guardar_iteracion("Tabla inicial")

    def guardar_iteracion(self, descripcion):
        estado = {
            "iteracion": self.iteracion,
            "descripcion": descripcion,
            "tabla": self.tabla.copy(),
            "Zj": np.copy(self.Zj),
            "Cj": np.copy(self.Cj),
            "basicas": self.basicas.copy(),
        }
        self.historial.append(estado)

    def resolver(self):
        self.construir_tabla_inicial()
        m, n = self.A_ext.shape
        no_optimo = True

        while no_optimo:
            idx_bas = [self.vars.index(b) for b in self.basicas]
            Cb = self.Cj[idx_bas]
            self.Zj = np.dot(Cb, self.A_ext)
            CZ = self.Cj - self.Zj

            if all(CZ <= 1e-8):
                no_optimo = False
                self.guardar_iteracion("Solución óptima encontrada")
                break

            col_in = np.argmax(CZ)
            if CZ[col_in] <= 0:
                no_optimo = False
                self.guardar_iteracion("Solución óptima encontrada")
                break

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

        solucion = np.zeros(len(self.vars))
        for i, b in enumerate(self.basicas):
            j = self.vars.index(b)
            solucion[j] = self.b[i]

        Z_final = np.dot(self.c, solucion[: len(self.c)])
        if self.tipo_obj == "min":
            Z_final *= -1

        self.Z_final = Z_final
        self.solucion = solucion[: len(self.c)]
        return self.solucion, self.Z_final, self.historial
