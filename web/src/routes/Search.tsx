import { useCallback, useEffect, useState } from 'react';
import {
    Accordion,
    Badge,
    Button,
    ButtonGroup,
    Col,
    Form,
    ListGroup,
    Row,
    ToggleButton,
} from 'react-bootstrap';
import { OverviewStatItem } from '../components/HomepageStats';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
import { BirdsQuery, RecentsResponse, ResultItem, SpeciesListItem } from '../types/BirdnetPi';
import type { Option } from 'react-bootstrap-typeahead/types/types';
import { useAppSelector } from '../store/Store';
import { format } from 'date-fns';
import { useStatsQuery } from '../hooks/useStatsQuery';
import { DetectedItemsList } from '../components/DetectedItemsList';
import { FlickrThumbnailImage } from '../components/FlickrThumbnailImage';
import { formatNumber } from '../helpers/helpers';
import {
    SortAlphaDown,
    SortAlphaUp,
    SortNumericDownAlt,
    SortNumericUp,
} from 'react-bootstrap-icons';
import { LoadingSpinner } from '../components/Spinner';

type ConsolidatedResults = { [comName: string]: ResultItem[] };
type ConsolidatedSortOptions = 'Name' | 'Count';

const StatsFilterControls = (props: {
    isFetching: boolean;
    onSubmit: (queryData: BirdsQuery) => void;
}): JSX.Element => {
    const now = format(new Date(), 'yyyy-MM-dd');

    const [startDate, setStartDate] = useState<string | undefined>(now);
    const [endDate, setEndDate] = useState<string | undefined>(now);
    const [selectedSpecies, setSelectedSpecies] = useState<Option[] | undefined>();
    const overviewStats = useAppSelector((state) => state.overviewStats.value);

    const onStartChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
        setStartDate(evt.currentTarget.value);
    };

    const onEndChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
        setEndDate(evt.currentTarget.value);
    };

    const onSpeciesChange = (selected: Option[]): void => {
        setSelectedSpecies(selected);
    };

    const onSubmit = (evt: React.FormEvent<HTMLFormElement>): void => {
        evt.preventDefault();

        const sciNames = (selectedSpecies as ResultItem[])?.map((s) => {
            return s.sciName;
        });

        const queryData = {
            startDate,
            endDate,
            sciNames,
        };
        props.onSubmit(queryData);
    };

    // Since the speciesAllTime array is a nested property,
    // we have to extract it to a standalone array in order to sort it.
    const options = overviewStats?.stats.speciesAllTime
        ? [...overviewStats.stats.speciesAllTime]
        : undefined;

    const sortSpecies = (a: SpeciesListItem, b: SpeciesListItem): number => {
        if (a.comName > b.comName) {
            return 1;
        }

        if (a.comName < b.comName) {
            return -1;
        }

        return 0;
    };

    return (
        <Form onSubmit={onSubmit} aria-disabled={props.isFetching}>
            <fieldset disabled={props.isFetching}>
                <Row>
                    <Col sm={4} md={3}>
                        <Form.Label className="small">Start Date</Form.Label>
                        <Form.Control type="date" value={startDate} onChange={onStartChange} />
                    </Col>
                    <Col sm={4} md={3}>
                        <Form.Label className="small">End Date</Form.Label>
                        <Form.Control type="date" value={endDate} onChange={onEndChange} />
                    </Col>
                    <Col>
                        <Form.Label className="small">Species</Form.Label>
                        {options ? (
                            <Typeahead
                                id="spcies-options"
                                multiple
                                options={options.sort(sortSpecies)}
                                onChange={onSpeciesChange}
                                placeholder="Choose Species"
                                labelKey="comName"
                                renderMenuItemChildren={(option, props, index): JSX.Element => {
                                    const item = option as ResultItem;
                                    return (
                                        <div>
                                            {item.comName} ({item.sciName})
                                        </div>
                                    );
                                }}
                            />
                        ) : null}
                    </Col>
                </Row>
                <div className="d-flex justify-content-end align-items-center mt-2">
                    <LoadingSpinner show={props.isFetching} className='me-2'/>
                    <Button type="submit">Search</Button>
                </div>
            </fieldset>
        </Form>
    );
};

/**
 * Consolidates the search results response into an object with key of common name
 * and values of an array of ResultItem[]
 */
const conslidateSearchResults = (results: ResultItem[]): ConsolidatedResults => {
    const consolidatedResults: ConsolidatedResults = {};

    results.forEach((item) => {
        const comName = item.comName;

        if (!(comName in consolidatedResults)) {
            consolidatedResults[comName] = [];
        }

        consolidatedResults[comName].push(item);
    });

    return consolidatedResults;
};

