export function getSizeSurcharge(sizeName) {
  switch ((sizeName || "").toUpperCase()) {
    case "S":
      return 0;
    case "M":
      return 5000;
    case "L":
      return 10000;
    case "XL":
      return 20000;
    case "XXL":
      return 40000;
    default:
      return 0;
  }
}

export default getSizeSurcharge;
