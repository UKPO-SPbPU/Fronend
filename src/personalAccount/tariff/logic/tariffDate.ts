export const getNearestWithdrawal = (contractDate: string) => {
    const today = new Date();
    const month = today.getMonth() + 2;
    const monthWithdrawal = month === 13 ? '01' : month < 10 ? `0${month}` : String(month);
    const day = contractDate.slice(0,2);
    const year = month === 13 ? today.getFullYear() + 1 : today.getFullYear();

    return `${day}.${monthWithdrawal}.${year}`;
}