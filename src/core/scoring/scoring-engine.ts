export function calculateScore(correctItems: number, pointsPerItem: number): number {
    return correctItems * pointsPerItem;
}

export function calculateStars(correctItems: number, totalItems: number): number {
    if (totalItems === 0) return 0;
    const ratio = correctItems / totalItems;
    if (ratio >= 1) return 3;
    if (ratio >= 0.75) return 2;
    if (ratio >= 0.5) return 1;
    return 0;
}
