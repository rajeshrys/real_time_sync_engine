import { useEffect, useState } from "react";
import {
    Users,
    UserCircle,
    Loader2,
    Wifi,
    WifiOff,
} from "lucide-react";

import {
    getConnections,
    type ConnectionMember,
} from "../api/connection";

const ConnectionMembers = () => {

    const [connections, setConnections] = useState<ConnectionMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const loadConnections = async () => {

            try {

                setLoading(true);
                setError(null);

                const data = await getConnections();

                setConnections(data);

            } catch (error) {

                console.error(
                    "Failed to load connections:",
                    error
                );

                setError(
                    "Failed to load your connections."
                );

            } finally {

                setLoading(false);
            }
        };

        loadConnections();

    }, []);


    /*
     * Loading state
     */
    if (loading) {

        return (
            <div className="flex min-h-[400px] items-center justify-center">

                <div className="flex items-center gap-2 text-gray-500">

                    <Loader2
                        size={20}
                        className="animate-spin"
                    />

                    <span>
                        Loading connections...
                    </span>

                </div>

            </div>
        );
    }


    /*
     * Error state
     */
    if (error) {

        return (
            <div className="flex min-h-[400px] items-center justify-center">

                <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">

                    {error}

                </div>

            </div>
        );
    }


    return (

        <div className="mx-auto w-full max-w-5xl p-6">

            {/* -------------------------------- */}
            {/* HEADER */}
            {/* -------------------------------- */}

            <div className="mb-6">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">

                        <Users size={22} />

                    </div>

                    <div>

                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">

                            My Connections

                        </h1>

                        <p className="text-sm text-gray-500 dark:text-gray-400">

                            People you are connected with

                        </p>

                    </div>

                </div>

            </div>


            {/* -------------------------------- */}
            {/* EMPTY STATE */}
            {/* -------------------------------- */}

            {connections.length === 0 ? (

                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40">

                    <UserCircle
                        size={48}
                        className="mb-3 text-gray-400"
                    />

                    <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">

                        No connections yet

                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">

                        Search for users and send connection requests.

                    </p>

                </div>

            ) : (

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    {connections.map((user) => (

                        <div
                            key={user.id}
                            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                        >

                            {/* USER INFORMATION */}

                            <div className="flex items-center gap-3">

                                {/* AVATAR */}

                                <div className="relative">

                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">

                                        {user.firstName
                                            ?.charAt(0)
                                            .toUpperCase()
                                        }

                                    </div>


                                    {/* ONLINE INDICATOR */}

                                    {user.active && (

                                        <span
                                            className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 dark:border-gray-900"
                                        />

                                    )}

                                </div>


                                {/* NAME + USERNAME */}

                                <div>

                                    <p className="font-medium text-gray-900 dark:text-white">

                                        {user.firstName}{" "}
                                        {user.lastName}

                                    </p>

                                    <p className="text-sm text-gray-500 dark:text-gray-400">

                                        @{user.username}

                                    </p>

                                </div>

                            </div>


                            {/* STATUS */}

                            <div className="flex items-center gap-2">

                                {user.active ? (

                                    <>
                                        <Wifi
                                            size={15}
                                            className="text-green-500"
                                        />

                                        <span className="text-sm font-medium text-green-600 dark:text-green-400">

                                            Active

                                        </span>
                                    </>

                                ) : (

                                    <>
                                        <WifiOff
                                            size={15}
                                            className="text-gray-400"
                                        />

                                        <span className="text-sm text-gray-500 dark:text-gray-400">

                                            Offline

                                        </span>
                                    </>

                                )}

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
};

export default ConnectionMembers;