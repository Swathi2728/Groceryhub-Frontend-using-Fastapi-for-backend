


const token = localStorage.getItem("authToken");
const BASE_URL = 'https://groceryhub-backend-2.onrender.com';


async function loadUserProfile() {
    if (!token) {
        alert("Please log in to view your profile.");
        window.location.href = "../html/login.html";  
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/users/auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error("Failed to load profile");

        const data = await response.json();
        console.log(data);

        document.getElementById('first-name').value = data.firstname;
        document.getElementById('last-name').value = data.lastname;
        document.getElementById('email').value = data.email;

    } catch (err) {
        console.error(err);
        alert("Error loading profile. Please log in again.");
        localStorage.removeItem("authToken"); 
        window.location.href = "../html/login.html";
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadUserProfile();

    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            localStorage.removeItem('authToken');
            window.location.href = '../html/login.html';
        });
    }
});
