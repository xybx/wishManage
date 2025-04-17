import progress from 'vite-plugin-vitebar'

export const createProgress = (env: Record<string, string>) => {
  return progress({ env })
}
