showButton.onclick = () => {
    passwordInput.type = passwordInput.type === 'password' ? "text": "password"
}


async function login() {
    let username = usernameInput.value.trim()
    let password = passwordInput.value.trim()

    let response = await requestJSON('/login', 'POST', {
        username,
        password
    })

    if (response.status === 400) {usernameInput.value = null; passwordInput.value = null; return alert(response.message);}

    window.localStorage.setItem('token', response.token);
    window.location = 'https://you-tube-frontend.netlify.app/index.html'
}