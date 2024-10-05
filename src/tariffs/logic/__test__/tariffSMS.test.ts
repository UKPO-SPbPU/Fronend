import {describe, expect, it} from 'vitest';
import {getTariffSMSCount} from '../tariffSMS';

describe('tariffs', () => {
    describe('logic', () => {
        describe('tariffSMS', () => {
            it('return count sms for 1 tariff', () => {
                expect(getTariffSMSCount('01')).toBe(30);
            });

            it('return count sms for 2 tariff', () => {
                expect(getTariffSMSCount('02')).toBe(10);
            });

            it('return count sms for 3 tariff', () => {
                expect(getTariffSMSCount('03')).toBe(15);
            });

            it('return count sms for 4 tariff', () => {
                expect(getTariffSMSCount('04')).toBe(10);
            });

            it('return count sms for 5 tariff', () => {
                expect(getTariffSMSCount('05')).toBe(25);
            });

            it('return count sms for 6 tariff', () => {
                expect(getTariffSMSCount('06')).toBe(30);
            });

            it('return count sms for unknown tariff', () => {
                expect(getTariffSMSCount('07')).toBe(0);
            });
        });
    });
});
