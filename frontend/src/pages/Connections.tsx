import { useEffect, useRef, useState } from "react";
import { Search, UserRound, X, Loader2 } from "lucide-react";
import { searchUsers, type UserSearchResult } from "../api/user";

export default function Connections() {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState<UserSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Used to prevent an older API response
    // from overwriting a newer search result.
    const searchRequestId = useRef(0);

    useEffect(() => {
        const trimmedQuery = query.trim();

        // Empty search
        if (!trimmedQuery) {
            setUsers([]);
            setLoading(false);
            setError("");
            return;
        }

        // Don't search for very short queries
        if (trimmedQuery.length < 2) {
            setUsers([]);
            setLoading(false);
            setError("");
            return;
        }

        const requestId = ++searchRequestId.current;

        const timeout = setTimeout(async () => {
            try {
                setLoading(true);
                setError("");

                const results = await searchUsers(trimmedQuery);

                // Ignore stale response
                if (requestId !== searchRequestId.current) {
                    return;
                }

                setUsers(results);
            } catch (error) {
                console.error("User search failed:", error);

                if (requestId !== searchRequestId.current) {
                    return;
                }

                setUsers([]);
                setError("Unable to search users. Please try again.");
            } finally {
                if (requestId === searchRequestId.current) {
                    setLoading(false);
                }
            }
        }, 400);

        return () => {
            clearTimeout(timeout);
        };
    }, [query]);

    const clearSearch = () => {
        setQuery("");
        setUsers([]);
        setError("");
    };

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "Escape") {
            clearSearch();
        }
    };

    return (
        <div className="min-h-full bg-gray-50 p-6">

            <div className="mx-auto max-w-4xl">

                {/* Header */}
                <div className="mb-8">

                    <h1 className="text-2xl font-semibold text-gray-900">
                        Find People
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Search for people by username or email and connect
                        with them.
                    </p>

                </div>

                {/* Search */}
                <div className="relative max-w-2xl">

                    <Search
                        size={20}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        value={query}
                        onChange={(event) =>
                            setQuery(event.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        placeholder="Search by username or email..."
                        className="
                            w-full
                            rounded-xl
                            border border-gray-200
                            bg-white
                            py-3
                            pl-11
                            pr-12
                            text-sm
                            text-gray-900
                            outline-none
                            transition
                            placeholder:text-gray-400
                            focus:border-gray-400
                            focus:ring-2
                            focus:ring-gray-100
                        "
                    />

                    {/* Loading indicator */}
                    {loading && (
                        <Loader2
                            size={18}
                            className="
                                absolute
                                right-4
                                top-1/2
                                -translate-y-1/2
                                animate-spin
                                text-gray-400
                            "
                        />
                    )}

                    {/* Clear button */}
                    {!loading && query && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="
                                absolute
                                right-3
                                top-1/2
                                -translate-y-1/2
                                rounded-full
                                p-1.5
                                text-gray-400
                                transition
                                hover:bg-gray-100
                                hover:text-gray-700
                            "
                            aria-label="Clear search"
                        >
                            <X size={18} />
                        </button>
                    )}

                </div>

                {/* Search hint */}
                {query.trim().length === 1 && (
                    <p className="mt-2 text-xs text-gray-400">
                        Enter at least 2 characters to search.
                    </p>
                )}

                {/* Error */}
                {error && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Results */}
                {!loading &&
                    !error &&
                    query.trim().length >= 2 &&
                    users.length > 0 && (

                        <div className="mt-6">

                            <div className="mb-3 text-sm font-medium text-gray-500">
                                Search results
                            </div>

                            <div className="space-y-2">

                                {users.map((user) => {

                                    const initials =
                                        `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`
                                            .toUpperCase();

                                    return (
                                        <div
                                            key={user.id}
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                rounded-xl
                                                border
                                                border-gray-200
                                                bg-white
                                                p-4
                                                transition
                                                hover:border-gray-300
                                                hover:shadow-sm
                                            "
                                        >

                                            <div className="flex items-center gap-4">

                                                {/* Avatar */}
                                                <div
                                                    className="
                                                        flex
                                                        h-11
                                                        w-11
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-gray-100
                                                        text-sm
                                                        font-semibold
                                                        text-gray-600
                                                    "
                                                >
                                                    {initials || (
                                                        <UserRound size={20} />
                                                    )}
                                                </div>

                                                {/* User information */}
                                                <div>

                                                    <div className="font-medium text-gray-900">
                                                        {user.firstName}{" "}
                                                        {user.lastName}
                                                    </div>

                                                    <div className="text-sm text-gray-500">
                                                        @{user.username}
                                                    </div>

                                                    <div className="mt-0.5 text-xs text-gray-400">
                                                        {user.email}
                                                    </div>

                                                </div>

                                            </div>

                                            {/* Connection button */}
                                            <button
                                                type="button"
                                                className="
                                                    rounded-lg
                                                    border
                                                    border-gray-200
                                                    px-4
                                                    py-2
                                                    text-sm
                                                    font-medium
                                                    text-gray-700
                                                    transition
                                                    hover:bg-gray-50
                                                "
                                            >
                                                Connect
                                            </button>

                                        </div>
                                    );
                                })}

                            </div>

                        </div>
                    )}

                {/* No results */}
                {!loading &&
                    !error &&
                    query.trim().length >= 2 &&
                    users.length === 0 && (

                        <div className="mt-12 text-center">

                            <div
                                className="
                                    mx-auto
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-gray-100
                                "
                            >
                                <Search
                                    size={21}
                                    className="text-gray-400"
                                />
                            </div>

                            <h2 className="mt-4 text-sm font-medium text-gray-900">
                                No users found
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Try searching with a different username or
                                email.
                            </p>

                        </div>
                    )}

                {/* Initial state */}
                {!query.trim() && (
                    <div className="mt-12 text-center">

                        <div
                            className="
                                mx-auto
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-full
                                bg-gray-100
                            "
                        >
                            <UserRound
                                size={21}
                                className="text-gray-400"
                            />
                        </div>

                        <h2 className="mt-4 text-sm font-medium text-gray-900">
                            Find people to connect with
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Start typing a username or email address above.
                        </p>

                    </div>
                )}

            </div>
        </div>
    );
}
