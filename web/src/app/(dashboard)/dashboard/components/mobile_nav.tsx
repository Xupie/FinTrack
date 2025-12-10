"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";

type Mobile_navProps = {
    onClickNewTransaction: () => void;
}

export default function Mobile_nav({onClickNewTransaction}: Mobile_navProps) {
    const router = useRouter();
    return (
        <div className="sm:collapse fixed bottom-0 left-0 right-0 z-50">
            <div className="mx-auto bg-surface px-6 flex justify-around items-center">
                <button
                    className=""
                    type="button"
                    onClick={() => router.push("/dashboard")}
                >
                    <Image
                        src={`/mobile-nav/home.svg`}
                        alt="home"
                        width={28}
                        height={28}
                    />
                </button>
                <button
                    type="button"
                    onClick={onClickNewTransaction}
                    className="relative rounded-2xl bg-primary p-2 my-4"
                >
                    <Image
                        src="/mobile-nav/plus-white.svg"
                        alt="create new transaction"
                        width={28}
                        height={28}
                    />
                </button>

                <button type="button">
                    <Image src="/mobile-nav/settings.svg" alt="settings" width={28} height={28} />
                </button>
            </div>
        </div>
    )
}