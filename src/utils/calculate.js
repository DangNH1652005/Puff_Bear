export function calculateTotalPrice(unitPrice, quantity) {
    const price = Number(unitPrice);
    const qty = Number(quantity);
    return price * qty;
}

export const formatDate = (dateString) => new Intl.DateTimeFormat("vi-VN").format(new Date(dateString));