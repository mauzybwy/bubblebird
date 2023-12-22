import { Form } from 'react-bootstrap';
import { DEFAULT_MAX_INITIAL_ITEMS_TO_RETRIEVE } from '../Constants';
import { useState } from 'react';
import useDebounce from '../hooks/useDebounce';
import { HomepageStats } from '../components/HomepageStats';
import { DetectedItemsList } from '../components/DetectedItemsList';
import { useStatsQuery } from '../hooks/useStatsQuery';

const RecentsList = (): JSX.Element => {
    const [maxResults, setMaxResults] = useState(DEFAULT_MAX_INITIAL_ITEMS_TO_RETRIEVE);
    const queryData = useDebounce({ limit: maxResults }, 500);

    const { data } = useStatsQuery(queryData);

    const onLimitChange = (evt: React.FormEvent<HTMLInputElement>): void => {
        const val = parseInt(evt.currentTarget.value, 10);
        setMaxResults(val);
    };

    return (
        <>
            <div className="text-center">
                <div className="d-flex align-items-center justify-content-center">
                    <h5>Latest Detections</h5>
                </div>

                <div className="d-flex justify-content-center align-items-center">
                    <div className="me-2">
                        <Form.Label htmlFor="maxResults-slider">
                            Showing Latest <span className="fst-italic">{maxResults}</span>{' '}
                            detections.
                        </Form.Label>
                    </div>
                    <div>
                        <Form.Range
                            min={1}
                            max={50}
                            step={1}
                            value={maxResults}
                            onChange={onLimitChange}
                            id="maxResults-slider"
                        />
                    </div>
                </div>
                <DetectedItemsList results={data?.results} />
            </div>
        </>
    );
};

export const Overview = (): JSX.Element => {
    return (
        <>
            <HomepageStats />
            <hr />
            <RecentsList />
        </>
    );
};
