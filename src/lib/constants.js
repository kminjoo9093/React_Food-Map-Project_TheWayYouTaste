export const QUERY_KEYS = {
  region: {
    coords: (lat, lng) => ['region', lat, lng],
    sgg: (sidoCode) => ['region', 'sgg', sidoCode],
    dong: (sggCode) => ['region', 'dong', sggCode],
  },
  stores: {
    list: (params) => ['stores', 'list', params],
    viewport: (viewport) => ['stores', 'viewport', viewport],
    detail: (storeId) => ['store', storeId],
  }
}