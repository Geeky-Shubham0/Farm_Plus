# Model 1: Crop Yield Estimation

This directory contains all code, data, and requirements for the base crop yield estimation model used in Farm Plus.

## Directory Structure

- `data/`
  - `raw/`: Raw input data (e.g., `crop_yield.csv`)
  - `processed/`: Cleaned and feature-engineered data, train/test splits
- `models/`: Saved model artifacts (e.g., `base_crop_yield_model.pkl`)
- `src/`: Source code for data prep, training, prediction, confidence scoring, and local adjustment
- `requirements.txt`: Python dependencies for this model
- `test.py`: (Optional) Test script for model functions

## Main Scripts

- `src/data_prep.py`: Cleans and preprocesses raw data
- `src/feature_engineering.py`: (If present) Feature engineering steps
- `src/train_base_model.py`: Trains the RandomForestRegressor model and saves it
- `src/predict_base_yield.py`: (If present) Predicts yield for new data
- `src/confidence/confidence_score.py`: Computes model confidence for predictions
- `src/local_adjustment/apply_adjustment.py`: Adjusts yield based on local factors
- `src/evaluate_model.py`: Evaluates model performance on test data

## How to Use

1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Prepare data**
   - Place your raw data in `data/raw/` (e.g., `crop_yield.csv`).
   - Run the data preparation script:
     ```bash
     python src/data_prep.py
     ```

3. **Train the model**
   ```bash
   python src/train_base_model.py
   ```
   This will save the trained model in `models/base_crop_yield_model.pkl` and create train/test splits.

4. **Evaluate the model**
   ```bash
   python src/evaluate_model.py
   ```

5. **API Usage**
   - The model can be served via FastAPI (see the main backend API for integration).

## Requirements
See `requirements.txt` for all dependencies.

## Notes
- Make sure all subfolders contain `__init__.py` if you want to import modules across directories.
- Adjust feature names and data columns as needed for your dataset.

---

For questions or improvements, please open an issue or contact the maintainers.
