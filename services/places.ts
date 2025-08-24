export type NearbySalonPlace = {
  place_id: string;
  name: string;
  geometry: { location: { lat: number; lng: number } };
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: { open_now?: boolean };
  vicinity?: string;
};

/**
 * Fetch nearby salons/barbers using Google Places Nearby Search API
 */
export async function fetchNearbySalons(
  latitude: number,
  longitude: number,
  radiusMeters: number = 3000
): Promise<NearbySalonPlace[]> {
  console.log('🗺️ fetchNearbySalons: Starting places search...', { latitude, longitude, radiusMeters });
  
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  console.log('🔑 Google Maps API Key status:', apiKey ? 'Present' : 'Missing');
  
  if (!apiKey) {
    console.log('⚠️ No Google Maps API key, using OSM fallback...');
    // Lazy import OSM fallback to avoid circular deps
    const { fetchNearbySalonsOSM } = await import('./osm');
    const osmResults = await fetchNearbySalonsOSM(latitude, longitude, radiusMeters);
    console.log('✅ OSM results:', osmResults.length);
    return osmResults as unknown as NearbySalonPlace[];
  }

  const params = new URLSearchParams({
    location: `${latitude},${longitude}`,
    radius: String(radiusMeters),
    // Prefer hair_care / beauty_salon types and barber/salon keyword
    type: 'hair_care',
    keyword: 'barber|salon',
    key: apiKey,
  });

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params.toString()}`;
  console.log('🌐 Making Places API request...');
  
  const response = await fetch(url);
  console.log('📡 Places API response status:', response.status);
  
  if (!response.ok) {
    throw new Error(`Places request failed: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log('📊 Places API response:', { status: data.status, results_count: data.results?.length || 0 });
  
  if (data.status && data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    // Return empty list on ZERO_RESULTS; throw on other errors
    throw new Error(`Places API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
  }

  const results: NearbySalonPlace[] = (data.results || []).map((r: any) => ({
    place_id: r.place_id,
    name: r.name,
    geometry: r.geometry,
    rating: r.rating,
    user_ratings_total: r.user_ratings_total,
    opening_hours: r.opening_hours,
    vicinity: r.vicinity,
  }));

  console.log('✅ Places processed:', results.length);
  return results;
}


