'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import useGetAllUsers from '../../../lib/user/useGetAllUsers';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import ViewUserDetailsAdmin from './viewUserDetailsAdmin';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { User } from '@/types/common';


const USERS_PER_PAGE = 10;

const AllUsers: React.FC = () => {
    const { users, getAllUsers: fetchAllUsers } = useGetAllUsers();
    const [userOpened, setUserOpened] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const getAllUsers = useCallback(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    const { paginatedUsers, totalPages } = useMemo(() => {
        const totalPages = Math.ceil((users?.length ?? 0) / USERS_PER_PAGE);
        const startIndex = (currentPage - 1) * USERS_PER_PAGE;
        const paginatedUsers = users?.slice(startIndex, startIndex + USERS_PER_PAGE) ?? [];
        return { paginatedUsers, totalPages };
    }, [users, currentPage]);

    const handleUserOpen = useCallback((id: string) => {
        setUserOpened(id);
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <section className="w-full min-h-screen bg-white p-6">
            <h2 className="text-2xl font-semibold mb-8">All Users</h2>

            <div className="grid gap-4">
                {paginatedUsers.map((user: User) => (
                    <div
                        key={user._id}
                        onClick={() => handleUserOpen(user._id)}
                        className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center"
                    >
                        <div className="flex items-center gap-6">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                    src={user.avatar?.url || '/user.png'}
                                    alt={user.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="font-medium text-lg">{user.name}</h3>
                        </div>
                        <div>
                            <span className="text-gray-600">
                                Joined: {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    className="cursor-pointer"
                                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }, (_, idx) => (
                                <PaginationItem key={idx}>
                                    <PaginationLink
                                        className="cursor-pointer"
                                        onClick={() => handlePageChange(idx + 1)}
                                        isActive={currentPage === idx + 1}
                                    >
                                        {idx + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    className="cursor-pointer"
                                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            <AnimatePresence>
                {userOpened && users && (
                    <ViewUserDetailsAdmin
                        currentUser={users.find((user: User) => user._id === userOpened)!}
                        setUserOpened={setUserOpened}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default AllUsers;