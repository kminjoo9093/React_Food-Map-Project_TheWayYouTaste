export const QUERY_KEYS = {
  region: {
    coords: (lat, lng) => ['region', lat, lng],
    sgg: (sidoCode) => ['region', 'sgg', sidoCode],
    dong: (sggCode) => ['region', 'dong', sggCode],
  },
  stores: {
    list: (sggCode) => ['stores', 'list', sggCode],
  }
}