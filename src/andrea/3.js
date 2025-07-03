export const toSoroAsync = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })

export const callCbAfterTime = (cb, time = 10000) => {
  setTimeout(() => cb(), time)
}
