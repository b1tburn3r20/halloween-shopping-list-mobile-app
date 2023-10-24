import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
}

const app =  initializeApp(appSettings)
const database = getDatabase(app)
const groceriesInDB = ref(database, "groceries")

onValue(groceriesInDB, function(snapshot) {
    
    if(snapshot.exists()){
        clearShoppingListEl()
        // 
        let groceriesArray = Object.entries(snapshot.val())
        // 
        groceriesArray.reverse();
        for (const grocery of groceriesArray){
            createShoppingListItem(grocery)
        } 
    }else {
        shoppingListEl.innerHTML = "Shopping Cart Empty"
    }
})

const inputElement = document.getElementById('input-field')
const addButton = document.getElementById('add-button')
const shoppingListEl = document.getElementById('shopping-list')

function clearInput(inputElement){
    inputElement.value = ''
}
function createShoppingListItem(itemValue){
    // shoppingListEl.innerHTML += `<li class="shopping-list-item">${itemValue}</li>`
    let newEl = document.createElement('li')
    newEl.className = "shopping-list-item"
    newEl.textContent = itemValue[1]
    shoppingListEl.appendChild(newEl)
    newEl.addEventListener("click", function(){
        let exactLocationOfShoppingListItem = ref(database, `groceries/${itemValue[0]}`)
        // alert(`Remove ${itemValue[1]} from shopping list?`)
        remove(exactLocationOfShoppingListItem)
    }) 
}
function clearShoppingListEl(){
    shoppingListEl.innerHTML = ''
}

addButton.addEventListener("click", function(){
    let inputValue = inputElement.value.trim()
    if(inputValue !== ""){
        push(groceriesInDB, inputValue)
        console.log(`${inputValue} successfully pushed to db`)
        clearInput(inputElement)
    }
    else {
        console.log(
            'user must input text to submit the form'
        )
    }
})

