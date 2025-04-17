import { visualizer } from 'rollup-plugin-visualizer'

export const createVisualizer: any = () => {
  return visualizer({
    filename: 'stats.html',
    title: 'Rollup Stats',
    gzipSize: true,
    brotliSize: true,
    emitFile: true,
  })
}
