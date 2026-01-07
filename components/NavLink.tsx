import React from 'react';

interface NavLinkProps {
    icon: React.ElementType;
    label: string;
    active: boolean;
    onClick: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({
    icon: Icon,
    label,
    active,
    onClick
}) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group font-semibold text-sm ${active
                ? 'bg-slate-900 text-white shadow-lg'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
    >
        <Icon size={18} className={active ? 'text-white' : 'group-hover:text-slate-900 text-slate-400'} />
        <span className="tracking-tight">{label}</span>
    </button>
);

export default NavLink;
