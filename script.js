const expenseUrl = "https://expensetracker-wtgp.onrender.com/expense";
const dateInput = document.getElementById("expenseDate");
const categoryInput = document.getElementById("expenseCategory");
const amountInput = document.getElementById("expenseAmount");
const expenseInputSubmit = document.getElementById("expenseInputSubmit");
const expenseInputUpdate = document.getElementById("expenseInputUpdate");
const table = document.getElementById("table");
const searchByRangeSubmit = document.getElementById("searchByRangeSubmit");
const searchCategotySubmit = document.getElementById("searchCategotySubmit");
const refresh = document.getElementById("refresh");
const pagination = document.getElementById("pagination");
const loading = document.getElementById("loading");

let allExpense = 0;
let currentPage = 1;
let itemsPerPage = 15;

let filters = {
    startDate: "",
    endDate: ""
};

let categories = {
    find: ""
};


showExpenseData();

async function showExpenseData() {


    let url = `${expenseUrl}?_page=${currentPage}&_per_page=${itemsPerPage}`;

    let total = `${expenseUrl}?`;

    if (filters.startDate && filters.endDate) {

        url += `&date_gte=${filters.startDate}&date_lte=${filters.endDate}`;
        total += `&date_gte=${filters.startDate}&date_lte=${filters.endDate}`;

        if (categories.find) {

            url += `&category=${categories.find}`;
            total += `&category=${categories.find}`;
        }

    }

    if (!filters.startDate && !filters.endDate) {

        if (categories.find) {

            url += `&category=${categories.find}`;
            total += `&category=${categories.find}`;
        }
    }

    showLoading();    

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Responce Is Not Ok");
        }

        let result = await response.json();

        let expense = result.data;
        allExpense = result.items;

        fillTable(expense);

        createPagination();

        const totalResponse = await fetch(total);

        const totalData = await totalResponse.json();

        let getTotal = totalAmount(totalData);

        document.getElementById("totalExpense").textContent = getTotal;
    }
    catch (error) {
        console.error("Could Not Fetch Data:", error);

    }

    finally {
        hideLoading();
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

    showLoading();

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

    finally {
        hideLoading();
    }
})

table.addEventListener("click", (event) => {

    if (event.target.classList.contains("editExpense")) {
        editExpense(event.target.dataset.id);
    }

    if (event.target.classList.contains("deleteExpense")) {
        deleteExpense(event.target.dataset.id);
    }
})

async function deleteExpense(id) {

    let confirmDelete = confirm("Are you sure you want to delete ?");

    if (!confirmDelete) {
        return;
    }

    showLoading();

    try {
        await fetch(`${expenseUrl}/${id}`, {
            method: "DELETE",
        });

        await showExpenseData();
    }

    catch (error) {
        console.error("Could Not Delete Data:", error);
    }

    finally {
        hideLoading();
    }
}

let newID = null;

async function editExpense(id) {

    showLoading();

    pageChange();

    try {

        let response = await fetch(`${expenseUrl}/${id}`);

        if (!response.ok) {
            throw new Error("Response Is Not Ok !");
        }

        let data = await response.json();

        newID = id;

        document.getElementById("expenseDate").value = data.date;
        document.getElementById("expenseCategory").value = data.category;
        document.getElementById("expenseAmount").value = data.amount;
        document.getElementById("expenseInputSubmit").style.display = "none";
        document.getElementById("expenseInputUpdate").style.display = "inline-block";

    }
    catch (error) {
        console.error("Could Not Edit Data:", error);
    }

    finally {
        hideLoading();
    }

}

expenseInputUpdate.addEventListener("click", async () => {

    let date = dateInput.value;
    let category = categoryInput.value;
    let amount = Number(amountInput.value);

    if (!isFormVaild(date, amount)) {
        return;
    }

    let updatedExpenseDetails = {
        date,
        category,
        amount
    };

    showLoading();

    try {
        await fetch(`${expenseUrl}/${newID}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(updatedExpenseDetails)
        });

        await showExpenseData();

        emptyForm();

        alert("Entery Updated !");

        document.getElementById("expenseInputSubmit").style.display = "inline-block";
        document.getElementById("expenseInputUpdate").style.display = "none";
    }

    catch (error) {
        console.error("Could Not Update Data:", error);
    }
    finally {
        hideLoading();
    }

})

searchByRangeSubmit.addEventListener("click", () => {

    let start = document.getElementById("startDate").value;
    let end = document.getElementById("endDate").value;


    if (!start) {
        alert(`Please Enter Sarting Date First !`)
        return;
    }

    if (!end) {
        alert(`Please Enter Ending Date First !`)
        return;
    }

    filters.startDate = start;

    filters.endDate = end;

    currentPage = 1;

    showExpenseData();

});

searchCategotySubmit.addEventListener("click", () => {

    let input = document.getElementById("searchCategoty").value;
    let start = document.getElementById("startDate").value;
    let end = document.getElementById("endDate").value;

    filters.startDate = start;

    filters.endDate = end;

    categories.find = input;

    showExpenseData();
})

function fillTable(input) {

    let startIndex = (currentPage - 1) * itemsPerPage;

    let rows = input.map((input, index) => ` 
                     <tr> 
                        <td>${startIndex + index + 1}</td>    
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

function totalAmount(input) {

    let total = 0;

    input.forEach(input => {
        total += input.amount;
    })

    return `₹ ${total.toLocaleString("en-IN")}`;
}

function createPagination() {

    let totalPages = Math.ceil(allExpense / itemsPerPage);

    if (currentPage === 1) {

        document.getElementById("previousPage").style.display = "none";
    }
    else {
        document.getElementById("previousPage").style.display = "block";
    }

    if (currentPage === totalPages) {
        document.getElementById("nextPage").style.display = "none";
    }
    else {
        document.getElementById("nextPage").style.display = "block";
    }

}

pagination.addEventListener("click", (event) => {

    if (event.target.id === "previousPage") {
        previous();
    }
    if (event.target.id === "nextPage") {
        next();
    }

})

function next() {

    let totalPages = Math.ceil(allExpense / itemsPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        showExpenseData();
        createPagination();
        pageChange();
        emptyForm();
    }
}

function previous() {

    if (currentPage > 1) {
        currentPage--;
        showExpenseData();
        createPagination();
        pageChange();
        emptyForm();
    }
}

function emptyForm() {

    document.getElementById("expenseDate").value = "";
    document.getElementById("expenseCategory").selectedIndex = 0;
    document.getElementById("searchCategoty").selectedIndex = 0;
    document.getElementById("expenseAmount").value = "";
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";
    newID = null;
}

function pageChange() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

refresh.addEventListener("click", () => {

    document.getElementById("expenseData").innerHTML = "";

    currentPage = 1;

    filters.startDate = '';

    filters.endDate = '';

    categories.find = '';

    showExpenseData();
    emptyForm();
    pageChange();

})

function showLoading() {
    loading.style.display = "block";
    table.style.display = "none"
}

function hideLoading() {
    loading.style.display = "none";
    table.style.display = "table"
}
