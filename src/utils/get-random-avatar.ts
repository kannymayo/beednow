import { faker } from '@faker-js/faker'

const animalAvatarsFraction = [
  '3940/3940403',
  '4322/4322991',
  '3940/3940417',
  '4322/4322992',
  '1326/1326377',
  '1308/1308845',
  '1326/1326405',
  '1326/1326382',
  '1326/1326415',
  '9049/9049760',
  '1326/1326388',
  '1326/1326389',
]

function getAnimalAvatar() {
  const index = Math.floor(Math.random() * animalAvatarsFraction.length)
  const fraction = animalAvatarsFraction[index]
  return `https://cdn-icons-png.flaticon.com/512/${fraction}.png`
}

function getRandomAvatar() {
  return faker.image.avatar()
}

export { getRandomAvatar, getAnimalAvatar }
