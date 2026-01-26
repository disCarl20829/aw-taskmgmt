function toggle(id, eyeId) {
    const input = document.getElementById(id);
    const icon = document.getElementById(eyeId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('bi-eye-slash', 'bi-eye');
    } else {
        input.type = 'password';
        icon.classList.replace('bi-eye', 'bi-eye-slash');
    }
}

function comparePasswords(user_password, confirmPassword) {
    if (user_password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
}

function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : null;
}

/* ---------- SIGN ---------- */

async function signIn(event) {
    event.preventDefault();

    const user_input = document.getElementById('user_input').value;
    const user_password = document.getElementById('user_password').value;

    try {
        const res = await fetch('http://localhost:3000/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ user_input, user_password }),
        });

        const data = await res.json();

        alert("Welcome uwu")
        window.location.href = '/dashboard.html';
        console.log('Response: ', data);

        if (!data.ok) console.error('Sign-up failed:', data.message);
    } catch (err) {
        console.error('Error during sign in:', err);
    }
}

async function signUp(event) {
    event.preventDefault();

    const user_img_path = getValue('user_img_path');
    const user_email = getValue('user_email');
    const user_name = getValue('user_name');
    const user_password = getValue('user_password');
    const confirmPassword = getValue('confirm_password');

    comparePasswords(user_password, confirmPassword);

    try {
        const res = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ user_name, user_email, user_password, user_department }),
        });

        const data = await res.json();

        alert(data.message);
        window.location.href = '/dashboard.html';
        console.log('Response: ', data);

        if (!data.ok) console.error('Sign-up failed:', data.message);
        if (data.status === 201) window.location.href = '/dashboard.html';
        if (data.needsPassword === true) window.location.href = '/Sign-in.html';
    } catch (err) {
        console.error('Error during sign up:', err);
    }
}

function googleCallback() {
    window.location.href = 'http://localhost:3000/auth/google';
}

/* ---------- SETTINGS ---------- */
async function update(event) {
    event.preventDefault();

    const user_img_path = document.getElementById('user_img_path').value.trim() ?? null;
    const user_email = document.getElementById('user_email').value.trim() ?? null;
    const user_name = document.getElementById('user_name').value.trim() ?? null;
    const user_password = document.getElementById('user_password').value.trim() ?? null;

    comparePasswords(user_password, confirmPassword);

    try {
        const res = await fetch('http://localhost:3000/user/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ user_name, user_email, user_password, user_img_path }),
        });
    } catch (err) {
        console.error('Error during password set:', err);
    }
}