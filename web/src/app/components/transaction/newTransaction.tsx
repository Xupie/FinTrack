import Button from "../buttons/button";

type NewTransactionProps = {
    createTransaction: () => void;
    cancel: () => void;
}

export default function NewTransaction({ createTransaction, cancel }: NewTransactionProps) {
    return (
        // Full-screen overlay
        <div className="mx-2 fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            {/* Modal container */}
            <div className="bg-surface rounded-lg shadow-xl w-full max-w-3xl p-6 relative">
                {/* Amount Input */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col mx-auto w-3/5">
                        <label htmlFor="amount" className="mb-1 font-medium text-foreground">
                            Määrä
                        </label>
                        <input
                            type="text"
                            id="amount"
                            name="amount"
                            placeholder="123.45€"
                            className="border text-background bg-foreground border-gray-300 rounded-lg px-3 py-2"
                        />

                        <div className="flex text-foreground">
                            <label htmlFor="meno">Meno</label>
                            <input type="radio" name="radio_select" id="meno" />
                            <label htmlFor="tulo">Tulo</label>
                            <input type="radio" name="radio_select" id="tulo" />
                        </div>

                        <select name="category" id="category">
                            <option value="none">Ei kategoriaa</option>
                        </select>

                        <label htmlFor="description" className="mb-1 font-medium text-foreground">
                            Description
                        </label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            placeholder="Groceries..."
                            className="border text-background bg-foreground border-gray-300 rounded-lg px-3 py-2"
                        />

                    </div>



                    {/* Buttons */}
                    <div className="flex justify-around mt-4">
                        <Button
                            size="xl"
                            text="Lisää"
                            type="primary"
                            onClick={createTransaction}
                        />
                        <Button
                            size="xl"
                            text="Peruuta"
                            type="cancel"
                            onClick={cancel}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}