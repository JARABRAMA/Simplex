from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.granm import GranM
from src.mapper import map_solution
from src.sensibility import analisis_sensibilidad

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "simplex"}


@app.post("/simplex")
async def resolver_simplex(data: dict):
    c = data["c"]
    A = data["A"]
    b = data["b"]
    tipo_restr = data["restrictions"]
    tipo_obj = data.get("type", "max")

    modelo = GranM(c, A, b, tipo_restr, tipo_obj)
    solucion, Z, historial, grafica = modelo.resolver()

    mapped_solution = map_solution(historial, solucion, Z, grafica)

    sensibilidad = analisis_sensibilidad(mapped_solution)

    mapped_solution["sesibilidad"] = sensibilidad

    return mapped_solution
