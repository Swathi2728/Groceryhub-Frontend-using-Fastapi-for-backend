
// async function updateUserProfile() {
//     const profile = {
//         first_name: document.getElementById('first-name').value,
//         last_name: document.getElementById('last-name').value,
//         email: document.getElementById('email').value,
//     };

//     try {
//         const response = await fetch("http://127.0.0.1:8000/user/profile", {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify(profile),
//         });

//         if (!response.ok) throw new Error("Update failed");

//         const data = await response.json();
//         alert(data.message || "Profile updated");
//     } catch (err) {
//         console.error(err);
//         alert("Error updating profile");
//     }
// }


const token = localStorage.getItem("authToken");

async function loadUserProfile() {
    // ✅ Check if token exists first
    if (!token) {
        alert("Please log in to view your profile.");
        window.location.href = "../html/login.html";  // Adjust the path as needed
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/users/auth/profile", {
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
        localStorage.removeItem("authToken"); // Optional: clear invalid token
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
