export function calculateTotalPrice(unitPrice, quantity) {
    const price = Number(unitPrice);
    const qty = Number(quantity);
    return price * qty;
}