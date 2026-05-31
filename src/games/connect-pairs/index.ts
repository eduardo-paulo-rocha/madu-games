import { lazy } from 'react';
import type { GamePlugin } from '../../core/registry/types';
import { ConnectPairsIcon } from './components/ConnectPairsIcon';

export const plugin: GamePlugin = {
    id: 'connect-pairs',
    name: 'Conecte os Pares',
    description: 'Conecte elementos que se relacionam!',
    icon: ConnectPairsIcon,
    component: lazy(() => import('./ConnectPairsGame')),
    defaultRoundSize: 5,
    difficulties: ['easy', 'medium', 'hard'],
    pointsPerItem: 15,
};
