export function sample(array: Array<any>): any {
  return array[rand(array.length)]
}

export function rand(n: number): number {
  const kokuRandom = (Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) / 5.0
  return Math.floor(kokuRandom * n)
}
