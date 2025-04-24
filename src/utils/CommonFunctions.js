function getRandomNumber() {
  return Math.floor(Math.random() * 100);
}

function convertToUpperCase(str) {
  return str.toUpperCase();
}


export const comm = {
  getRandomNumber,
  convertToUpperCase,
}