import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import joblib


class FPQIModel:

    def __init__(self):
        self.model = LinearRegression()

    def train(self, dataset_path):
        df = pd.read_csv(dataset_path)

        X = df[[
            "moisture_score",
            "soil_score",
            "heat_index",
            "freshness_score",
            "storage_risk_score"
        ]]

        y = df["fpqi"]

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        self.model.fit(X_train, y_train)

        score = self.model.score(X_test, y_test)
        print("Model R2 Score:", score)

    def save_model(self, path):
        joblib.dump(self.model, path)

    def load_model(self, path):
        self.model = joblib.load(path)

    def predict(self, features: dict):

        input_data = [[
            features["moisture_score"],
            features["soil_score"],
            features["heat_index"],
            features["freshness_score"],
            features["storage_risk_score"]
        ]]

        prediction = self.model.predict(input_data)[0]
        return round(prediction, 2)

    @staticmethod
    def classify_grade(fpqi):
        if fpqi >= 80:
            return "Premium"
        elif fpqi >= 65:
            return "Processing"
        else:
            return "Secondary"