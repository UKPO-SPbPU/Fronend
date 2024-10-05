import {memo} from "react";
import {Heading} from "../../../components";

interface TariffDataProps {
    title: string;
}

export const TariffData = memo(function TariffData({title}: TariffDataProps){
    return <Heading header="Тариф" description={title} />
})