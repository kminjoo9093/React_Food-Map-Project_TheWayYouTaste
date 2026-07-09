export function memoizeAsync<T>(fetcher: () => Promise<T>): () => Promise<T> {
  let promise: Promise<T> | null = null;
  return () => {
    if (!promise) {
      promise = fetcher();
    }
    return promise;
  };
}
