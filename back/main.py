from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.algorithms import GranM

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
    solucion, Z, historial = modelo.resolver()

    # Convertir la solución a listas JSON-friendly
    historial_serializado = []
    for paso in historial:
        paso_serializado = {
            "iteracion": paso["iteracion"],
            "descripcion": paso["descripcion"],
            "tabla": paso["tabla"].to_dict(orient="records"),
            "Zj": paso["Zj"].tolist(),
            "Cj": paso["Cj"].tolist(),
            "basicas": paso["basicas"],
        }
        historial_serializado.append(paso_serializado)

    return {
        "solucion": solucion.tolist(),
        "Z": float(Z),
        "historial": historial_serializado,
    }
