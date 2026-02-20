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

export interface AgroImpactResponse {
  impact: string;
  confidence: number;
}

export interface AgroImpactLiteRequest {
  latitude: number;
  longitude: number;
  crop: string;
  sowing_date: string;
  pest_level: string;
}

export interface AgroImpactRequest {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  soil_moisture: number;
  soil_type: number;
  sunlight_exposure: number;
  wind_speed: number;
  co2_concentration: number;
  organic_matter: number;
  irrigation_frequency: number;
  crop_density: number;
  pest_pressure: number;
  fertilizer_usage: number;
  growth_stage: number;
  urban_area_proximity: number;
  water_source_type: number;
  frost_risk: number;
  water_usage_efficiency: number;
}

export interface SellRecommendationRequest {
  crop: string;
  mandi?: string;
  zip_code?: string;
  days?: number;
  weather_input: AgroImpactRequest;
}

export interface SellRecommendationResponse {
  selected_mandi: string;
  trend_analysis: Record<string, unknown>;
  volatility_analysis: Record<string, unknown>;
  weather_risk: string;
  storage_risk: string;
  export_analysis: Record<string, unknown>;
  final_recommendation: string;
  confidence_score: number;
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

export function predictAgroImpact(body: AgroImpactRequest) {
  return postJson<AgroImpactResponse>('/agro-impact', body);
}

export function predictAgroImpactLite(body: AgroImpactLiteRequest) {
  return postJson<AgroImpactResponse>('/agro-impact-lite', body);
}

export function getSellRecommendation(body: SellRecommendationRequest) {
  return postJson<SellRecommendationResponse>('/sell-recommendation', body);
}
