import { spacing } from '../../../design-system/tokens';
import type { PairItem as PairItemType } from '../logic/types';
import { PairItem } from './PairItem';

interface PairColumnProps {
    items: PairItemType[];
    selectedId: string | null;
    matchedIds: Set<string>;
    onSelectItem: (id: string) => void;
}

export function PairColumn({ items, selectedId, matchedIds, onSelectItem }: PairColumnProps) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.md,
                flex: 1,
                minWidth: 0,
            }}
        >
            {items.map((item) => (
                <PairItem
                    key={item.id}
                    item={item}
                    isSelected={selectedId === item.id}
                    isMatched={matchedIds.has(item.id)}
                    onClick={onSelectItem}
                />
            ))}
        </div>
    );
}
