# Smart Home Management System with Adaptive AI Automation

**Short description:** A smart home prototype with a web interface, backend API, and a dedicated ML service that learns user behavior and provides adaptive automation and recommendations.

---

## Overview

- **Frontend:** React (+ TypeScript)
- **Backend:** NestJS
- **ML Service:** Python (FastAPI)
- **Simulators:** Node.js / Python scripts for telemetry and user behavior simulation
- **Database:** PostgreSQL
- **Message Broker (optional):** MQTT (Mosquitto) / Redis
- **Containerization:** Docker + `docker-compose`

## Repository Structure

```
/project-root
  /frontend       # React application
  /backend        # NestJS API
  /ml-service     # FastAPI + ML logic
  /simulators     # Device and user simulators (Node/Python)
  docker-compose.yml
  README.md
```

## Project Goal

The goal of this project is to design and implement a smart home management system that allows users to control devices, collect telemetry data, configure automation rules, and leverage AI/ML to adapt automation behavior based on user habits and environmental context.

## Key Features

- Real-time monitoring of smart home devices
- Manual control of devices (on/off, brightness, temperature, etc.)
- Rule-based automation (trigger → condition → action)
- Collection and storage of device telemetry data
- AI/ML service for model training and inference
- Adaptive recommendations based on user behavior patterns
- Device and user behavior simulators for testing
- Local deployment using Docker Compose

## Quick Start (Local)

### Prerequisites

- Docker & Docker Compose
- Node.js (for local frontend/simulator development)
- Python 3.9+ (for local ML service development if not using Docker)

### Run with Docker (recommended)

1. Clone the repository:

```bash
git clone <repo-url>
cd project-root
```

2. Build and start all services:

```bash
docker-compose up --build
```

3. Open the web UI:

```
http://localhost:3000
```

(Port may vary depending on configuration.)

## Development Guide

### Frontend

- Built with React and TypeScript
- Development mode:

```bash
cd frontend
npm install
npm run dev
```

### Backend

- Built with NestJS
- Provides REST API and authentication
- Local run:

```bash
cd backend
npm install
npm run start:dev
```

### ML Service

- Built with FastAPI
- Handles model training and inference
- Local run:

```bash
cd ml-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

- Main endpoints:

  - `POST /ml/train` – start model training
  - `GET /ml/status/{id}` – training status
  - `POST /ml/infer` – get predictions or recommendations

### Simulators

- Used to generate synthetic telemetry and user actions
- Can publish data via HTTP or MQTT

Example:

```bash
cd simulators
node simulate_mqtt.js --scenario day-night --rate 1s
python simulate_user.py --profile office_worker --start 2025-12-01
```

## API Overview (Simplified)

**Authentication**

- `POST /auth/login`

**Devices**

- `GET /api/devices`
- `POST /api/devices/{id}/command`

**Telemetry**

- `POST /api/telemetry`
- `GET /api/telemetry?deviceId=&from=&to=`

**Automations**

- `GET /POST /PUT /DELETE /api/automations`

**ML Service**

- `POST /ml/train`
- `POST /ml/infer`

## Data Model (High Level)

- `users` – user accounts and roles
- `devices` – registered smart devices
- `device_data` – telemetry and sensor data
- `automations` – automation rules
- `ml_models` – trained ML models
- `model_runs` – training runs and metrics

## AI / ML Concept

- **Tasks:**

  - Predicting user actions (e.g., when to turn lights on/off)
  - Detecting anomalies in device behavior
  - (Optional) Energy optimization via reinforcement learning

- **Approaches:**

  - Supervised learning (Random Forest, XGBoost)
  - Time-series models (LSTM, Transformer)
  - Anomaly detection (Isolation Forest, Autoencoders)

- **Metrics:** Accuracy, F1-score, RMSE, Precision@K, energy savings

## Docker Compose

The `docker-compose.yml` file defines the following services:

- frontend
- backend
- ml-service
- postgres
- mosquitto (MQTT broker, optional)
- redis (optional)

## Testing

- Unit tests: Jest (frontend/backend), pytest (ML)
- Integration tests: full stack via Docker Compose
- End-to-end tests: Playwright (optional)

## Known Limitations

- ML model quality depends on data volume and quality; simulated data is used for the course project.
- Reinforcement learning approaches may be simplified due to time and complexity constraints.

## Academic Context

This project is developed as a **course project**, focusing on system architecture, integration of AI components, and practical application of modern web and backend technologies.

## Future Improvements

- Integration with real IoT devices
- Advanced visualization dashboards
- Online learning and continuous model updates
- Role-based access control and multi-user households

---
