def map_solution(historial: list, solucion: list, Z: float, grafica: str) -> dict:
    serialized_historial = [] 
    for paso in historial:
        paso_serializado = {
            "iteracion": paso["iteracion"],
            "descripcion": paso["descripcion"],
            "tabla": paso["tabla"].to_dict(orient="records"),
            "Zj": paso["Zj"].tolist(),
            "Cj": paso["Cj"].tolist(),
            "basicas": paso["basicas"],
        }
        serialized_historial.append(paso_serializado)

    if grafica:     
        return {
            'solucion': solucion.tolist(),
            'Z': Z,
            'historial': serialized_historial,
            'grafica': grafica
    }
    
    return {
        'solucion': solucion.tolist(),
        'Z': Z,
        'historial': serialized_historial
    }



if __name__ == "__main__":
    from algorithms import GranM
    # Ejemplo de uso con dos variables
    c = [3, 5]
    A = [[2, 3], [2, 1]]
    b = [8, 4]
    tipo_restr = ["<=", "="]

    modelo = GranM(c, A, b, tipo_restr, tipo_obj="max")
    solucion, Z, historial, grafica = modelo.resolver()

    print(map_solution(historial, solucion, Z, grafica))