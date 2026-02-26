import React from 'react';

interface NavItem {
    label?: string;
    href: string;
    onClick?: (e: React.MouseEvent) => void;
    ariaLabel?: string;
}

interface PillNavProps {
    logo?: string;
    logoAlt?: string;
    items: NavItem[];
    className?: string;
    ease?: string;
    baseColor?: string;
    pillColor?: string;
    hoveredPillTextColor?: string;
    pillTextColor?: string;
    onMobileMenuClick?: () => void;
    initialLoadAnimation?: boolean;
}

declare const PillNav: React.FC<PillNavProps>;

export default PillNav;