const ResultAccordion = (props: { comName: string; results: ResultItem[] }): JSX.Element => {
    const { comName } = props;
    const [results, setResults] = useState<ResultItem[]>();

    const onEnter = (node: HTMLElement, isAppearing: boolean): void => {
        setResults(props.results);
    };

    return (
        <Accordion className="mb-2">
            <Accordion.Item eventKey={comName}>
                <Accordion.Header>
                    <div className="d-flex justify-content-between w-100 align-items-center me-2">
                        <div className="d-flex align-items-center">
                            <FlickrThumbnailImage
                                recentItem={props.results[0]}
                                className="me-2"
                                height={38}
                                width={38}
                            />
                            <h6 className="mb-0">{comName}</h6>
                        </div>
                        <div>
                            <Badge pill>{formatNumber(props.results.length, 0)}</Badge>
                        </div>
                    </div>
                </Accordion.Header>
                <Accordion.Body onEnter={onEnter}>
                    <ListGroup className="align-items-center">
                        <DetectedItemsList results={results} />
                    </ListGroup>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
};

const SearchResultsStatsSummary = (props: {
    total: number;
    distinctSpecies: number;
}): JSX.Element => {
    return (
        <ListGroup horizontal>
            <OverviewStatItem name="Total" value={props.total}></OverviewStatItem>
            <OverviewStatItem name="Species" value={props.distinctSpecies}></OverviewStatItem>
        </ListGroup>
    );
};

const SearchResultsSortControl = (props: {
    onSortChange: (field: ConsolidatedSortOptions, asc: boolean) => void;
}): JSX.Element => {
    const [asc, setAsc] = useState(true);
    const [sortField, setSortField] = useState<ConsolidatedSortOptions>('Name');

    const sortOptions = [
        {
            value: 'Name',
        },
        {
            value: 'Count',
        },
    ];

    const { onSortChange } = props;

    const onSortFieldChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
        if (evt.currentTarget?.value) {
            if (evt.currentTarget.value === 'Name' || evt.currentTarget.value === 'Count') {
                setSortField(evt.currentTarget.value);
            }
        }
    };

    useEffect(() => {
        setAsc(sortField === 'Name');
    }, [sortField]);

    const toggleAsc = (): void => {
        setAsc((prevValue) => !prevValue);
    };

    useEffect(() => {
        onSortChange(sortField, asc);
    }, [onSortChange, asc, sortField]);

    const sortUpIcon = sortField === 'Name' ? <SortAlphaDown /> : <SortNumericUp />;
    const sortDownIcon = sortField === 'Name' ? <SortAlphaUp /> : <SortNumericDownAlt />;

    return (
        <ButtonGroup size="sm">
            {sortOptions.map((radio, idx) => (
                <ToggleButton
                    key={`radio-${idx}`}
                    id={`radio-${idx}`}
                    type="radio"
                    variant={sortField === radio.value ? 'outline-primary' : 'outline-success'}
                    name="radio"
                    value={radio.value}
                    checked={sortField === radio.value}
                    onChange={onSortFieldChange}
                >
                    {radio.value}
                </ToggleButton>
            ))}
            <Button onClick={toggleAsc}>{asc ? sortUpIcon : sortDownIcon}</Button>
        </ButtonGroup>
    );
};

const SearchResults = (props: { data?: RecentsResponse | null }): JSX.Element | null => {
    const { data } = props;
    const [results, setResults] = useState<ConsolidatedResults>();

    useEffect(() => {
        if (data?.results) {
            setResults(conslidateSearchResults(data.results));
        }
    }, [data]);

    const sortByName = (responseItems: ResultItem[], asc: boolean): void => {
        const consolidatedResults = conslidateSearchResults(responseItems);
        const keys = Object.keys(consolidatedResults).sort();

        if (!asc) {
            keys.reverse();
        }

        const sorted: ConsolidatedResults = {};

        keys.forEach((comName) => {
            sorted[comName] = consolidatedResults[comName];
        });

        setResults(sorted);
    };

    const sortByCount = (responseItems: ResultItem[], asc: boolean): void => {
        const consolidatedResults = conslidateSearchResults(responseItems);

        const sortable = new Array<[string, number]>();

        Object.keys(consolidatedResults).forEach((comName) => {
            sortable.push([comName, consolidatedResults[comName].length]);
        });

        sortable.sort((a: [string, number], b: [string, number]) => {
            if (a[1] > b[1]) {
                return 1;
            }

            if (a[1] < b[1]) {
                return -1;
            }

            // Sort by name if there's species with the same count
            if (a[0] > b[0]) {
                return 1;
            }

            if (a[0] < b[0]) {
                return -1;
            }

            return 0;
        });

        if (!asc) {
            sortable.reverse();
        }

        const sorted: ConsolidatedResults = {};

        sortable.forEach((s) => {
            const comName = s[0];
            sorted[comName] = consolidatedResults[comName];
        });

        setResults(sorted);
    };

    const onSortChange = useCallback(
        (sortBy: ConsolidatedSortOptions, asc: boolean): void => {
            if (data?.results && data.results.length > 0) {
                if (data?.results) {
                    switch (sortBy) {
                        case 'Name':
                            sortByName(data.results, asc);
                            break;

                        case 'Count':
                            sortByCount(data.results, asc);
                            break;
                    }
                }
            }
        },
        [data?.results],
    );

    if (results) {
        const numResults = data?.results.length ?? 0;

        return (
            <>
                <div className="mb-2 d-flex justify-content-center">
                    <SearchResultsStatsSummary
                        total={numResults}
                        distinctSpecies={Object.keys(results).length}
                    />
                </div>

                <div className="my-2 d-flex justify-content-end">
                    <SearchResultsSortControl onSortChange={onSortChange} />
                </div>

                {Object.keys(results).map((comName, idx) => {
                    return (
                        <ResultAccordion
                            key={`${idx}_${comName}`}
                            comName={comName}
                            results={results[comName]}
                        />
                    );
                })}
            </>
        );
    }

    return null;
};

export const Search = (): JSX.Element => {
    const [queryData, setQueryData] = useState<BirdsQuery>();
    const { isFetching, data } = useStatsQuery(queryData);

    const onSubmit = (data: BirdsQuery): void => {
        setQueryData(data);
    };

    return (
        <>
            <StatsFilterControls isFetching={isFetching} onSubmit={onSubmit} />

            <SearchResults data={data} />
        </>
    );
};
