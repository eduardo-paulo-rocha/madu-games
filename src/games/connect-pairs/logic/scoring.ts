export function isFirstTry(failedItems: Set<string>, leftId: string, rightId: string): boolean {
    return !failedItems.has(leftId) && !failedItems.has(rightId);
}

export function addFailedItems(failedItems: Set<string>, leftId: string, rightId: string): Set<string> {
    const updated = new Set(failedItems);
    updated.add(leftId);
    updated.add(rightId);
    return updated;
}
