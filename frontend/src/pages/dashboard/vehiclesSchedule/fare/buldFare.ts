export interface Station {
  id: number;
  name: string;
}

export interface ViaRoute {
  id: number;
  station: Station;
}

export const buildPairs = (routes: ViaRoute[]) => {
  const pairs: { from: Station; to: Station }[] = [];
  for (let i = 0; i < routes.length; i++) {
    for (let j = i + 1; j < routes.length; j++) {
      pairs.push({ from: routes[i].station, to: routes[j].station });
    }
  }
  return pairs;
};