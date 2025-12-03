import unittest
from granm import GranM


class TestGramM(unittest.TestCase):

    def test_standard_simplex(self):
        A = [[1, 0], [0, 2], [3, 2]]
        b = [4, 12, 18]
        c = [3, 5]
        restrictions = ["<=", "<=", "<="]
        model = GranM(c, A, b, restrictions)

        solution, z_value, _, _ = model.resolver()

        expected_solution = [2, 6]
        expected_z = 36

        # assert has the same lenght
        self.assertEqual(len(expected_solution), len(solution))

        for i in range(0, len(solution)):  # assert each element is equals
            self.assertEqual(solution[i], expected_solution[i])

        self.assertEqual(z_value, expected_z)

    def test_non_standard_simplex(self):
        A = [[0.3, 0.1], [0.5, 0.5], [0.6, 0.4]]
        c = [0.4, 0.5]
        b = [2.7, 6, 6]
        restriccones = ["<=", "=", ">="]

        model = GranM(c=c, A=A, b=b, tipo_restr=restriccones)

        solution, z_value, _, _ = model.resolver()

        print(f"solution: {solution}, and z value: {z_value}")

        expected_solution = [6, 6]
        expected_z = 5.4
        # assert has the same lenght
        self.assertEqual(len(expected_solution), len(solution))

        for i in range(0, len(solution)):  # assert each element is equals
            self.assertAlmostEqual(float(solution[i]), expected_solution[i], places=6)

        self.assertEqual(float(z_value), expected_z)

    def test_non_standard_simplex_minimization(self):
        c = [2500, 700]
        A = [
            [3, 2],
            [3, 6],
        ]
        b = [40, 75]
        restrictions = [">=", ">="]

        model = GranM(c=c, A=A, b=b, tipo_restr=restrictions, tipo_obj="min")

        solution, z_value, _, _ = model.resolver()

        expected_solution = [0, 20]
        expected_z = 14000
        # assert has the same lenght
        self.assertEqual(len(expected_solution), len(solution))

        for i in range(0, len(solution)):  # assert each element is equals
            self.assertAlmostEqual(float(solution[i]), expected_solution[i], places=6)

        self.assertEqual(float(z_value), expected_z)


if __name__ == "__main__":
    unittest.main()
# end main
