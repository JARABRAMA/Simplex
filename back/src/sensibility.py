import numpy as np


def analisis_sensibilidad(solucion):
    """
    T proviene de normalizar_tableau(resultado)
    """

    T = normalizar_tableau(solucion)
    A = T["A"]
    b = T["b"]
    columnas = T["columnas"]
    basicas = T["basicas"]
    Cj = T["Cj"]
    Zj = T["Zj"]

    # COSTOS REDUCIDOS
    costos_reducidos = {var: Cj[i] - Zj[i] for i, var in enumerate(columnas)}

    # PRECIOS SOMBRA
    precios_sombra = {
        var: -Zj[i] for i, var in enumerate(columnas) if var.startswith("s")
    }

    # RANGOS DE FACTIBILIDAD
    rangos_factibilidad = {}
    for var in basicas:
        i = basicas.index(var)
        fila = A[i]

        aumentos = []
        disminuciones = []

        for coef in fila:
            if coef > 0:
                aumentos.append(b[i] / coef)
            elif coef < 0:
                disminuciones.append(b[i] / coef)

        rangos_factibilidad[var] = {
            "aumento_max": min(aumentos) if aumentos else None,
            "disminucion_max": -max(disminuciones) if disminuciones else None,
        }

    # RANGOS DE OPTIMALIDAD
    rangos_optimalidad = {}
    for var in basicas:
        i = columnas.index(var)
        fila = A[basicas.index(var)]

        lim_min = []
        lim_max = []

        for j, coef in enumerate(fila):
            if columnas[j] == var:
                continue

            rc = Cj[j] - Zj[j]

            if coef > 0:
                lim_min.append(rc / coef)
            elif coef < 0:
                lim_max.append(rc / coef)

        rangos_optimalidad[var] = {
            "min": max(lim_min) if lim_min else None,
            "max": min(lim_max) if lim_max else None,
        }

    return {
        "costos_reducidos": costos_reducidos,
        "precios_sombra": precios_sombra,
        "rangos_factibilidad": rangos_factibilidad,
        "rangos_optimalidad": rangos_optimalidad,
    }


def normalizar_tableau(resultado):
    """
    Extrae y normaliza el tableau final desde la estructura producida por tu solver Gran M.
    Devuelve un diccionario limpio para usar en análisis de sensibilidad.
    """

    final = resultado["historial"][-1]

    tabla = final["tabla"]
    basicas = final["basicas"]
    Cj = np.array(final["Cj"], dtype=float)
    Zj = np.array(final["Zj"], dtype=float)

    # Detectar columnas
    columnas = list(tabla[0].keys())

    # Variabes excluyendo b
    columnas_vars = [c for c in columnas if c != "b"]

    # Construir matriz A (coeficientes de variables)
    A = np.array([[fila[var] for var in columnas_vars] for fila in tabla], dtype=float)

    # Vector b
    b = np.array([fila["b"] for fila in tabla], dtype=float)

    return {
        "A": A,
        "b": b,
        "columnas": columnas_vars,
        "basicas": basicas,
        "Cj": Cj,
        "Zj": Zj,
    }


if __name__ == "__main__":
    from granm import GranM
    from mapper import map_solution

    # Ejemplo de uso con dos variables
    c = [3, 5]
    A = [[2, 3], [2, 1]]
    b = [8, 4]
    tipo_restr = ["<=", "="]

    modelo = GranM(c, A, b, tipo_restr, tipo_obj="max")
    solucion, Z, historial, grafica = modelo.resolver()

    mapped_solution = map_solution(historial, solucion, float, grafica)

    print(analisis_sensibilidad(mapped_solution))
