import { normalizeText } from '../../../core/text/normalize';

export function validateAnswer(input: string, acceptedWords: string[]): boolean {
    const normalized = normalizeText(input).replace(/[^a-z ]/g, '');
    if (!normalized) return false;

    return acceptedWords.some((word) => normalizeText(word) === normalized);
}
