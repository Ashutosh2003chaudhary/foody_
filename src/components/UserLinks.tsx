"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

function UserLinks() {
    const { data: session, status } = useSession();

    const isAdmin = session?.user?.isAdmin;

    return (
        <div>
            {status === "authenticated" ? (
                <div className="flex items-center">
                    <Link href="/orders">Orders</Link>
                    {isAdmin && (
                        <Link href="/add" className="ml-4">Add Product</Link>
                    )}
                    <span className="ml-4 cursor-pointer" onClick={() => signOut()}>Logout</span>
                </div>
            ) : (
                <Link href="/login">Login</Link>
            )}
        </div>
    );
}

export default UserLinks;
