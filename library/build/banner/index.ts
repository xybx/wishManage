import banner from 'vite-plugin-banner'

export const createBanner = () => {
  return [
    banner(
      ` build: \u0056\u0069\u0074\u0065\u0020\u0043\u006f\u0064\u0065\u0020\u0041\u0070\u0070 \n  time: ${process.env.VITE_APP_UPDATE_TIME} \n`
    ),
  ]
}
