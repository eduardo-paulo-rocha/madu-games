import type { GamePlugin } from './types';

class GameRegistry {
    private games: Map<string, GamePlugin> = new Map();

    register(plugin: GamePlugin): void {
        if (this.games.has(plugin.id)) {
            throw new Error(`Game "${plugin.id}" is already registered.`);
        }
        this.games.set(plugin.id, plugin);
    }

    getAll(): GamePlugin[] {
        return Array.from(this.games.values());
    }

    getById(id: string): GamePlugin | undefined {
        return this.games.get(id);
    }
}

export const gameRegistry = new GameRegistry();
