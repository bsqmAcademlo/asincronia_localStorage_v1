const url = "https://reqres.in/api/users";
const boxEmails = document.querySelector(".box_emails");
const containerUsers = document.querySelector(".container_users");
const containerUserLogin = document.querySelector(".container_user-login");
const boxLoader = document.querySelector(".box_loader");

let userLogin = JSON.parse(localStorage.getItem("active_user"));
let users = JSON.parse(localStorage.getItem("users_storage")) || [];

if (userLogin) {
    containerUsers.style.display = "none";
    containerUserLogin.style.display = "flex";

    printUserLogin();
}

async function getUsers() {
    try {
        const data = await fetch(url);
        const res = await data.json();

        users = res.data;

        localStorage.setItem("users_storage", JSON.stringify(users));

        printUser();
    } catch (error) {
        console.log(error);
    }
}

if (!users.length) {
    getUsers();
} else {
    printUser();
}

function printUser() {
    let html = "";

    users.forEach(({ id, email }) => {
        html += `
                <div class="email" id="${id}">
                    <h3>${email}</h3>
                    <button class="btn btn_login">Iniciar sesion</button>
                </div>
            `;
    });

    boxEmails.innerHTML = html;
}

boxEmails.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn_login")) {
        const idUser = +e.target.parentElement.id;
        userLogin = users.find((user) => user.id === idUser);

        localStorage.setItem("active_user", JSON.stringify(userLogin));

        containerUsers.style.display = "none";
        containerUserLogin.style.display = "flex";

        showLoader();

        printUserLogin();
    }
});

function printUserLogin() {
    const { avatar, email, first_name, last_name } = userLogin;
    let html = `
        <button class="btn btn_logout" onclick={logoutUser()}>Logout</button>
        <div class="box_user">
            <div class="box_user-login">
                <img src="${avatar}" alt="${first_name}">
            </div>

            <h2>${first_name} ${last_name}</h2>
            <h3>${email}</h3>
        </div>
    `;

    containerUserLogin.innerHTML = html;

    const box_user = document.querySelector(".box_user");

    setTimeout(() => {
        box_user.classList.add("box_user-show");
    }, 1000);
}

function logoutUser() {
    containerUsers.style.display = "flex";
    containerUserLogin.style.display = "none";

    localStorage.removeItem("active_user");

    showLoader();
}

function showLoader() {
    boxLoader.style.display = "flex";

    setTimeout(() => {
        boxLoader.style.display = "none";
    }, 1000);
}
