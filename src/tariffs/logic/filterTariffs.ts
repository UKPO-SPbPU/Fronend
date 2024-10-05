import {FiltersTariffs, Tariff} from '../types';
import {getTariffSMSCount} from './tariffSMS';

export const filterTariffs = (
    tariffs: Tariff[] | undefined,
    {search, filters}: {search?: string; filters?: FiltersTariffs},
) => {
    if (!search && !filters) {
        return tariffs;
    }

    const lowerSearch = search?.toLowerCase();
    const filteredTariffsBySearch = tariffs?.filter((tariff) => tariff.title.toLowerCase().includes(lowerSearch || ''));
    return filteredTariffsBySearch?.filter((tariff) => filterTariff(tariff, filters));
};

export const filterTariff = (tariff: Tariff, filters?: FiltersTariffs) => {
    if (!filters) {
        return true;
    }

    const {costTariff, minutesTariff, smsTariff, internetTariff} = filters;

    let checked = true;
    const cost = getTariffCost(tariff);
    if (costTariff.min) {
        checked = cost >= Number(costTariff.min);

        if (!checked) {
            return false;
        }
    }
    if (costTariff.max) {
        checked = cost <= Number(costTariff.max);

        if (!checked) {
            return false;
        }
    }

    if (minutesTariff.min) {
        checked = (tariff?.telephonyPackage?.packOfMinutes || 0) >= Number(minutesTariff.min);

        if (!checked) {
            return false;
        }
    }

    if (minutesTariff.max) {
        checked = (tariff?.telephonyPackage?.packOfMinutes || 0) <= Number(minutesTariff.max);

        if (!checked) {
            return false;
        }
    }

    if (internetTariff.min) {
        checked = (tariff?.internetPackage?.packOfMB || 0) / 1024 >= Number(internetTariff.min);

        if (!checked) {
            return false;
        }
    }

    if (internetTariff.max) {
        checked = (tariff?.internetPackage?.packOfMB || 0) / 1024 <= Number(internetTariff.max);

        if (!checked) {
            return false;
        }
    }

    const smsCount = getTariffSMSCount(tariff.id);
    if (smsTariff.min) {
        checked = smsCount >= Number(smsTariff.min);

        if (!checked) {
            return false;
        }
    }

    if (smsTariff.max) {
        checked = smsCount <= Number(smsTariff.max);

        if (!checked) {
            return false;
        }
    }

    return checked;
};

export const getTariffCost = (tariff: Tariff) => {
    const {telephonyPackage, internetPackage} = tariff;
    const tariffCostMinutes = () => {
        if (telephonyPackage === null) {
            return 0;
        }
        return telephonyPackage?.packCostPerMinute
            ? telephonyPackage.packCost * telephonyPackage.packOfMinutes
            : telephonyPackage?.packCost || 0;
    };

    const tariffCostInternet = () => {
        if (internetPackage === null) {
            return 0;
        }
        return internetPackage?.packCostPerMB
            ? internetPackage.packCost * internetPackage.packOfMB
            : internetPackage?.packCost || 0;
    };

    return (tariffCostInternet() + tariffCostMinutes()) * 10;
};
