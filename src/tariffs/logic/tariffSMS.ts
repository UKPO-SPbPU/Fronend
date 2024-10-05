export const getTariffSMSCount = (id: string) => {
    if (id === '01') {
        return 30;
    }
    if (id === '02') {
        return 10;
    }
    if (id === '03') {
        return 15;
    }
    if (id === '04') {
        return 10;
    }
    if (id === '05') {
        return 25;
    }
    if (id === '06') {
        return 30;
    }
    return 0;
}