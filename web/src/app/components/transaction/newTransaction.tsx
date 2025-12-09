import Button from "../buttons/button";

type NewTransactionProps = {
    categories: {
        category_name: string;
        id: number;
        type: string;
    }[];
    createTransaction: () => void;
    cancel: () => void;
}

export default function NewTransaction({ categories, createTransaction, cancel }: NewTransactionProps) {
    return (
        // Full-screen overlay
        <div className="mx-2 fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            {/* Modal container */}
            <div className="bg-surface rounded-lg shadow-xl w-full max-w-3xl p-6 relative">
                <div className="flex flex-col mx-auto sm:w-3/5 gap-4">
                    {/* Amount */}
                    <div>
                        <label htmlFor="amount" className="flex mb-1 font-medium text-foreground">
                            Amount
                        </label>
                        <input
                            type="text"
                            id="amount"
                            name="amount"
                            placeholder="123.45€"
                            className="border text-background bg-foreground border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>


                    {/* Transaction type */}
                    <div className="flex text-foreground">
                        <label htmlFor="expense">Expense</label>
                        <input type="radio" name="type" id="expense" />
                        <label htmlFor="income">Income</label>
                        <input type="radio" name="type" id="income" />
                    </div>

                    {/* Category */}
                    <div className="flex">
                        <select name="category" id="category">
                            <option id="none" value="none">No category</option>
                             {categories && categories.map((category, index) => (
                                <option key={category.id} value={category.id}>{category.category_name}</option>
                            ))}
                        </select>
                        <div className="flex ms-auto">
                            <Button size="sm" text="New Category" type="primary" />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="flex mb-1 font-medium text-foreground">
                           
                        </label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            placeholder="Groceries..."
                            className="border text-background bg-foreground border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-around mt-4">
                    <Button
                        size="xl"
                        text="Create"
                        type="primary"
                        onClick={createTransaction}
                    />
                    <Button
                        size="xl"
                        text="Cancel"
                        type="cancel"
                        onClick={cancel}
                    />
                </div>
            </div>
        </div>
    )
}