import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

const appSettings = {
    databaseURL: "https://playground-dfc9f-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");
let modal = document.getElementById('id01');

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");
const deleteAllButton = document.getElementById("delete-all-button");

addButtonEl.addEventListener("click", function () {
    let inputValue = inputFieldEl.value.trim();
    if (inputValue !== "") {
        push(shoppingListInDB, inputValue);
        clearInputFieldEl();
    }
});

onValue(shoppingListInDB, function (snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());

        clearShoppingListEl();

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            let currentItemID = currentItem[0];
            let currentItemValue = currentItem[1];

            appendItemToShoppingListEl(currentItem);
        }
    } else {
        shoppingListEl.innerHTML = "No items here... yet";
    }
});

deleteAllButton.addEventListener("click", function () {
    ref(shoppingListInDB).remove();
    clearShoppingListEl();
});

function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
    inputFieldEl.value = "";
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0];
    let itemValue = item[1];

    let newEl = document.createElement("li");

    newEl.textContent = itemValue;

    newEl.addEventListener("click", function (event) {

        modal.style.display = 'block';

        document.querySelector('.cancelbtn').addEventListener('click', function () {

            modal.style.display = 'none';
        });

        document.querySelector('.deletebtn').addEventListener('click', function () {

            let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
            remove(exactLocationOfItemInDB);

            modal.style.display = 'none';
        });

        event.stopPropagation();
    });

    shoppingListEl.append(newEl);
}

window.addEventListener('click', function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});
