const agentDialog = document.getElementById("agentDialog");
const agentConfirm = agentDialog ? agentDialog.querySelector("form") : null;
const newAgent = document.getElementById("createAccount");

const agentCreate = document.getElementById("createAgent");
const createForm = agentCreate ? agentCreate.querySelector("form") : null;
const loginAgent = document.getElementById("agentLogin");

const signInPass = document.getElementById("showPass");
const createPass = document.getElementById("showPassword");
const validatePass = document.getElementById("revealPass");

if (createForm) {

loginAgent.addEventListener("click", (e) => {
    e.preventDefault();
    createForm.reset();
    window.location.href = "Login.html";
});

agentCreate.addEventListener("input", (e) => {
    e.preventDefault();

    const password = document.getElementById("createPass").value;
    const passValid = document.getElementById("confirmPass").value;
    const errorMes1 = document.getElementById("passNotValid");
    const errorMes2 = document.getElementById("createError");
    const userError = document.getElementById("userNotValid");

    userError.hidden = true;
    
    if (checkPassword(password) === false) {
        errorMes1.hidden = false;
    }
    if (checkPassword(password) === true) {
        errorMes1.hidden = true;
    }
    if (password != passValid) {
        errorMes2.hidden = false;
    }
    if (checkPassword(password) === true && password === passValid) {
        errorMes1.hidden = true;
        errorMes2.hidden = true;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const createAgentForm = document.getElementById("createForm");

    if (createAgentForm) {
        createAgentForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const password = document.getElementById("createPass").value;
            const passValid = document.getElementById("confirmPass").value;
            const userError = document.getElementById("userNotValid");

            if (checkPassword(password) && password === passValid) {
                const registrationSuccess = await registerUser();

                if (registrationSuccess) {
                    window.location.href = "Login.html";
                } else {
                    userError.hidden = false;
                    createForm.reset();
                }
            }
        });
    }
});

async function registerUser() {
    const loginName = document.getElementById("agentIds").value;
    const loginPassword = document.getElementById("createPass").value;
    const email = document.getElementById('agentEmail').value;
    const payload = {
        Username: loginName,
        Password: loginPassword,
        Email: email
    };

        const response = await fetch("api/account/register", {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify(payload)
        });
    return response.ok;
};
}

if (agentConfirm) {
newAgent.addEventListener("click", (e) => {
    e.preventDefault();
    agentConfirm.reset();
    window.location.href = "Register.html";
});

document.addEventListener('DOMContentLoaded', () => {
    const agentConfirmForm = document.getElementById("agentConfirm");

    if (agentConfirmForm) {
        agentConfirmForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById('agentId').value;
            const password = document.getElementById('agentPass').value;
            const errorMessage = document.getElementById('loginError');

            const success = await loginUser(username, password);

            if (success) {
                errorMessage.hidden = true;
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("currentUser", username);
                window.location.href = "Webpage.html";
            } else {
                errorMessage.hidden = false;
                agentConfirmForm.reset();
            }
        });
    }
});

async function loginUser(username, password, email) {
    try {
    const response = await fetch("api/account/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username: username, Password: password })
    });
    
    switch (response.status) {
        case 200:
            return true;
        case 401:
            return false;
        case 404:
            return false;
        default:
            console.log("Something went wrong: " + response.status);
            break;
    }
}
    catch (error) {
        console.log("Error: " + error);
        return false;
}
}
}

function checkPassword(password) {
    if (password.length < 8) {
        return false;
    }
    if (!/[a-z]/.test(password)) {
        return false;
    }
    if (!/[A-Z]/.test(password)) {
        return false;
    }
    if (!/[0-9]/.test(password)) {
        return false;
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
        return false;
    }

    return true;
};

if (signInPass) {
    signInPass.addEventListener("mousedown", () => {
        document.getElementById("agentPass").setAttribute("type", "text");
    });
    signInPass.addEventListener("mouseup", () => {
        document.getElementById("agentPass").setAttribute("type", "password");
    });
}

if (createPass) {
    createPass.addEventListener("mousedown", () => {
        document.getElementById("createPass").setAttribute("type", "text");
    });
    createPass.addEventListener("mouseup", () => {
        document.getElementById("createPass").setAttribute("type", "password");
    });
}

if (validatePass) {
    validatePass.addEventListener("mousedown", () => {
        document.getElementById("confirmPass").setAttribute("type", "text");
    });
    validatePass.addEventListener("mouseup", () => {
        document.getElementById("confirmPass").setAttribute("type", "password");
    });
}