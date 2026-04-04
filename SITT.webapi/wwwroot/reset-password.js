const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const email = urlParams.get('email');

console.log("Token:", token);
console.log("Email:", email);

document.getElementById('resetForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const payload = {
        email: urlParams.get('email'),
        token: urlParams.get('token'), // This is the encoded string from the URL
        newPassword: document.getElementById('newPassword').value
    };

    try {
        const response = await fetch('/api/account/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            alert("Success! You can now login with your new password.");
            window.location.href = "/login.html"; // Redirect to login
        } else {
            alert("Error: " + (data.errors ? data.errors[0].description : data.message));
        }
    } catch (err) {
        console.error("Connection error:", err);
    }
});