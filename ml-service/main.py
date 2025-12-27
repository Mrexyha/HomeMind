from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn

app = FastAPI(title="HomeMind ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TrainRequest(BaseModel):
    model: str = "preference_predictor"
    train_window_days: int = 30


class TrainResponse(BaseModel):
    run_id: str
    status: str


class InferRequest(BaseModel):
    user_id: str
    context: Dict[str, Any]


class InferenceResult(BaseModel):
    action: Dict[str, Any]
    score: float


class InferResponse(BaseModel):
    suggestions: List[InferenceResult]


# In-memory storage for runs (in production, use database)
runs: Dict[str, Dict[str, Any]] = {}


@app.get("/")
def root():
    return {"service": "ML Service", "status": "running"}


@app.post("/ml/train", response_model=TrainResponse)
async def train_model(request: TrainRequest):
    """Start training a model"""
    import uuid
    run_id = str(uuid.uuid4())
    
    runs[run_id] = {
        "status": "running",
        "model": request.model,
        "train_window_days": request.train_window_days,
    }
    
    # In a real implementation, this would start an async training job
    # For now, we'll simulate it
    return TrainResponse(run_id=run_id, status="running")


@app.get("/ml/status/{run_id}")
async def get_training_status(run_id: str):
    """Get status of a training run"""
    if run_id not in runs:
        raise HTTPException(status_code=404, detail="Run not found")
    
    run = runs[run_id]
    # Simulate completion after some time
    if run["status"] == "running":
        # In production, check actual training status
        pass
    
    return {
        "run_id": run_id,
        "status": run["status"],
        "model": run["model"],
        "metrics": {
            "accuracy": 0.85,
            "f1_score": 0.82,
            "rmse": 2.5,
        } if run["status"] == "completed" else None,
    }


@app.post("/ml/infer", response_model=InferResponse)
async def infer(request: InferRequest):
    """Get ML inference/predictions"""
    # Simple mock inference
    # In production, this would load a trained model and make predictions
    
    suggestions = [
        InferenceResult(
            action={
                "deviceId": "d1",
                "command": {"on": True, "brightness": 80}
            },
            score=0.87
        ),
        InferenceResult(
            action={
                "deviceId": "d2",
                "command": {"temperature": 22}
            },
            score=0.75
        ),
    ]
    
    return InferResponse(suggestions=suggestions)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

