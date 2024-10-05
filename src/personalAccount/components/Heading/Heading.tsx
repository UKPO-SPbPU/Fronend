import {memo} from "react";

interface HeadingProps {
    header: string;
    description: string;
}

export const Heading = memo(function Heading(props: HeadingProps) {
    const {header, description} = props;
    return (<div>
        <h5 className='user-data-person fw-normal'>
            {header}
        </h5>
        <h5 className="user-data-phone fw-normal">
            {description}
        </h5>
    </div>)
})