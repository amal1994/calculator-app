export const toLocaleString = (num) =>
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

export const  isFloat = (x) => {return !!(x % 1)}

export const removeSpaces = (num) => num.toString().replace(/\s/g, "");