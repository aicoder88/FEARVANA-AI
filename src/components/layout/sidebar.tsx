"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LIFE_LEVEL_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Calendar,
  MessageSquare,
  Settings,
  Target,
  TrendingUp,
  Menu,
  X,
  Home,
  User,
  Bell,
  HelpCircle,
  Brain,
} from "lucide-react";
import Image from "next/image";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const mainNavItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: Home,
      description: "Your daily Sacred Edge overview",
    },
    {
      title: "AI Akshay",
      href: "/chat",
      icon: MessageSquare,
      description: "Chat with AI Akshay Coach",
    },
    {
      title: "Sacred Edge",
      href: "/sacred-edge",
      icon: Target,
      description: "Find your edge & conquer fears",
    },
    {
      title: "Daily Tasks",
      href: "/tasks",
      icon: Calendar,
      description: "AI-generated action plan",
    },
    {
      title: "Life Levels",
      href: "/levels",
      icon: BarChart3,
      description: "Track your 8 life areas",
    },
    {
      title: "Insights",
      href: "/insights",
      icon: Brain,
      description: "Analytics & journaling",
    },
  ];

  const lifeLevelItems = Object.entries(LIFE_LEVEL_CATEGORIES).map(
    ([key, category]) => ({
      title: category.label,
      href: `/levels/${key}`,
      icon: category.icon,
      color: category.color,
    }),
  );

  const bottomNavItems = [
    {
      title: "Profile",
      href: "/profile",
      icon: User,
    },
    {
      title: "Notifications",
      href: "/notifications",
      icon: Bell,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
    {
      title: "Help",
      href: "/help",
      icon: HelpCircle,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-card border-r border-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-32">
              <Image 
                src="/fearvana-logo.png" 
                alt="Fearvana AI" 
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2 space-y-1">
          {/* Main Items */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Main
              </div>
            )}
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      isCollapsed && "justify-center",
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{item.title}</div>
                        {item.description && (
                          <div className="text-xs opacity-70 truncate">
                            {item.description}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Life Levels */}
          <div className="space-y-1 pt-4">
            {!isCollapsed && (
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Life Areas
              </div>
            )}
            {lifeLevelItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      isCollapsed && "justify-center",
                    )}
                  >
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    {!isCollapsed && (
                      <span className="truncate">{item.title}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-border p-2 space-y-1">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  isCollapsed && "justify-center",
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.title}</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
