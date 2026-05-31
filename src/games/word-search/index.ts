import { lazy } from 'react';
import type { GamePlugin } from '../../core/registry/types';
import { WordSearchIcon } from './components/WordSearchIcon';

export const plugin: GamePlugin = {
    id: 'word-search',
    name: 'Caça-Palavras',
    description: 'Encontre as palavras escondidas na grade de letras!',
    icon: WordSearchIcon,
    component: lazy(() => import('./WordSearchGame')),
    defaultRoundSize: 6,
    difficulties: ['easy', 'medium', 'hard'],
    pointsPerItem: 10,
};
