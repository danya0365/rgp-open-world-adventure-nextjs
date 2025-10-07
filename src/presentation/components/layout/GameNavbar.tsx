"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  UsersRound,
  Map,
  Scroll,
  Swords,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

const navItems: NavItem[] = [
  {
    name: "Home",
    href: "/",
    icon: <Home className="w-5 h-5" />,
    description: "หน้าหลัก",
  },
  {
    name: "Characters",
    href: "/characters",
    icon: <Users className="w-5 h-5" />,
    description: "ตัวละคร",
  },
  {
    name: "Party",
    href: "/party",
    icon: <UsersRound className="w-5 h-5" />,
    description: "จัดการทีม",
  },
  {
    name: "World",
    href: "/world",
    icon: <Map className="w-5 h-5" />,
    description: "แผนที่โลก",
  },
  {
    name: "Quests",
    href: "/quests",
    icon: <Scroll className="w-5 h-5" />,
    description: "เควส",
  },
  // {
  //   name: "Battle",
  //   href: "/battle",
  //   icon: <Swords className="w-5 h-5" />,
  //   description: "การต่อสู้",
  // },
  // {
  //   name: "Inventory",
  //   href: "/inventory",
  //   icon: <Package className="w-5 h-5" />,
  //   description: "กระเป๋า",
  // },
];

export function GameNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Swords className="w-6 h-6 text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-white">RPG Adventure</h1>
              <p className="text-xs text-gray-400">Open World Fantasy</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50"
                    : "text-gray-400 hover:text-white hover:bg-slate-800"
                }`}
                title={item.description}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Settings Button (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/components-demo"
              className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Components Demo"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {item.icon}
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs opacity-75">{item.description}</p>
                  </div>
                </Link>
              ))}
              <div className="border-t border-slate-800 my-2"></div>
              <Link
                href="/components-demo"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <Settings className="w-5 h-5" />
                <div className="flex-1">
                  <p className="font-medium">Components Demo</p>
                  <p className="text-xs opacity-75">ตัวอย่าง Components</p>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
