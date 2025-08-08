export type OSMPlace = {
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
};

function buildAddress(tags: Record<string, string> | undefined): string | undefined {
  if (!tags) return undefined;
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:city'],
    tags['addr:postcode'],
  ].filter(Boolean);
  return parts.length ? parts.join(', ') : tags['addr:full'] || tags['addr:place'];
}

export async function fetchNearbySalonsOSM(
  latitude: number,
  longitude: number,
  radiusMeters: number = 3000
) {
  // hairdressers / barbers often tagged as shop=hairdresser, amenity=barber, shop=beauty
  const query = `[
    out:json
  ];(
    node["shop"="hairdresser"](around:${radiusMeters},${latitude},${longitude});
    node["amenity"="barber"](around:${radiusMeters},${latitude},${longitude});
    node["shop"="beauty"](around:${radiusMeters},${latitude},${longitude});
  );out body ${Math.min(200, Math.floor(radiusMeters / 20))};`;

  const url = 'https://overpass-api.de/api/interpreter';
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    body: query,
  });
  if (!response.ok) {
    throw new Error(`OSM Overpass request failed: ${response.status}`);
  }
  const data = await response.json();
  const elements: OSMPlace[] = data.elements || [];

  return elements.map((e) => ({
    place_id: String(e.id),
    name: e.tags?.name || 'Salon',
    geometry: { location: { lat: e.lat, lng: e.lon } },
    vicinity: buildAddress(e.tags),
  }));
}


