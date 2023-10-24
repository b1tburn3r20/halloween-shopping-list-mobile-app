import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
}

const app =  initializeApp(appSettings)
const database = getDatabase(app)
const groceriesInDB = ref(database, "groceries")

const shoppingList = document.getElementById('shopping-list')
const addButton = document.getElementById('add-button')
const inputField = document.getElementById('input-field')

onValue(groceriesInDB, function(snapshot){
    if(snapshot.exists()){

        clearShoppingList()
        let groceriesArray = Object.entries(snapshot.val())
        groceriesArray.reverse()
        for(const grocery of groceriesArray){
            console.log(grocery)
            createShoppingListItem(grocery)
        }
    }
    else{
        clearShoppingList()
        let noItemsMessage = document.createElement('p')
        noItemsMessage.className = "no-items-message" 
        noItemsMessage.textContent = "no items in cart"
        shoppingList.appendChild(noItemsMessage)
    }
})

function clearShoppingList(){
    shoppingList.innerHTML = ''
}

function createShoppingListItem(itemValue){
    let newElement = document.createElement('li')
    newElement.className = "shopping-list-item"
    newElement.textContent = itemValue[1]
    shoppingList.appendChild(newElement)
    newElement.addEventListener("click", function(){
        let exactLocationOfShoppingListItem = ref(database, `groceries/${itemValue[0]}`)
        remove(exactLocationOfShoppingListItem)
    })
}

function clearInput(){
    inputField.value = ''
}

addButton.addEventListener('click', function(){
    if(inputField.value.trim() !== ""){
        console.log(inputField.value)
        push(groceriesInDB, inputField.value)
    }
    clearInput()
})