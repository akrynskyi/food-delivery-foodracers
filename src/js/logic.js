// Variables
// cart button open
const openCartButton = document.querySelector("#openCart");
// close cart button
const closeCartButton = document.querySelector("#closeCart");
// order button
const orderButton = document.querySelector("#orderBtn");
// cart overlay
const cartOverlay = document.querySelector("#cartOverlay");
// cart
const cartDOM = document.querySelector(".cart");
// cart items counter
const cartItems = document.querySelector("#itemsCounter");
// cart total
const cartTotal = document.querySelector("#orderCheckout");
// cart items container
const cartItemsContainer = document.querySelector(".cart-item-wrapper");
// products container
const productsContainer = document.querySelector(".products-container");

// cart array
let cart = [];
// buttons
let buttonsDOM = [];

// getting the data from json file
class Data {
  async getMenuItems() {
    try {
      let result = await fetch("menu.json");
      let data = await result.json();
      let menu = data.menu;
      return menu;
    } catch (error) {
      console.log(error);
    }
  }
}
// display products
class Render {
  displayProducts(menu) {
    let result = "";
    menu.forEach(item => {
      if(item.portion === undefined){
        item.portion = "";
      }
      result += `
      <articte class="product" data-country="${item.country}" data-type="${item.type}">
          <!-- image -->
          <div class="product-image-wrapper">
              <img 
              src="${item.image}" alt="meal" 
              class="product-image">
          </div>
          <!-- image -->
          <div class="product-info-wrapper">
              <!-- product info -->
              <div class="product-info">
                  <div class="product-title">
                      ${item.title}
                  </div>
                  <div class="product-meta">
                      <div class="product-portion">
                          ${item.portion}
                      </div>
                      <div class="product-price">
                          ₴${item.price}
                      </div>
                  </div>
              </div>
              <!-- product info -->
              <!-- product action -->
              <div class="product-action-box">
                  <button class="order-btn bag-btn" data-id="${item.id}">
                      Додати до кошика
                  </button>
              </div>
              <!-- product action -->
          </div>
      </articte>
      `;
    });
    productsContainer.innerHTML = result;
  }
  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;
    buttons.forEach(button => {
      let id = button.getAttribute("data-id");
      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.innerText = "У кошику";
        button.disabled = true;
      }
      button.addEventListener("click", e => {
        e.target.innerText = "У кошику";
        e.target.disabled = true;
        // get item from storage
        let cartItem = { ...Storage.getItem(id), amount: 1 };
        // add item to the cart
        cart = [...cart, cartItem];
        // save cart in local storage
        Storage.saveCart(cart);
        // set cart values
        this.setCartValues(cart);
        // display cart item
        this.addCartItem(cartItem);
        // show the cart
        this.showCart();
      });
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = `₴${parseFloat(tempTotal.toFixed(2))}`;
    cartItems.innerText = itemsTotal;
  }
  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
    <!-- image -->
    <div class="cart-item__image-wrapper">
        <img src=${item.image} alt="meal" class="product-image">
    </div>
    <!-- item info -->
    <div class="cart-item__info">
        <!-- meta -->
        <div class="cart-item__info-meta">
            <div class="item-title">
                ${item.title}
            </div>
            <div class="item-portion">
                ${item.portion}
            </div>
            <div class="item-price">
                ₴${item.price}
            </div>
        </div>
        <!-- meta -->
        <!-- actions -->
        <div class="cart-item__info-actions">
            <!-- add more items to cart -->
            <div class="quantity-selector-box">
                <div class="quantity-selector">
                    <button class="quantity-selector__btn btn--mod">
                        <svg class="icon quantity-icon" data-decrease="0" data-id="${item.id}" role="presentation" viewBox="0 0 16 2">
                            <path d="M1,1 L15,1" stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="square"></path>
                        </svg>
                    </button>
                    <span class="quantity-selector__current-quantity">${item.amount}</span>
                    <button class="quantity-selector__btn btn--mod">
                        <svg class="icon quantity-icon" data-increase="1" data-id="${item.id}" role="presentation" viewBox="0 0 16 16">
                            <g stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="square">
                                <path d="M8,1 L8,15"></path>
                                <path d="M1,8 L15,8"></path>
                            </g>
                        </svg>
                    </button>
                </div>
            </div>
            <!-- add more items to cart -->
            <!-- remove items -->
            <div class="remove-item-box">
                <span class="remove-btn" data-id="${item.id}">
                    Видалити
                </span>
            </div>
            <!-- remove items -->
        </div>
        <!-- actions -->
    </div>
    `;
    cartItemsContainer.appendChild(div);
  }
  showCart() {
    cartOverlay.classList.add("overlay__visible");
    cartDOM.classList.add("cart__open");
  }
  hideCart() {
    cartOverlay.classList.remove("overlay__visible");
    cartDOM.classList.remove("cart__open");
  }
  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    openCartButton.addEventListener("click", this.showCart);
    closeCartButton.addEventListener("click", this.hideCart);
  }
  populateCart(cart) {
    cart.forEach(item => this.addCartItem(item));
  }
  cartLogic() {
    // order cart button
    orderButton.addEventListener("click", () => {
      this.clearCart();
    });
    // cart functionality
    cartItemsContainer.addEventListener("click", e => {
      if (e.target.classList.contains("remove-btn")) {
        let removeItemButton = e.target;
        let id = removeItemButton.dataset.id;
        cartItemsContainer.removeChild(
          removeItemButton.parentElement.parentElement.parentElement
            .parentElement
        );
        this.removeItem(id);
      } else if (e.target.hasAttribute("data-increase")) {
        let addAmount = e.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.parentNode.previousElementSibling.innerText = tempItem.amount;
      } else if (e.target.hasAttribute("data-decrease")) {
        let lowerAmount = e.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if(tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.parentNode.nextElementSibling.innerText = tempItem.amount;
        }else{
          cartItemsContainer.removeChild(lowerAmount.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
          this.removeItem(id);
        }
      }
    });
  }
  clearCart() {
    let cartItems = cart.map(item => item.id);
    cartItems.forEach(id => this.removeItem(id));
    while (cartItemsContainer.children.length > 0) {
      cartItemsContainer.removeChild(cartItemsContainer.children[0]);
    }
    // hide cart
    this.hideCart();
  }
  removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerText = "Додати до кошика";
  }
  getSingleButton(id) {
    return buttonsDOM.find(button => button.dataset.id === id);
  }
}

// sort
function menuSort(menu) {
  let beverages = menu.beverages;
  let italian = menu.italianCuisine;
  let menuComplete = italian.concat(beverages);
  menuComplete.forEach(item => {
    let type = item.type;
    console.log(type);
  });
  render.displayProducts(menuComplete);
  Storage.saveMenuItems(menuComplete);
}

// local storage
class Storage {
  static saveMenuItems(menu) {
    localStorage.setItem("items", JSON.stringify(menu));
  }
  static getItem(id) {
    let items = JSON.parse(localStorage.getItem("items"));
    return items.find(item => item.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

const data = new Data();
const render = new Render();

document.addEventListener("DOMContentLoaded", () => {
  // setup app
  render.setupAPP();
  // get all products
  data
    .getMenuItems()
    .then(menu => menuSort(menu))
    .then(() => {
      render.getBagButtons();
      render.cartLogic();
    });
});

// tabs
const tabs = document.querySelectorAll(".underlined-tabs-container__tab");

tabs.forEach(tab => {
  tab.addEventListener("click", e => {
    addActive(e);
    let country = e.target.getAttribute("data-set");
    console.log(country);
  });
});
function addActive(e) {
  tabs.forEach(tab => {
    tab.classList.remove("underlined-tabs-container__tab--active");
  });
  e.target.classList.add("underlined-tabs-container__tab--active");
}
