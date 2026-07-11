const expenseUrl = "https://expensetracker-wtgp.onrender.com/expense";

showExpenseData();

async function showExpenseData() {


    try {

        const response = await fetch(expenseUrl);

        if (!response.ok) {
            throw new Error("Responce Is Not Ok");
        }

        let result = await response.json();

        console.log(result);
    }
    catch (error) {
        console.error("Could Not Fetch Data:", error);

    }

}