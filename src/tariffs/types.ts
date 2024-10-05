export interface Tariffs {
    tariffs: Tariff[];
}

export interface Tariff {
    id: string;
    title: string;
    description: string;
    telephonyPackage?: TelephonyPackage;
    internetPackage?: InternetPackage;
}

export interface TelephonyPackage {
    incomingCall: boolean;
    packOfMinutes: number;
    packCost: number;
    packCostPerMinute: boolean;
    extraPackCost: number;
    extraPackCostPerMinute: boolean;
}

export interface InternetPackage {
    packOfMB: number;
    packCost: number;
    packCostPerMB: boolean;
    extraPackCost: number;
    extraPackCostPerMB: boolean;
}

export interface FiltersTariffs {
    costTariff: FilterTariffInfo;
    minutesTariff: FilterTariffInfo;
    smsTariff: FilterTariffInfo;
    internetTariff: FilterTariffInfo;
}

export interface FilterTariffInfo {
    min: string;
    max: string;
}
