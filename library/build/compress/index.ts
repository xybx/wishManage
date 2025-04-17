import compressPlugin from 'vite-plugin-compression'

export const createCompress = (compress: any) => {
  if (compress === 'brotli') {
    return compressPlugin({
      ext: '.br',
      algorithm: 'brotliCompress',
    })
  }

  if (compress === 'gzip' || compress) {
    return compressPlugin({
      ext: '.gz',
    })
  }

  return []
}
