import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col } from 'react-bootstrap';
import { Fullscreen, InfoCircleFill, Wikipedia } from 'react-bootstrap-icons';
import { BIRDS_HOST } from '../Constants';
import { useResultItemModal } from '../hooks/useResultItemModal';
import { ResultItem } from '../types/BirdnetPi';
import { ConfidenceBadge } from './ConfidenceLabel';
import { FlickrThumbnailImage } from './FlickrThumbnailImage';
import InfiniteScroll from 'react-infinite-scroller';

const DetectedItemHeader = (props: { recentItem: ResultItem }): JSX.Element => {
    const { recentItem } = props;
    return (
        <div className="d-flex flex-column flex-md-row align-items-center">
            <FlickrThumbnailImage recentItem={recentItem} />
            <div className="d-flex flex-column align-items-md-start ms-md-2">
                <p className="fs-5 mb-0">{recentItem.comName}</p>
                <p className="fs-6 fw-light fst-italic mb-0">{recentItem.sciName}</p>
                <p className="fw-light text-secondary mb-0" style={{ fontSize: '0.8rem' }}>
                    {recentItem.time} • {recentItem.date}
                </p>
            </div>
        </div>
    );
};

/**
 * Returns a card with info about a detected item.
 */
export const DetectedItemCard = (props: {
    recentItem: ResultItem;
    showSpectrogram?: boolean;
    onMaximizeClick?: (recentItem: ResultItem) => void;
}): JSX.Element => {
    const { recentItem, onMaximizeClick, showSpectrogram } = props;

    return (
        <Card className="shadow-sm">
            <Card.Body>
                <Card.Title>
                    <DetectedItemHeader recentItem={recentItem} />
                </Card.Title>

                <div className={showSpectrogram ? 'd-block' : 'd-none d-sm-block'}>
                    <img
                        className="w-100"
                        alt={`Spectrogram for ${recentItem.comName} at ${recentItem.date} ${recentItem.time}`}
                        title={`Spectrogram for ${recentItem.comName} at ${recentItem.date} ${recentItem.time}`}
                        src={`${BIRDS_HOST}${recentItem.filename}.png`}
                    />
                </div>

                <audio
                    className="w-100 mt-2"
                    controls
                    preload="none"
                    src={`${BIRDS_HOST}${recentItem.filename}`}
                />

                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <ConfidenceBadge confidence={recentItem.confidence} />
                    </div>

                    <div className="d-flex justify-content-end">
                        <ButtonGroup size="sm">
                            <Button
                                variant="link"
                                href={`https://wikipedia.org/wiki/${recentItem.sciName}`}
                                rel="noopener noreferer"
                                target="_blank"
                                title="See More at Wikipedia"
                                aria-label="See More at Wikipedia"
                            >
                                <Wikipedia />
                            </Button>

                            {onMaximizeClick ? (
                                <Button
                                    variant="link"
                                    onClick={(): void => onMaximizeClick(recentItem)}
                                    title="Maximize"
                                    aria-label="Maximize"
                                >
                                    <Fullscreen />
                                </Button>
                            ) : null}
                        </ButtonGroup>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

/**
 * Returns a list of detected items as a grid of cards.
 */
export const DetectedItemsList = (props: {
    results?: ResultItem[];
    refetchOnWindowFocus?: boolean;
}): JSX.Element => {
    const maxResultsToShow = 6;

    const { results } = props;
    const [resultsToShow, setResultsToShow] = useState<ResultItem[]>();
    const [maximizeDetailItem, setMaximizeDetailsItem] = useState<ResultItem>();
    const [hasMore, setHasMore] = useState(true);

    const onMaximizeClick = (recentItem: ResultItem): void => {
        setMaximizeDetailsItem(recentItem);
    };

    const ResultItemModal = useResultItemModal({
        item: maximizeDetailItem,
        onMaximizeClose: () => setMaximizeDetailsItem(undefined),
    });

    useEffect(() => {
        if (results) {
            if (results.length <= maxResultsToShow) {
                setResultsToShow(results);
                setHasMore(false);
            } else {
                setResultsToShow(results.slice(0, maxResultsToShow));
                setHasMore(true);
            }
        }
    }, [results]);

    const loadMore = (page: number): void => {
        const end = page * maxResultsToShow;
        const start = end - maxResultsToShow;

        if (results) {
            if (end > results.length) {
                setResultsToShow(results);
                setHasMore(false);
            } else {
                if (resultsToShow) {
                    const additional = [...resultsToShow, ...results.slice(start, end)];
                    setResultsToShow(additional);
                }
                setResultsToShow(results.slice(0, end));
            }
        }
    };

    return (
        <>
            <InfiniteScroll
                pageStart={0}
                loadMore={loadMore}
                hasMore={hasMore}
                className="row row-cols row-cols-sm-2 row-cols-xl-3 g-3 w-100"
                loader={
                    <div className="loader" key={0}>
                        Loading ...
                    </div>
                }
                children={resultsToShow?.map((r, idx) => {
                    return (
                        <Col xs={12} sm={6} xl={4} key={`${idx}_${r.comName}_${r.time}_${r.date}`}>
                            <DetectedItemCard recentItem={r} onMaximizeClick={onMaximizeClick} />
                        </Col>
                    );
                })}
            />

            {ResultItemModal}
        </>
    );
};
