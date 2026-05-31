import { gameRegistry } from '../core/registry/game-registry';
import { plugin as wordSearch } from './word-search';
import { plugin as crossword } from './crossword';
import { plugin as emojiGuess } from './emoji-guess';
import { plugin as rhymeGame } from './rhyme-game';
import { plugin as logicalSequence } from './logical-sequence';
import { plugin as connectPairs } from './connect-pairs';

gameRegistry.register(wordSearch);
gameRegistry.register(crossword);
gameRegistry.register(emojiGuess);
gameRegistry.register(rhymeGame);
gameRegistry.register(logicalSequence);
gameRegistry.register(connectPairs);
