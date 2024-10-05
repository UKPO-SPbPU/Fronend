import {memo, useState} from 'react';
import {TariffCard} from '../TariffCard';

import {Tariff} from '../../types';

import './TariffSlider.css';

export interface PropsTariffSlider {
    tariffs: Tariff[] | undefined;
    tariffIdSelect: string;
}

export const TariffsSlider = memo(function TariffsSlider({tariffs, tariffIdSelect}: PropsTariffSlider) {
    const [tariffId, setTariffId] = useState(tariffIdSelect);

    if (!tariffs) {
        return null;
    }

    return (
        <div className="movies">
            {tariffs?.length === 0 && (
                <div className="alert alert-primary mt-4 col-7 offset-2" role="alert">
                    Тарифов по вашему запросу не найдено. Используйте другой запрос.
                </div>
            )}

            {tariffs?.length !== 0 && (
                <div className="container">
                    <ul className="cards">
                        {tariffs?.map((tariff, idx) => {
                            return (
                                <TariffCard key={idx} tariff={tariff} tariffId={tariffId} onSetTariffId={setTariffId} />
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
});
