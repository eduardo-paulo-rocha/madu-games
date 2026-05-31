import { gameRegistry } from '../core/registry/game-registry';
import { plugin as wordSearch } from './word-search';
import { plugin as crossword } from './crossword';
import { plugin as emojiGuess } from './emoji-guess';
import { plugin as connectPairs } from './connect-pairs';

gameRegistry.register(wordSearch);
gameRegistry.register(crossword);
gameRegistry.register(emojiGuess);
gameRegistry.register(connectPairs);
