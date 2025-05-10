const signIn = document.getElementById("loginbtn");

signIn.addEventListener("click", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email1").value.trim();
    const password = document.getElementById("pwd1").value.trim();

    if (!email || !password) {
        alert('Please fill in both email and password.');
        return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    console.log('Email:', email);  
    console.log('Password:', password);

    const loginPayload = {
        email: email,
        password: password
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/users/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginPayload)
        });

        console.log('Response Status:', response.status);  

        if (!response.ok) {
            const errorData = await response.json();  
            console.error('Error Response:', errorData);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Backend response:', data); 
        if (data.access_token) {  
            localStorage.setItem("authToken", data.access_token);  
            window.location.href = '../index.html';  
        } else {
            alert('Login failed. Please check your email and password.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Login Failed: ' + error.message);  
    }
});
