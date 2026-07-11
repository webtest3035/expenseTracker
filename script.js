const expenseUrl = "https://expensetracker-wtgp.onrender.com/expense";
const dateInput = document.getElementById("expenseDate");
const categoryInput = document.getElementById("expenseCategory");
const amountInput = document.getElementById("expenseAmount");
const expenseInputSubmit = document.getElementById("expenseInputSubmit");
const expenseInputUpdate = document.getElementById("expenseInputUpdate");

showExpenseData();

async function showExpenseData() {

    try {

        const response = await fetch(expenseUrl);

        if (!response.ok) {
            throw new Error("Responce Is Not Ok");
        }

        let result = await response.json();

        fillTable(result);
    }
    catch (error) {
        console.error("Could Not Fetch Data:", error);

    }

}

expenseInputSubmit.addEventListener("click", async () => {

    let date = dateInput.value;
    let category = categoryInput.value;
    let amount = Number(amountInput.value);

    if (!isFormVaild(date, amount)) {
        return;
    }

    let expenseDetails = {
        date,
        category,
        amount
    };

    try {

        let response = await fetch(expenseUrl, {

            method: "POST",

            headers: {
                "content-Type": "application/json"
            },

            body: JSON.stringify(expenseDetails)
        });

        if (!response.ok) {
            throw new Error("Responce Is Not Ok !");
        }

        let data = await response.json();

        await showExpenseData();

        alert("Entery Added !");

        emptyForm();

    }

    catch (error) {
        console.error("Could Not Add Data:", error);
    }
})

function fillTable(input) {

    let rows = input.map((input, index) => ` 
                     <tr> 
                        <td>${index + 1}</td>    
                        <td>${input.date}</td>    
                        <td>${input.category}</td>    
                        <td>${input.amount}</td>    
                        <td class="expense-ctions">
                            <button class="editExpense" data-id="${input.id}">Edit</button>
                            <button class="deleteExpense" data-id="${input.id}">Delete</button>   
                        </td>    
                    </tr>`).join("");

    document.getElementById("expenseData").innerHTML = rows;

}

function isFormVaild(date, amount) {

    if (!date) {
        alert(`Invalid Date !`);
        return false;
    };

    if (amount <= 0 || isNaN(amount)) {

        alert(`Invalid Amount !`);
        return false;
    }

    return true;

}

function emptyForm() {

    document.getElementById("expenseDate").value = "";
    document.getElementById("expenseCategory").selectedIndex = 0;
    document.getElementById("searchCategoty").selectedIndex = 0;
    document.getElementById("expenseAmount").value = "";
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";
}