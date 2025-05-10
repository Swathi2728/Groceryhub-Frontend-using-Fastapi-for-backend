const passwordInput = document.getElementById("pwd1");
    const eyeIcon = document.getElementById("eye-icon");
  
    eyeIcon.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";
      passwordInput.type = isPassword ? "text" : "password";
      eyeIcon.textContent = isPassword ? "🙈" : "👁️";
    });

    


    document.getElementById("signupbtn").addEventListener("click", async (e) => {
      e.preventDefault();

      const f_name = document.getElementById("f_name").value.trim();
      const l_name = document.getElementById("l_name").value.trim();
      const email = document.getElementById("email").value.trim();
      const pwd = document.getElementById("pwd1").value;

      const msg = document.getElementById("signupmsg");
      msg.style.display = "block";

      // Simple form validation
      if (!f_name || !l_name || !email || !pwd) {
        msg.innerText = "Please fill in all fields.";
        msg.style.color = "red";
        return;
      }

      const userData = {
        firstname: f_name,
        lastname: l_name,
        email: email,
        password: pwd
      };

      try {
        const response = await fetch("http://127.0.0.1:8000/users/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(userData)
        });

        const data = await response.json();
        console.log("Response Data:", data);

        if (!response.ok) {
          msg.innerText = data.message || "Signup failed. Try again.";
          msg.style.color = "red";
          return;
        }

        // Save JWT
        if (data.token) {
          localStorage.setItem("jwt_token", data.token);
        }

        msg.innerText = data.message || "Signup successful!";
        msg.style.color = "green";

        // ✅ Delay redirect to give time to read the message
        
          window.location.href = "../index.html"; // adjust path if needed
       
      } catch (error) {
        console.error("Signup error:", error);
        msg.innerText = "An error occurred. Please try again.";
        msg.style.color = "red";
      }
    });
