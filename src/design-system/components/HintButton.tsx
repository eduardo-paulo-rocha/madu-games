import { Button } from './Button';

interface HintButtonProps {
    onClick: () => void;
    disabled: boolean;
}

export function HintButton({ onClick, disabled }: HintButtonProps) {
    return (
        <Button
            variant="secondary"
            size="md"
            onClick={onClick}
            disabled={disabled}
            style={{
                opacity: disabled ? 0.5 : 1,
                pointerEvents: disabled ? 'none' : 'auto',
                gap: '6px',
            }}
        >
            💡 Dica
        </Button>
    );
}
