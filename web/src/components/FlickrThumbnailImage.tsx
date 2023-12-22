import { ResultItem } from '../types/BirdnetPi';

/**
 * Returns an image that is linked to a Flickr Image
 */
export const FlickrThumbnailImage = (props: {
    recentItem: ResultItem;
    className?: string;
    height?: number;
    width?: number;
}): JSX.Element => {
    const { recentItem } = props;

    return (
        <a href={recentItem.image.flickrPage} target="_blank" rel="noopener noreferer" className={props.className}>
            <img
                className="rounded-circle border border-2 border-primary"
                src={recentItem.image.thumbnail}
                width={props.height ?? 75}
                height={props.height ?? 75}
                alt={recentItem.comName}
                title={`${recentItem.comName}\n${recentItem.sciName}\nflickr user: ${recentItem.image.username}\n${recentItem.image.license.name}`}
            />
        </a>
    );
};
