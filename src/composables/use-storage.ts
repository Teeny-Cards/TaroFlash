export function useStorage() {
  function get<T = any>(key: string): T | undefined {
    return localStorage.getItem(key) as T | undefined
  }

  function set(key: string, value: string) {
    localStorage.setItem(key, value)
  }

  return {
    get,
    set
  }
}
