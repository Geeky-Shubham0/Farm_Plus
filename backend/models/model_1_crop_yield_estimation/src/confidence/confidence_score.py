import numpy as np

def confidence_score(rf_model, X_processed):
    all_preds = np.array([tree.predict(X_processed) for tree in rf_model.estimators_])  # (n_trees, n_samples)
    means = all_preds.mean(axis=0)
    stds = all_preds.std(axis=0)
    scores = 1 - stds / (means + 1e-8)
    return np.clip(scores, 0, 1)

if __name__ == "__main__":
    from sklearn.ensemble import RandomForestRegressor
    import numpy as np

    X = np.random.rand(10, 4)
    y = np.random.rand(10)
    model = RandomForestRegressor(n_estimators=10, random_state=42)
    model.fit(X, y)

    single_score = confidence_score(model, X[0].reshape(1, -1))[0]
    print(f"Confidence score (single sample): {single_score:.4f}")

    batch_scores = confidence_score(model, X)
    print(f"Confidence scores (batch): {batch_scores}")