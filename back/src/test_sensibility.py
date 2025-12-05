import unittest
from sensibility import analisis_sensibilidad, normalizar_tableau
from granm import GranM
from mapper import map_solution
class TestSensibility(unittest.TestCase):

    def test_sensibility(self): 
        A = [[1, 0], [0, 2], [3, 2]]
        b = [4, 12, 18]
        c = [3, 5]
        restrictions = ["<=", "<=", "<="]
        model = GranM(c, A, b, restrictions)

        solucion, Z, historial, grafica = model.resolver()
        resultado = map_solution(historial, solucion, Z, grafica)


        sensibilidad = analisis_sensibilidad(resultado) 
        print(sensibilidad)


if __name__ == "__main__":
    unittest.main()

