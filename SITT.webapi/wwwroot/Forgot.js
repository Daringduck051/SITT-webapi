const openForgot = document.getElementById("forgotAccount");

const forgotFormEmail = document.getElementById("forgotDialog1");
const formForgot = forgotFormEmail.querySelector("form");
const closeForm = document.getElementById("emailClose");

const codeDialog = document.getElementById("forgotDialog2");
const codeForm = codeDialog.querySelector("form");
const cancel = document.getElementById("cancelCode");

openForgot.addEventListener("click", () => {
    forgotFormEmail.showModal();
});

formForgot.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("confirmEmail").value;

    const user = await verifyIdentityUser(username);

    formForgot.reset();

    if (user == true) {
        forgotFormEmail.close();
        codeDialog.showModal();
    }
})

closeForm.addEventListener("click", () => {
    forgotFormEmail.close();
    formForgot.reset();
});

cancel.addEventListener("click", () => {
    codeDialog.close();
    formForgot.reset();
});

async function verifyIdentityUser(username) {

    try {
        const response = await fetch("api/account/forgot-password", 
            { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Username: username })
            });
        
        if (response.ok) {
            const data = await response.json();
            return true;
        }
    } catch (error) {
        console.error("Connection failed:", error);
    }
}