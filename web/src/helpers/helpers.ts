/**
 * Returns a formatted number to the specified number of places using `Intl.NumberFormat`.
 */
export const formatNumber = (value: number, maximumFractionDigits: number): string => {
    const formatter = Intl.NumberFormat(undefined, { maximumFractionDigits });
    return formatter.format(value);
};

export const isLocalHost = (): boolean => {
    return location.hostname === 'localhost' || location.hostname === '127.0.0.1';
};
