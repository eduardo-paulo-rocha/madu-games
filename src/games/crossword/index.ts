import { lazy } from 'react';
import type { GamePlugin } from '../../core/registry/types';
import { CrosswordIcon } from './components/CrosswordIcon';

export const plugin: GamePlugin = {
    id: 'crossword',
    name: 'Cruzadinha',
    description: 'Descubra as palavras usando as dicas!',
    icon: CrosswordIcon,
    component: lazy(() => import('./CrosswordGame')),
    defaultRoundSize: 5,
    difficulties: ['easy', 'medium', 'hard'],
    pointsPerItem: 10,
};
