document.addEventListener("DOMContentLoaded", () => {
  const expenseName = document.querySelector("#expense-id");
  const expenseAmount = document.querySelector("#expense-amt");
  const addExpenseButton = document.querySelector("#expense-add-button");
  const expenseList = document.querySelector("#expense-list");
  const totalAmount = document.querySelector("#amount");
  const emptyList = document.querySelector("#emptyList");

  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  renderExpenses();
  addExpenseButton.addEventListener("click", () => {
    const name = expenseName.value.trim().toUpperCase();
    const amt = Number(parseFloat(expenseAmount.value).toFixed(2));
    if (name === "" || isNaN(amt) || amt <= 0) return;
    const item = {
      id: Date.now(),
      name,
      amt,
    };
    expenses.push(item);
    updateLocalStorage();
    renderExpenses();
    expenseName.value = "";
    expenseAmount.value = "";
  });
  expenseList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
      const btn = e.target.closest("button");
      const id = Number(btn.getAttribute("data-id"));
      const index = expenses.findIndex((exp) => exp.id === id);

      if (index !== -1) {
        expenses.splice(index, 1);
        updateLocalStorage();
        renderExpenses();
      }
    }
  });
  emptyList.addEventListener("click", (e) => {
    if (e.target.tagName === "SPAN" || e.target.closest("span")) {
      expenses.length = 0;
      updateLocalStorage();
      renderExpenses();
    }
  });
  function renderExpenses() {
    expenseList.innerHTML = "";
    if (expenses.length !== 0) {
      expenses.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("expense-item");
        itemDiv.innerHTML = `
        <p>${item.name} (<span>Rs. ${item.amt.toFixed(2)}</span>)</p>
        <button data-id="${item.id}" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      `;
        expenseList.appendChild(itemDiv);
      });
    }
    updateTotal();
  }
  function updateTotal() {
    const total = expenses.reduce((sum, item) => sum + item.amt, 0);
    totalAmount.textContent = total.toFixed(2);
  }
  function updateLocalStorage() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }
});
