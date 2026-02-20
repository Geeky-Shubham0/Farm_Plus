const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<TResponse>(
  path: string,
  method: HttpMethod,
  body?: unknown,
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}

export function postJson<TResponse>(path: string, body: unknown) {
  return request<TResponse>(path, 'POST', body);
}

export interface CropYieldRequest {
  Crop: string;
  Season: string;
  State: string;
  Crop_Year: number;
  Area: number;
  Production: number;
  Annual_Rainfall: number;
  fertilizer_per_area: number;
  pesticide_per_area: number;
  soil_type: string;
  rainfall_deviation: number;
}

export interface CropYieldResponse {
  base_yield: number;
  adjusted_yield: number;
  confidence: number;
}

export interface RiskRequest {
  weather_volatility: number;
  price_fluctuation: number;
  crop_sensitivity: number;
}

export interface RiskResponse {
  risk_level: string;
}

export interface LivestockRequest {
  movement: number;
  feeding: number;
  resting: number;
  temperature: number;
}

export interface LivestockResponse {
  health_status: string;
  confidence_percent: number;
  recommended_action: string;
}

export interface PriceIntelligenceRequest {
  crop: string;
  mandi?: string;
  zip_code?: string;
  country_code?: string;
  days?: number;
}

export interface PriceForecastItem {
  date: string;
  predicted_price: number;
}

export interface PriceIntelligenceResponse {
  selected_mandi: string;
  forecast: PriceForecastItem[];
  export_analysis?: Record<string, unknown>;
}

export function predictCropYield(body: CropYieldRequest) {
  return postJson<CropYieldResponse>('/predict', body);
}

export function predictRisk(body: RiskRequest) {
  return postJson<RiskResponse>('/predict-risk', body);
}

export function predictLivestock(body: LivestockRequest) {
  return postJson<LivestockResponse>('/predict-livestock', body);
}

export function getPriceIntelligence(body: PriceIntelligenceRequest) {
  return postJson<PriceIntelligenceResponse>('/price-intelligence', body);
}
