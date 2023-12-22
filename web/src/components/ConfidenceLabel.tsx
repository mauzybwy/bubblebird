import { Badge } from 'react-bootstrap';
import { formatNumber } from '../helpers/helpers';

const getConfidenceColor = (confidence: number): string => {
    if (confidence < 0.75) {
        return 'danger';
    } else if (confidence < 0.80) {
        return 'warning';
    } else {
        return 'success';
    }
};

/**
 * Returns a badge with the confidence %. Color of the badge changes depending on the level of confidence.
 */
export const ConfidenceBadge = (props: { confidence: number; className?: string }): JSX.Element => {
    const confidence = formatNumber(props.confidence * 100, 0);
    const bg = getConfidenceColor(props.confidence);

    return (
        <Badge className={props.className} pill bg={bg} title={`Confidence: ${confidence}%`}>
            {confidence}%
        </Badge>
    );
};
