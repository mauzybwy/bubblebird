import { Button, Modal } from 'react-bootstrap';
import { DetectedItemCard } from '../components/DetectedItemsList';
import { ResultItem } from '../types/BirdnetPi';

/**
 * Shows a modal of a detected item
 */
export const useResultItemModal = (props: {
    item?: ResultItem;
    onMaximizeClose?: () => void;
}): JSX.Element => {
    const { item, onMaximizeClose } = props;

    return (
        <Modal show={item !== undefined} onHide={onMaximizeClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{item ? item.comName : null}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{item ? <DetectedItemCard recentItem={item} showSpectrogram /> : null}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onMaximizeClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
