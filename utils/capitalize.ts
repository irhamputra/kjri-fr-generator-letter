export default function capitalizeFirstLetter(string: string) {
  return string.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
}
