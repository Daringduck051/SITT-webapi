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

    if (user == true) {
        forgotFormEmail.close();
        formForgot.reset();
        codeDialog.showModal();
    }
})

closeForm.addEventListener("click", () => {
    forgotFormEmail.close();
});

cancel.addEventListener("click", () => {
    codeDialog.close();
});

async function verifyIdentityUser(username) {

    try {
        const response = await fetch("/forgot-password", 
            { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Username: username })
            });
        
        if (response.ok) {
            const data = await response.json();
            console.log("User exists in Identity database.");
            return true;
        } else {
            console.log("User not found.");
        }
    } catch (error) {
        console.error("Connection failed:", error);
    }
}