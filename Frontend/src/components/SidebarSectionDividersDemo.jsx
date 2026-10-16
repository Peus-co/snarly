import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    BarChartSquare02,
    Folder,
    HomeLine,
    LayoutAlt01,
    MessageChatCircle,
    PieChart03,
    Rows01,
    Settings01,
    ChevronDown,
} from "@untitledui/icons";

const navItemsWithDividers = [
    { label: "Home", href: "/", icon: HomeLine },
    { label: "Dashboard", href: "/dashboard", icon: BarChartSquare02 },
    { label: "Projects", href: "/projects", icon: Rows01 },
    { divider: true },
    {
        label: "Folders",
        icon: Folder,
        href: "/folders",
        items: [
            { label: "View all", badge: 18, href: "/folders/view-all" },
            { label: "Recent", badge: 8, href: "/folders/recent" },
            { label: "Favorites", badge: 6, href: "/folders/favorites" },
            { label: "Shared", badge: 4, href: "/folders/shared" },
        ],
    },
    { divider: true },
    { label: "Reporting", href: "/reporting", icon: PieChart03 },
    { label: "Settings", href: "/settings", icon: Settings01 },
    { label: "Support", href: "/support", icon: MessageChatCircle, badge: "online" },
    { label: "Open in browser", href: "https://www.untitledui.com/", icon: LayoutAlt01 },
];

export const SidebarSectionDividersDemo = ({ activeUrl }) => {
    const location = useLocation();
    const currentUrl = activeUrl || location.pathname;
    const [openFolders, setOpenFolders] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    const activeItem = navItemsWithDividers.find(
        (item) =>
            !item.divider &&
            (item.href === currentUrl || item.items?.some((sub) => sub.href === currentUrl)),
    );

    const renderBadge = (badge) => {
        if (!isHovered) return null;
        if (badge === "online") {
            return (
                <span className="ml-3 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    Online
                </span>
            );
        }
        if (badge !== undefined) {
            return (
                <span className="ml-3 inline-flex shrink-0 items-center rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-400">
                    {badge}
                </span>
            );
        }
        return null;
    };

    return (
        <aside 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`flex h-full shrink-0 select-none flex-col bg-transparent backdrop-blur-sm border-r border-zinc-800/40 transition-all duration-300 ${isHovered ? "w-64" : "w-16"}`}
        >
            <div className="flex items-center gap-2 px-4 pb-4 pt-5 overflow-hidden">
                <Link to="/" className="flex items-center gap-2 rounded-md p-1 transition-transform hover:scale-105" title="Snarly Home">
                    <img src="/logo.png" alt="Snarly Logo" className="h-8 w-8 object-contain brightness-0 invert flex-shrink-0" />
                    {isHovered && <span className="font-bold text-lg whitespace-nowrap">Snarly AI</span>}
                </Link>
            </div>

            <ul className={`flex flex-1 flex-col overflow-y-auto px-2 pt-2 ${isHovered ? "" : "items-center"}`}>
                {navItemsWithDividers.map((item, index) => {
                    if (item.divider) {
                        return (
                            <li key={"divider-" + index} className="w-full px-2 py-2">
                                <hr className="h-px w-full border-none bg-zinc-800" />
                            </li>
                        );
                    }

                    const isActive = item.href === currentUrl;
                    const isExternal = item.href && item.href.startsWith("http");

                    if (item.items && item.items.length) {
                        const isOpen = openFolders || (activeItem && activeItem.label === item.label);
                        return (
                            <li key={item.label} className="py-px w-full">
                                <button
                                    type="button"
                                    onClick={() => setOpenFolders((o) => !o)}
                                    className={"group flex w-full items-center gap-3 rounded-md p-2 text-left transition duration-100 " + (activeItem && activeItem.label === item.label ? "bg-zinc-800 text-zinc-100" : "bg-transparent hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100")}
                                >
                                    {item.icon && (
                                        <item.icon aria-hidden="true" className="size-5 shrink-0" />
                                    )}
                                    {isHovered && (
                                        <>
                                            <span className="flex-1 truncate text-sm font-semibold">{item.label}</span>
                                            <ChevronDown aria-hidden="true" className={"size-4 shrink-0 transition-transform " + (isOpen ? "" : "-scale-y-100")} />
                                        </>
                                    )}
                                </button>
                                {isHovered && isOpen && (
                                    <ul className="pb-1 pl-8">
                                        {item.items.map((child) => (
                                            <li key={child.label} className="py-0.5">
                                                <Link to={child.href} className="flex w-full items-center rounded-md py-1.5 px-2 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900">
                                                    {child.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    }

                    return (
                        <li key={item.label} className="py-px w-full">
                            <Link
                                to={item.href}
                                className={"group flex w-full items-center gap-3 rounded-md p-2 transition duration-100 " + (isActive ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900")}
                            >
                                {item.icon && <item.icon aria-hidden="true" className="size-5 shrink-0" />}
                                {isHovered && <span className="flex-1 truncate text-sm font-semibold">{item.label}</span>}
                                {isHovered && renderBadge(item.badge)}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
};

export default SidebarSectionDividersDemo;
