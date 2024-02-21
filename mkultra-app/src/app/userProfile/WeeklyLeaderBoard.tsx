import React, { useState } from "react";
import {
    TableHead,
    TableRow,
    TableHeader,
    TableCell,
    TableBody,
    Table,
} from "@/components/ui/table";

function WeeklyLeaderboard() {
    return (
        <section>
            <h1 className="text-2xl font-bold">Weekly Leaderboard</h1>
            <div className="min-h-screen ">
                <div className="max-w-4xl mt-10 p-6 bg-white rounded-lg shadow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">Rank</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead>Points</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium flex items-center">
                                    <TrophyIcon className="text-yellow-400 mr-2" />
                                </TableCell>
                                <TableCell>Adekunle Silver</TableCell>
                                <TableCell>98</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium flex items-center">
                                    <TrophyIcon className="text-gray-300 mr-2" />
                                </TableCell>
                                <TableCell>Davido</TableCell>
                                <TableCell>92</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium flex items-center">
                                    <TrophyIcon className="text-yellow-600 mr-2" />
                                </TableCell>
                                <TableCell>Simi</TableCell>
                                <TableCell>89</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium flex items-center">
                                    <span className="mr-2">4</span>
                                </TableCell>
                                <TableCell>Yemi Alade</TableCell>
                                <TableCell>85</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium flex items-center">
                                    <span className="mr-2">5</span>
                                </TableCell>
                                <TableCell>Burna Boy</TableCell>
                                <TableCell>80</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </section>
    );
}

function TrophyIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
    );
}

export default WeeklyLeaderboard;