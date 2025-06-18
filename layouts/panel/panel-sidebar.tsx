
'use client'
import { NavMain } from "@/components/panel/nav-main";
import { NavUser } from "@/components/panel/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { LayoutDashboard, BookOpenText, ChartBarBigIcon, DessertIcon, FileAudioIcon, FolderRootIcon, ListCheck, UsersIcon } from "lucide-react";

// Menu items.
const data = {
    user: {
        name: "meka",
        email: "meka@metinkantar.com",
        avatar: "/images/avatars/meka.png",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/panel",
            icon: LayoutDashboard,
        },
        {
            title: "Menu 2",
            icon: BookOpenText,
            url: "#",
            items: [
                {
                    title: "Menu 2 Item 1",
                    url: "/panel/#",
                },
                {
                    title: "Menu 2 Item 2",
                    url: "/panel/#",
                },
                {
                    title: "Menu 2 Item 3",
                    url: "/panel/#",
                }
            ],
        },
        {
            title: "Menu 3",
            icon: UsersIcon,
            url: "#",
            items: [
                {
                    title: "Menu 3 Item 1",
                    url: "/panel/#",
                },
                {
                    title: "Menu 3 Item 2",
                    url: "/panel/#",
                },
                {
                    title: "Menu 3 Item 3",
                    url: "/panel/#"
                },
                {
                    title: "Menu 3 Item 4",
                    url: "/panel/#"
                }
            ],
        },
        {
            title: "Menu 4",
            icon: FileAudioIcon,
            url: "#",
            items: [
                {
                    title: "Menu 4 Item 1",
                    url: "/panel/#",
                },
                {
                    title: "Menu 4 Item 2",
                    url: "/panel/#",
                },
            ],
        },
        {
            title: "Menu 5",
            icon: DessertIcon,
            url: "/panel/#",
        },
        {
            title: "Menu 6",
            icon: DessertIcon,
            url: "/panel/#",
        },
    ]
}

export function PanelSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props} >
            <SidebarHeader>
                <div className="flex justify-center">
                    <a href="#">
                        <img
                            className="h-10 w-50"
                            src="/images/global/meka-logo.png"
                            alt="MeKa App Logo"
                        />
                    </a>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}

{/* 
    
    "use client"

import * as React from "react"


import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/panel/nav-user"
import { NavMain } from "@/components/panel/nav-main"

import { CameraIcon, ChartBarBigIcon, DatabaseIcon, FileAudioIcon, FolderRootIcon, HelpCircle, ListCheck, SearchIcon, Settings2Icon, UsersIcon } from "lucide-react";
import { FaFileWord } from "react-icons/fa";
import { MdDashboard, MdDescription, MdReport } from "react-icons/md";

// Menu items.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "#",
            icon: MdDashboard,
        },
        {
            title: "Lifecycle",
            url: "#",
            icon: ListCheck,
        },
        {
            title: "Analytics",
            url: "#",
            icon: ChartBarBigIcon,
        },
        {
            title: "Projects",
            url: "#",
            icon: FolderRootIcon,
        },
        {
            title: "Team",
            url: "#",
            icon: UsersIcon,
        },
    ],
    navClouds: [
        {
            title: "Capture",
            icon: CameraIcon,
            isActive: true,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
        {
            title: "Proposal",
            icon: MdDescription,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
        {
            title: "Prompts",
            icon: FileAudioIcon,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "#",
            icon: Settings2Icon,
        },
        {
            title: "Get Help",
            url: "#",
            icon: HelpCircle,
        },
        {
            title: "Search",
            url: "#",
            icon: SearchIcon,
        },
    ],
    documents: [
        {
            name: "Data Library",
            url: "#",
            icon: DatabaseIcon,
        },
        {
            name: "Reports",
            url: "#",
            icon: MdReport,
        },
        {
            name: "Word Assistant",
            url: "#",
            icon: FaFileWord,
        },
    ],
}

export function PanelSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="#">
                                <img
                                    className="h-6 w-10"
                                    src="/images/global/meka-logo.png"
                                    alt="MeKa App Logo"
                                />
                                <span className="text-base font-semibold">MeKa Inc.</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
    */}