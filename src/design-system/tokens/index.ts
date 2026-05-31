export const colors = {
    primary: '#6C63FF',
    primaryLight: '#8B83FF',
    primaryDark: '#4A42E0',
    secondary: '#FF6B9D',
    secondaryLight: '#FF8DB5',
    accent: '#FFD93D',
    success: '#4CAF50',
    error: '#FF5252',
    background: '#F8F7FF',
    surface: '#FFFFFF',
    textPrimary: '#2D2B55',
    textSecondary: '#6B6B8D',
    textOnPrimary: '#FFFFFF',
    border: '#E8E6F0',
    starFilled: '#FFD93D',
    starEmpty: '#D4D2E0',
} as const;

export const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
} as const;

export const typography = {
    fontFamily: "'Nunito', system-ui, -apple-system, sans-serif",
    fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.25rem',
        xl: '1.5rem',
        xxl: '2rem',
        xxxl: '2.5rem',
    },
    fontWeight: {
        normal: 400,
        medium: 600,
        bold: 700,
        extraBold: 800,
    },
} as const;

export const breakpoints = {
    mobile: '320px',
    mobileMd: '375px',
    mobileLg: '414px',
    tablet: '768px',
    desktop: '1024px',
} as const;

export const radii = {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
} as const;

export const shadows = {
    sm: '0 2px 4px rgba(45, 43, 85, 0.08)',
    md: '0 4px 12px rgba(45, 43, 85, 0.12)',
    lg: '0 8px 24px rgba(45, 43, 85, 0.16)',
} as const;
