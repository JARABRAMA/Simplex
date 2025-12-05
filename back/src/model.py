from pydantic import BaseModel


class Simplex(BaseModel):
    c: list[float]
    A: list[list[float]]
    b: list[float]
    restrictions: list[str]
    type: str = "max"
