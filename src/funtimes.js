export const index = (array, key) => {
  return array.reduce( (object, element) => {
    object[element[key]] = element
    return object
    // eslint-disable-next-line
  }, new Object)
}

export const group = (array, key) => {
  return array.reduce( (object, element) => {
    // eslint-disable-next-line
    object[element[key]] = object[element[key]] || new Array
    object[element[key]].push(element)
    return object
    // eslint-disable-next-line
  }, new Object)
}

export const capitalize = (string) => {
  return string[0].toUpperCase() + string.slice(1);
}