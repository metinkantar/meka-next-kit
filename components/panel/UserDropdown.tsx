/* eslint-disable @next/next/no-img-element */
//@ts-nocheck
'use client'
import React, { FC } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useSession } from "next-auth/react"
import { logout } from "@/actions/logout";



const UserDropdown: FC = () => {
    const { data: session, status } = useSession();

    const signOut = () => {
        logout();
    };

    return (
        <>
            <DropdownMenu.Root modal={false}>
                <DropdownMenu.Trigger asChild>
                    <button
                        className="w-[35px] h-[35px] inline-flex items-center justify-center outline-none ml-3"
                        aria-label="UserDropdown"
                    >
                        <img className="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" />
                    </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content
                    className="z-50 mr-3 data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                    sideOffset={0}
                    data-side="left"
                    data-align='start'
                >
                    <div className="text-base list-none bg-white divide-y divide-gray-300 rounded shadow dark:bg-gray-700 dark:divide-gray-600 border border-gray-300" id="dropdown-user">
                        <div className="px-4 py-3" role="none">
                            <p className="text-sm text-gray-900 dark:text-white" role="none">
                                {session?.user?.fullName}
                            </p>
                            <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                                {session?.user?.email}
                            </p>
                        </div>
                        <ul className="py-1" role="none">
                            {session &&
                                <li>
                                    <a href="/panel" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Panel</a>
                                </li>
                            }
                            <li>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Ayarlar</a>
                            </li>
                            <li>
                                <span
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                    onClick={signOut}
                                >
                                    Çıkış Yap
                                </span>
                            </li>
                        </ul>
                    </div>
                    <DropdownMenu.Arrow className="fill-slate-200" height={14} width={18} />
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </>
    )
}


export default UserDropdown;