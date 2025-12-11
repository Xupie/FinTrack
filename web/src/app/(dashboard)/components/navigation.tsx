"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import NewTransaction from "./transaction/newTransaction";

type CategoryType = {
    category_name: string;
    id: number;
    type: string;
}

type NavigationProps = {
    categories: CategoryType[];
};

export default function Navigation({ categories }: NavigationProps) {
    const [newTransactionVisible, setNewTransactionVisible] = useState(false);
    const router = useRouter();

    const onClickNewTransaction = () => {
        setNewTransactionVisible(!newTransactionVisible);
    }

    async function createTransaction() {
        const amount = (document.querySelector("input[name=amount]") as HTMLInputElement).value;
        const type = (document.querySelector("input[name=type]:checked") as HTMLInputElement).id;
        const category = (document.querySelector("select[name=category]") as HTMLSelectElement).value;
        const description = (document.querySelector("input[name=description]") as HTMLInputElement).value;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/main.php?action=add_transaction`, {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify({
                amount: amount,
                type: type,
                category: category,
                description: description,
            }),
        });

        if (response.ok) {
            setNewTransactionVisible(false)
        }
    }

    return (
        <div className="sm:collapse">
            {newTransactionVisible && (
                <NewTransaction
                    categories={categories}
                    createTransaction={createTransaction}
                    cancel={onClickNewTransaction}
                />
            )}
            <div className=" fixed bottom-0 left-0 right-0 z-50 bg-surface">
                <div className="mx-auto px-6 flex justify-around items-center h-16">
                    <button
                        type="button"
                        onClick={() => router.push("/management")}
                    >
                        <Image
                            src={`/navigation/graph.svg`}
                            alt="list"
                            width={36}
                            height={36}
                        />
                    </button>
                    <button
                        type="button"
                        onClick={onClickNewTransaction}
                        className="relative rounded-2xl bg-primary p-2 my-4"
                    >
                        <Image
                            src="/navigation/plus-white.svg"
                            alt="create new transaction"
                            width={28}
                            height={28}
                        />
                    </button>
                    <button type="button">
                        <Image src="/navigation/settings.svg" alt="settings" width={36} height={36} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export function NavigationDesktop({ categories }: NavigationProps) {
    const [newTransactionVisible, setNewTransactionVisible] = useState(false);
    const router = useRouter();

    const onClickNewTransaction = () => {
        setNewTransactionVisible(!newTransactionVisible);
    }

    async function createTransaction() {
        const amount = (document.querySelector("input[name=amount]") as HTMLInputElement).value;
        const type = (document.querySelector("input[name=type]:checked") as HTMLInputElement).id;
        const category = (document.querySelector("select[name=category]") as HTMLSelectElement).value;
        const description = (document.querySelector("input[name=description]") as HTMLInputElement).value;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/main.php?action=add_transaction`, {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify({
                amount: amount,
                type: type,
                category: category,
                description: description,
            }),
        });

        if (response.ok) {
            setNewTransactionVisible(false)
        }
    }

    return (
        <div className="collapse sm:visible">
            {newTransactionVisible && (
                <NewTransaction
                    categories={categories}
                    createTransaction={createTransaction}
                    cancel={onClickNewTransaction}
                />
            )}
            <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-around items-center">
                {/* Navigation links */}
                <div className="flex items-center gap-6">
                    <button
                        type="button"
                        onClick={() => router.push("/management")}
                        className="flex items-center gap-2 hover:text-primary transition"
                    >
                        <Image src="/navigation/graph.svg" alt="Management" width={24} height={24} />
                        Management
                    </button>

                    <button
                        type="button"
                        onClick={onClickNewTransaction}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition flex items-center gap-2"
                    >
                        <Image src="/navigation/plus-white.svg" alt="New Transaction" width={24} height={24} />
                        New Transaction
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push("/settings")}
                        className="flex items-center gap-2 hover:text-primary transition"
                    >
                        <Image src="/navigation/settings.svg" alt="Settings" width={24} height={24} />
                        Settings
                    </button>
                </div>
            </nav>
        </div>
    )
}