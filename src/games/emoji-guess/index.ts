import { lazy } from 'react';
import type { GamePlugin } from '../../core/registry/types';
import { EmojiGuessIcon } from './components/EmojiGuessIcon';

export const plugin: GamePlugin = {
    id: 'emoji-guess',
    name: 'Adivinhe o Emoji',
    description: 'Descubra o que o emoji representa!',
    icon: EmojiGuessIcon,
    component: lazy(() => import('./EmojiGuessGame')),
    defaultRoundSize: 8,
    difficulties: ['easy', 'medium', 'hard'],
    pointsPerItem: 10,
};
