import { lazy } from 'react';
import type { GamePlugin } from '../../core/registry/types';
import { LogicalSequenceIcon } from './components/LogicalSequenceIcon';

export const plugin: GamePlugin = {
    id: 'logical-sequence',
    name: 'Sequência Lógica',
    description: 'Descubra o padrão e complete a sequência!',
    icon: LogicalSequenceIcon,
    component: lazy(() => import('./LogicalSequenceGame')),
    defaultRoundSize: 10,
    difficulties: ['easy', 'medium', 'hard'],
    pointsPerItem: 10,
};
