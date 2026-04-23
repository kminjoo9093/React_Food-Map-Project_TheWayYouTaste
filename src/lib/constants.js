export const QUERY_KEYS = {
  region: {
    coords: (lat, lng) => ['region', lat, lng],
  },
  stores: {
    list: (sggCode) => ['stores', 'list', sggCode],
  }
}