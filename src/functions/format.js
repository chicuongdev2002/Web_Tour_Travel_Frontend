const formatMoney = (amount) => {
    amountString = amount + ''
    if (amountString.length <= 3) {
        return amountString;
    }
    return `${(amount / 100).toFixed(2)}`;
}
export { formatMoney }