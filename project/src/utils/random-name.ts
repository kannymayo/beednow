const color = [
  'red',
  'orange',
  'black',
  'pink',
  'purple',
  'green',
  'white',
  'yellow',
  'green',
  'blue',
]

const fruits = [
  'apple',
  'banana',
  'orange',
  'grape',
  'watermelon',
  'strawberry',
  'pineapple',
  'pear',
  'peach',
  'mango',
]

function getRandomName() {
  const randomColor = color[Math.floor(Math.random() * color.length)]
  const randomFruit = fruits[Math.floor(Math.random() * fruits.length)]
  return `${capitalize(randomColor)} ${capitalize(randomFruit)}`
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase()
}

export { getRandomName }
