
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'src')))

from granm import GranM
from mapper import map_solution
from sensibility import analisis_sensibilidad, normalizar_tableau
import numpy as np

def test_sensibility():
    # Example from sensibility.py
    c = [3, 5]
    A = [[2, 3], [2, 1]]
    b = [8, 4]
    tipo_restr = ["<=", "="]

    modelo = GranM(c, A, b, tipo_restr, tipo_obj="max")
    solucion, Z, historial, grafica = modelo.resolver()

    mapped_solution = map_solution(historial, solucion, float, grafica)
    
    # Debugging internal state
    T = normalizar_tableau(mapped_solution)
    A_matrix = T["A"]
    columnas = T["columnas"]
    basicas = T["basicas"]
    
    print("Basicas:", basicas)
    print("Columnas:", columnas)
    
    # Check B_inv calculation in current code
    basis_indices = [columnas.index(var) for var in basicas]
    B_matrix = A_matrix[:, basis_indices]
    print("Basis Matrix from Final Tableau (should be Identity-like):\n", B_matrix)
    
    try:
        B_inv = np.linalg.inv(B_matrix)
        print("Calculated B_inv (current code):\n", B_inv)
    except Exception as e:
        print("Error calculating B_inv:", e)

    result = analisis_sensibilidad(mapped_solution)
    print("\nRangos Factibilidad Keys:", result["rangos_factibilidad"].keys())
    print("Rangos Factibilidad:", result["rangos_factibilidad"])
    print("\nPrecios Sombra Keys:", result["precios_sombra"].keys())
    print("Precios Sombra:", result["precios_sombra"])

if __name__ == "__main__":
    test_sensibility()
