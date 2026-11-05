let filterButtons = document.querySelectorAll(".filter");
let products = document.querySelectorAll(".product");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

let cartCount = document.querySelector("#cart-count");
let favoritesCount = document.querySelector("#favorites-count");

let cartBox = document.querySelector("#cart");
let cartItems = document.querySelector("#cart-items");
let cartTotal = document.querySelector("#cart-total");

let favoritesMode = false;

products.forEach((product, index) => {
    product.dataset.id = String(index + 1);

    if (!product.querySelector(".like-btn")) {
        let likeButton = document.createElement("button");
        likeButton.className = "like-btn";
        likeButton.innerHTML = '<i class="fa-regular fa-heart"></i>';
        product.append(likeButton);
    }

    if (!product.querySelector(".add-btn")) {
        let addButton = document.createElement("button");
        addButton.className = "add-btn";
        addButton.textContent = "Add to cart";
        product.append(addButton);
    }
});

function saveData() {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function updateFavorites() {
    favoritesCount.textContent = favorites.length;

    products.forEach(product => {
        let button = product.querySelector(".like-btn");
        let icon = button.querySelector("i");
        let id = product.dataset.id;

        if (favorites.includes(id)) {
            icon.className = "fa-solid fa-heart";
            button.classList.add("liked");
        } else {
            icon.className = "fa-regular fa-heart";
            button.classList.remove("liked");
        }
    });

    saveData();
}

function updateCart() {
    let count = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartCount.textContent = count;
    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
    }

    cart.forEach(item => {
        total += item.price * item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div class="cart-info">
                    <h3>${item.name}</h3>
                    <p>$${item.price}</p>
                </div>

                <div class="cart-controls">
                    <button class="quantity-btn" data-action="minus" data-id="${item.id}">−</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-action="plus" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });

    cartTotal.textContent = total;

    saveData();
}

function showProducts(category) {
    favoritesMode = false;

    products.forEach(product => {
        let matches = category === "all" ||
            product.dataset.category === category;

        product.style.display = matches ? "" : "none";
    });
}

products.forEach(product => {
    product.addEventListener("click", event => {
        let likeButton = event.target.closest(".like-btn");
        let addButton = event.target.closest(".add-btn");

        let id = product.dataset.id;

        if (likeButton) {
            if (favorites.includes(id)) {
                favorites = favorites.filter(item => item !== id);
            } else {
                favorites.push(id);
            }

            updateFavorites();

            if (favoritesMode) {
                showFavorites();
            }
        }

        if (addButton) {
            let name = product.querySelector("h3").textContent;
            let price = Number(
                product.querySelector("p").textContent.replace("$", "")
            );

            let existing = cart.find(item => item.id === id);

            if (existing) {
                existing.quantity++;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    quantity: 1
                });
            }

            updateCart();

            addButton.textContent = "Added ✓";

            setTimeout(() => {
                addButton.textContent = "Add to cart";
            }, 1000);
        }
    });
});

function showFavorites() {
    favoritesMode = true;

    products.forEach(product => {
        product.style.display = favorites.includes(product.dataset.id)
            ? ""
            : "none";
    });
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        showProducts(button.dataset.filter);
    });
});

document.querySelector("#favorites-btn").addEventListener("click", () => {
    if (favoritesMode) {
        showProducts("all");
    } else {
        showFavorites();
    }
});

document.querySelector("#cart-btn").addEventListener("click", () => {
    cartBox.classList.add("show");
});

document.querySelector("#close-cart").addEventListener("click", () => {
    cartBox.classList.remove("show");
});

cartItems.addEventListener("click", event => {
    let button = event.target.closest("button");

    if (!button) return;

    let id = button.dataset.id;

    if (button.classList.contains("remove-item")) {
        cart = cart.filter(item => item.id !== id);
    }

    if (button.dataset.action === "plus") {
        let item = cart.find(item => item.id === id);
        if (item) item.quantity++;
    }

    if (button.dataset.action === "minus") {
        let item = cart.find(item => item.id === id);

        if (item) {
            item.quantity--;

            if (item.quantity <= 0) {
                cart = cart.filter(item => item.id !== id);
            }
        }
    }

    updateCart();
});

document.querySelector("#checkout").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    alert("Checkout is not connected yet!");
});

updateCart();
updateFavorites();

let faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
    let button = item.querySelector(".faq-btn");

    button.addEventListener("click", () => {
        item.classList.toggle("active");

        button.textContent = item.classList.contains("active")
            ? "−"
            : "+";
    });
});

