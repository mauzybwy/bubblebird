import { Spinner } from 'react-bootstrap';

export const LoadingSpinner = (props: {
    show: boolean;
    className?: string;
}): JSX.Element | null => {
    if (props.show) {
        return (
            <Spinner className={props.className} animation="border" role="status" size="sm">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    }

    return null;
};
