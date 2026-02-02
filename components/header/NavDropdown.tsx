"use client";

import { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownItem {
  href: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
}

interface NavDropdownProps {
  label: string;
  icon?: LucideIcon;
  items: DropdownItem[];
  activeRoutes?: string[];
  variant?: "simple" | "detailed";
}

export const NavDropdown = memo(function NavDropdown({
  label,
  icon: Icon,
  items,
  activeRoutes = [],
  variant = "simple",
}: NavDropdownProps) {
  const pathname = usePathname();

  const isAnyActive = activeRoutes.some((route) => pathname.startsWith(route));
  const isItemActive = (href: string) => pathname.startsWith(href);

  return (
    <div className="relative group">
      <button
        className={cn(
          "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 relative",
          "hover:text-primary",
          "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full",
          isAnyActive && "text-primary font-semibold after:w-full"
        )}
      >
        {Icon && <Icon className="w-4 h-4 inline-block mr-2" />}
        {label}
        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
      </button>

      {/* Dropdown Content */}
      <div
        className={cn(
          "absolute top-full left-1/2 -translate-x-1/2 pt-4 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50",
          variant === "simple" ? "w-64" : "w-72"
        )}
      >
        <div
          className={cn(
            "bg-white rounded-xl shadow-xl border border-gray-100",
            variant === "simple" ? "p-4" : "p-2"
          )}
        >
          <div className={variant === "simple" ? "space-y-2" : "space-y-1"}>
            {items.map((item) => {
              const ItemIcon = item.icon;

              if (variant === "detailed") {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors",
                      isItemActive(item.href) && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    {ItemIcon && <ItemIcon className="w-4 h-4 flex-shrink-0" />}
                    <div>
                      <div className="font-semibold">{item.label}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500">{item.description}</div>
                      )}
                    </div>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 rounded-lg"
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});
