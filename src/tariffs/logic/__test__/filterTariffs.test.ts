import {describe, expect, it} from 'vitest';
import {FilterTariffInfo, Tariff} from '../../types';
import {filterTariff, filterTariffs, getTariffCost} from '../filterTariffs';

describe('tariffs', () => {
    describe('logic', () => {
        describe('filterTariffs', () => {
            describe('getTariffCost', () => {
                it('return tariff cost when no package', () => {
                    const emptyTariff: Tariff = {description: 'Тест тариф', id: '01', title: 'Тест тариф'};
                    expect(getTariffCost(emptyTariff)).toBe(0);
                });

                it('return tariff cost when exist only telefonyPackage', () => {
                    const tariff1: Tariff = {
                        description: 'Тест тариф',
                        id: '01',
                        title: 'Тест тариф',
                        telephonyPackage: {
                            incomingCall: false,
                            packOfMinutes: 5,
                            packCost: 5,
                            packCostPerMinute: false,
                            extraPackCost: 10,
                            extraPackCostPerMinute: false,
                        },
                        // @ts-ignore
                        internetPackage: null,
                    };
                    expect(getTariffCost(tariff1)).toBe(50);

                    const tariff2: Tariff = {
                        description: 'Тест тариф',
                        id: '01',
                        title: 'Тест тариф',
                        telephonyPackage: {
                            incomingCall: false,
                            packOfMinutes: 5,
                            packCost: 5,
                            packCostPerMinute: true,
                            extraPackCost: 10,
                            extraPackCostPerMinute: false,
                        },
                    };
                    expect(getTariffCost(tariff2)).toBe(250);
                });

                it('return tariff cost when exist only internetPackage', () => {
                    const tariff1: Tariff = {
                        description: 'Тест тариф',
                        id: '01',
                        title: 'Тест тариф',
                        internetPackage: {
                            packOfMB: 5,
                            packCost: 7,
                            packCostPerMB: false,
                            extraPackCost: 10,
                            extraPackCostPerMB: false,
                        },
                        // @ts-ignore
                        telephonyPackage: null,
                    };
                    expect(getTariffCost(tariff1)).toBe(70);

                    const tariff2: Tariff = {
                        description: 'Тест тариф',
                        id: '01',
                        title: 'Тест тариф',
                        internetPackage: {
                            packOfMB: 5,
                            packCost: 7,
                            packCostPerMB: true,
                            extraPackCost: 10,
                            extraPackCostPerMB: false,
                        },
                    };
                    expect(getTariffCost(tariff2)).toBe(350);
                });

                it('return tariff cost', () => {
                    const tariff1: Tariff = {
                        description: 'Тест тариф',
                        id: '01',
                        title: 'Тест тариф',
                        telephonyPackage: {
                            incomingCall: false,
                            packOfMinutes: 5,
                            packCost: 5,
                            packCostPerMinute: false,
                            extraPackCost: 10,
                            extraPackCostPerMinute: false,
                        },
                        internetPackage: {
                            packOfMB: 5,
                            packCost: 7,
                            packCostPerMB: false,
                            extraPackCost: 10,
                            extraPackCostPerMB: false,
                        },
                    };
                    expect(getTariffCost(tariff1)).toBe(120);

                    const tariff2: Tariff = {
                        description: 'Тест тариф',
                        id: '01',
                        title: 'Тест тариф',
                        telephonyPackage: {
                            incomingCall: false,
                            packOfMinutes: 5,
                            packCost: 5,
                            packCostPerMinute: true,
                            extraPackCost: 10,
                            extraPackCostPerMinute: false,
                        },
                        internetPackage: {
                            packOfMB: 5,
                            packCost: 7,
                            packCostPerMB: true,
                            extraPackCost: 10,
                            extraPackCostPerMB: false,
                        },
                    };
                    expect(getTariffCost(tariff2)).toBe(600);
                });
            });

            describe('filterTariffs', () => {
                const tariff1: Tariff = {
                    description: 'Тест тариф',
                    id: '01',
                    title: 'Тест тариф',
                    telephonyPackage: {
                        incomingCall: false,
                        packOfMinutes: 5,
                        packCost: 5,
                        packCostPerMinute: false,
                        extraPackCost: 10,
                        extraPackCostPerMinute: false,
                    },
                    internetPackage: {
                        packOfMB: 5,
                        packCost: 7,
                        packCostPerMB: false,
                        extraPackCost: 10,
                        extraPackCostPerMB: false,
                    },
                };
                const tariff2: Tariff = {
                    description: 'Какой-то Тариф',
                    id: '01',
                    title: 'Тариф',
                    telephonyPackage: {
                        incomingCall: false,
                        packOfMinutes: 5,
                        packCost: 5,
                        packCostPerMinute: false,
                        extraPackCost: 10,
                        extraPackCostPerMinute: false,
                    },
                    internetPackage: {
                        packOfMB: 5,
                        packCost: 7,
                        packCostPerMB: false,
                        extraPackCost: 10,
                        extraPackCostPerMB: false,
                    },
                };
                const tariffs = [tariff1, tariff2];

                it('return filtered tariffs when exist only search string', () => {
                    expect(filterTariffs(tariffs, {search: 'Тест'})).toStrictEqual([tariff1]);
                });

                it('return filtered tariffs when not exist filter and search', () => {
                    expect(filterTariffs(tariffs, {})).toStrictEqual([tariff1, tariff2]);
                });
            });

            describe('filterTariff', () => {
                const tariff1: Tariff = {
                    description: 'Тест тариф',
                    id: '01',
                    title: 'Тест тариф',
                    telephonyPackage: {
                        incomingCall: false,
                        packOfMinutes: 5,
                        packCost: 5,
                        packCostPerMinute: false,
                        extraPackCost: 10,
                        extraPackCostPerMinute: false,
                    },
                    internetPackage: {
                        packOfMB: 5,
                        packCost: 7,
                        packCostPerMB: false,
                        extraPackCost: 10,
                        extraPackCostPerMB: false,
                    },
                };
                const filters = {
                    costTariff: {min: '0', max: '1000'},
                    minutesTariff: {min: '0', max: '100'},
                    smsTariff: {min: '0', max: '100'},
                    internetTariff: {min: '0', max: '100'},
                };

                it('return true when filters not exist', () => {
                    expect(filterTariff(tariff1)).toBeTruthy();
                });

                it('return true when filters exist', () => {
                    expect(filterTariff(tariff1, filters)).toBeTruthy();
                });

                it('return false when filters exist', () => {
                    expect(
                        filterTariff(tariff1, {
                            costTariff: {min: '0', max: '15'},
                            minutesTariff: {min: '0', max: '0'},
                            smsTariff: {min: '0', max: '0'},
                            internetTariff: {min: '0', max: '0'},
                        }),
                    ).toBeFalsy();

                    expect(
                        filterTariff(tariff1, {
                            costTariff: {min: '10000', max: '0'},
                            minutesTariff: {min: '0', max: '0'},
                            internetTariff: {min: '0', max: '0'},
                            smsTariff: {min: '0', max: '0'},
                        }),
                    ).toBeFalsy();

                    expect(
                        filterTariff(tariff1, {
                            costTariff: {min: '0', max: '1000'},
                            minutesTariff: {min: '1000', max: '0'},
                            smsTariff: {min: '0', max: '0'},
                            internetTariff: {min: '0', max: '0'},
                        }),
                    ).toBeFalsy();

                    expect(
                        filterTariff(tariff1, {
                            costTariff: {min: '0', max: '1000'},
                            minutesTariff: {min: '0', max: '3'},
                            smsTariff: {min: '0', max: '0'},
                            internetTariff: {min: '0', max: '0'},
                        }),
                    ).toBeFalsy();

                    expect(
                        filterTariff(tariff1, {
                            costTariff: {min: '0', max: '1000'},
                            minutesTariff: {min: '0', max: '100'},
                            internetTariff: {min: '0', max: '100'},
                            smsTariff: {min: '1000', max: '0'},
                        }),
                    ).toBeFalsy();

                    expect(
                        filterTariff(tariff1, {
                            costTariff: {min: '0', max: '1000'},
                            minutesTariff: {min: '0', max: '100'},
                            internetTariff: {min: '0', max: '100'},
                            smsTariff: {min: '0', max: '0'},
                        }),
                    ).toBeFalsy();

                    expect(
                        filterTariff(tariff1, {
                            costTariff: {min: '0', max: '1000'},
                            minutesTariff: {min: '0', max: '100'},
                            smsTariff: {min: '0', max: '100'},
                            internetTariff: {min: '10000', max: '0'},
                        }),
                    ).toBeFalsy();

                    expect(
                        filterTariff(tariff1, {
                            costTariff: {min: '0', max: '1000'},
                            minutesTariff: {min: '0', max: '100'},
                            smsTariff: {min: '0', max: '100'},
                            internetTariff: {min: '0', max: '0'},
                        }),
                    ).toBeFalsy();
                });
            });
        });
    });
});
