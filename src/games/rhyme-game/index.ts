import { lazy } from 'react';
import type { GamePlugin } from '../../core/registry/types';
import { RhymeGameIcon } from './components/RhymeGameIcon';

export const plugin: GamePlugin = {
    id: 'rhyme-game',
    name: 'Rima com o Quê?',
    description: 'Descubra qual palavra rima!',
    icon: RhymeGameIcon,
    component: lazy(() => import('./RhymeGame')),
    defaultRoundSize: 10,
    difficulties: ['easy', 'medium', 'hard'],
    pointsPerItem: 10,
};
