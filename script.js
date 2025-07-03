const itemForms = document.querySelector("#item-form");
const inputField = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearAll = document.querySelector(".btn-clear");
const filterItem = document.querySelector(".filter");
const addButton = itemForms.querySelector(".btn");
let isItemEdit = false;

function displyItems() {
  const itemsFormStorage = getItemFromStorage();
  itemsFormStorage.forEach((item) => {
    addItemDOM(item);
    checkUI();
  });
}
function onAddItemSubmit(e) {
  e.preventDefault();
  const itemValue = inputField.value.trim();

  // validation
  if (itemValue === "") {
    alert("please enter the item");
    return;
  }

  if (isItemEdit) {
    const toEdit = itemList.querySelector(".edit-mode");
    removeFormStorage(toEdit.textContent);
    toEdit.classList.remove("edit-mode");
    toEdit.remove();
    isItemEdit = false;
  } else {
    if (itemAlreadyExists(itemValue)) {
      alert("item already exists");
      return;
    }
  }

  // create item to dom
  addItemDOM(itemValue);

  // add item to localStorage
  addItemToStorage(itemValue);

  inputField.value = "";
  checkUI();
}
// addItem to DOM
function addItemDOM(item) {
  const LiItem = document.createElement("li");
  LiItem.appendChild(document.createTextNode(item));
  const button = createButton("remove-item btn-link text-red");
  LiItem.appendChild(button);
  itemList.appendChild(LiItem);
}
// button
function createButton(classes) {
  const btn = document.createElement("button");
  btn.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  btn.appendChild(icon);
  return btn;
}
// icon
function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}
// add item to storage
function addItemToStorage(item) {
  const itemFromStorage = getItemFromStorage();
  itemFromStorage.push(item);
  // convert to JSON and add it to the localStorage
  localStorage.setItem("itemValues", JSON.stringify(itemFromStorage));
}
function getItemFromStorage() {
  let itemFromStorage;
  if (localStorage.getItem("itemValues") === null) {
    itemFromStorage = [];
  } else {
    itemFromStorage = JSON.parse(localStorage.getItem("itemValues"));
  }
  return itemFromStorage;
}
// remove items
function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemEdit(e.target);
  }
}
function itemAlreadyExists(item) {
  const itemFromStorage = getItemFromStorage();
  return itemFromStorage.includes(item);
}
function setItemEdit(item) {
  isItemEdit = true;
  itemList.querySelectorAll("li").forEach((i) => {
    i.classList.remove("edit-mode");
  });
  item.classList.add("edit-mode");
  addButton.innerHTML = `<i class="fas fa-pen"></i> Update item`;
  addButton.style.backgroundColor = "green";
  inputField.value = item.textContent.trim();
}
function removeItem(item) {
  // remove from DOM
  item.remove();

  // remove from storage
  removeFormStorage(item.textContent);
  checkUI();
}
function removeFormStorage(item) {
  let itemFromStorage = getItemFromStorage();
  // filter out item to be remove
  itemFromStorage = itemFromStorage.filter((i) => i !== item);
  localStorage.setItem("itemValues", JSON.stringify(itemFromStorage));
}
// removeAllItem
function removeAllItem() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  localStorage.removeItem("itemValues");
  checkUI();
}
// event listener
// check UI
function checkUI() {
  const items = itemList.querySelectorAll("li");
  inputField.value = "";
  if (items.length === 0) {
    filterItem.style.display = "none";
    clearAll.style.display = "none";
  } else {
    filterItem.style.display = "block";
    clearAll.style.display = "block";
  }

  addButton.innerHTML = '<i class="fas fa-plus"></i> add item';
  addButton.style.backgroundColor = "#333";
  isItemEdit = false;
}

// filterItem
function filterItems(e) {
  const items = itemList.querySelectorAll("li");
  const text = e.target.value.toLowerCase();
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}
//  intialization
function init() {
  // event listeners
  itemForms.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearAll.addEventListener("click", removeAllItem);
  filterItem.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displyItems);
  checkUI();
}
init();
