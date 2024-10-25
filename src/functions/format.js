import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const formatMoney = (amount) => {
    amountString = amount + ''
    if (amountString.length <= 3) {
        return amountString;
    }
    return `${(amount / 100).toFixed(2)}`;
}

const formatDate = (date) => {
    const formattedDate = format(new Date(date), "HH:mm eeee, 'ngày' dd 'tháng' MM 'năm' yyyy", { locale: vi });
    return formattedDate;
}
export { formatMoney, formatDate }