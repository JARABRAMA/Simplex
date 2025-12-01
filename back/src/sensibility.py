import numpy as np
import math


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

    # PRECIOS SOMBRA (solo para variables de holgura)
    precios_sombra = {}
    for i, var in enumerate(columnas):
        if var.startswith("s"):
            precios_sombra[var] = Zj[i] - Cj[i]

    # RANGOS DE FACTIBILIDAD
    rangos_factibilidad = {}
    
    # Identificar las variables que formaban la base inicial (holgura o artificiales)
    # Asumimos que s_i o a_i corresponden a la restricción i (0-indexed)
    # En la tabla final, las columnas de estas variables iniciales contienen B^-1
    # OJO: Si hubo variables artificiales que salieron, sus columnas pueden no estar o ser irrelevantes si se usó Gran M.
    # Pero en Gran M, las columnas de las artificiales suelen mantenerse para ver precios sombra o B^-1.
    # Sin embargo, la forma más segura de obtener B^-1 es mirar las columnas de las variables de holgura/artificiales iniciales.
    
    # Mapeo de restricción -> variable inicial
    # Basado en la lógica de granm.py:
    # <=  -> s_i
    # >=  -> a_i (y e_i, pero a_i es la que forma la base)
    # =   -> a_i
    
    # Necesitamos saber qué variables corresponden a qué restricción.
    # Como no tenemos 'tipo_restr' aquí directamente, inferimos buscando s_i o a_i.
    # El orden de las restricciones se mantiene.
    
    # Buscamos columnas que empiecen con 's' o 'a' y ordenamos por índice
    # Esto es heurístico si no pasamos metadata extra.
    # Una forma más robusta es iterar i desde 0 hasta m-1.
    
    m = len(b) # número de restricciones
    
    for i in range(m):
        # Intentar encontrar la variable de holgura o artificial asociada a la restricción i
        # Indices suelen ser 1-based en los nombres (s1, s2...)
        var_s = f"s{i+1}"
        var_a = f"a{i+1}"
        
        col_name = None
        if var_s in columnas:
            col_name = var_s
        elif var_a in columnas:
            col_name = var_a
            
        if col_name:
            # La columna de esta variable en la tabla final es la columna i de B^-1
            col_idx = columnas.index(col_name)
            # Extraer la columna de la matriz A (que es la tabla final)
            b_inv_col = A[:, col_idx]
            
            # Ahora calculamos el rango para b_i
            # b_new = b_old + delta * e_i
            # X_B = B^-1 * b_new = B^-1 * b_old + delta * (columna i de B^-1)
            # X_B = SolucionActual + delta * b_inv_col
            # Queremos X_B >= 0
            # SolucionActual[k] + delta * b_inv_col[k] >= 0
            
            # SolucionActual es 'b' en el tableau final (valores de las variables básicas)
            
            deltas_pos = [] # cotas superiores para delta (limitan aumento)
            deltas_neg = [] # cotas inferiores para delta (limitan disminución)
            
            for k in range(m):
                val_basic = b[k]
                alpha = b_inv_col[k]
                
                if alpha > 0:
                    # val + delta * alpha >= 0  =>  delta >= -val/alpha
                    # Esto pone un límite inferior al delta (disminución máxima)
                    deltas_neg.append(-val_basic / alpha)
                elif alpha < 0:
                    # val + delta * alpha >= 0  =>  delta * alpha >= -val
                    # Como alpha < 0, al dividir se invierte: delta <= -val/alpha
                    # Esto pone un límite superior al delta (aumento máximo)
                    deltas_pos.append(-val_basic / alpha)
            
            # El rango permitido para delta_b_i es [max(deltas_neg), min(deltas_pos)]
            # Si deltas_neg está vacío, no hay cota inferior (puede disminuir infinito) -> disminucion_max = inf
            # Si deltas_pos está vacío, no hay cota superior (puede aumentar infinito) -> aumento_max = inf
            
            # OJO: mis definiciones de deltas_pos/neg arriba son sobre el VALOR de delta.
            # aumento_max se refiere a cuánto puede subir b_i (delta positivo máximo)
            # disminucion_max se refiere a cuánto puede bajar b_i (delta negativo máximo, valor absoluto)
            
            # Revisemos:
            # alpha > 0: delta >= -val/alpha. Ej: 3 + d(1) >= 0 -> d >= -3. Puede bajar hasta 3.
            # alpha < 0: delta <= -val/alpha. Ej: 3 + d(-1) >= 0 -> d <= 3. Puede subir hasta 3.
            
            # Entonces:
            # Límite superior de delta (aumento): viene de alpha < 0
            max_delta = min(deltas_pos) if deltas_pos else float("inf")
            
            # Límite inferior de delta (disminución): viene de alpha > 0
            # delta >= K  =>  delta puede ser negativo hasta K.
            # disminucion_max suele expresarse como número positivo (cuánto resto).
            # Si delta >= -3, disminucion_max = 3.
            # K es max(deltas_neg). K es negativo (o cero).
            min_delta = max(deltas_neg) if deltas_neg else float("-inf")
            
            rangos_factibilidad[f"restriction_{i}"] = {
                "aumento_max": max_delta,
                "disminucion_max": -min_delta if min_delta != float("-inf") else float("inf")
            }
        else:
            # Si no encontramos columna de holgura/artificial, no podemos calcular fácilmente
            # (Podría pasar si se eliminaron columnas artificiales, aunque GranM suele dejarlas)
            rangos_factibilidad[f"restriction_{i}"] = {
                "aumento_max": None,
                "disminucion_max": None
            }

    # RANGOS DE OPTIMALIDAD
    rangos_optimalidad = {}
    
    # Recalcular B_inv para optimalidad si es necesario, o usar la lógica anterior.
    # La lógica anterior usaba:
    # B_inv = np.linalg.inv(A[:, [columnas.index(var) for var in basicas]])
    # Esta B_inv es la inversa de la base FINAL.
    # En el código original, se usaba para calcular coeficientes de la fila.
    # Sin embargo, en el tableau final normalizado, la parte de la matriz A correspondiente a las variables básicas
    # ES la identidad (o una permutación).
    # Por tanto, B_inv calculada así debería ser la identidad.
    # Si el código original dependía de eso, estaba haciendo algo redundante o confuso.
    
    # Revisemos la lógica original de optimalidad:
    # b_inv_row = B_inv[row_idx]
    # coef = sum(b_inv_row[k] * A[k, j] ...)
    # Si B_inv es identidad, b_inv_row tiene un 1 en row_idx y 0 en el resto.
    # coef = A[row_idx, j]
    # Esto es simplemente el coeficiente de la variable no básica j en la fila de la variable básica var.
    # ¡Exacto! En el tableau final, los coeficientes de intercambio ya están calculados.
    
    # Así que podemos simplificar y no usar B_inv explícitamente, sino tomar los valores directamente de A.
    
    for var in basicas:
        if var not in columnas:
            continue

        col_idx = columnas.index(var)
        row_idx = basicas.index(var)

        # En el tableau final, la fila asociada a la variable básica 'var' es la fila 'row_idx'
        # (asumiendo que 'basicas' está ordenado según las filas de la tabla, que lo está en granm.py)
        
        lim_min = []
        lim_max = []

        for j, col_name in enumerate(columnas):
            if col_name in basicas:
                continue

            # Coeficiente en la tabla final
            # coef = A[row_idx, j]
            # Verifiquemos si esto es equivalente a lo que hacía el código:
            # coef = sum(b_inv_row[k] * A[k, j] for k in range(len(basicas)))
            # Si B_inv es identidad, b_inv_row[k] es 1 si k==row_idx, 0 si no.
            # Suma se reduce a A[row_idx, j]. Correcto.
            
            coef = A[row_idx, j]
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

    # Variables excluyendo b
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


def clean_inf(obj):
    if isinstance(obj, dict):
        return {k: clean_inf(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_inf(v) for v in obj]
    elif isinstance(obj, float):
        if math.isinf(obj):
            return None  # o "infinito"
        if math.isnan(obj):
            return None
        return obj
    else:
        return obj


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
