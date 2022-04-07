async function reg() {
    let formData = new FormData();
    formData.append('username', usernameInput.value)
    formData.append('password', passwordInput.value)
    formData.append('img', uploadInput.files[0])
    
    let response = await fetch(backendApi + '/register', {
        method: 'POST',
        body: formData
    })

    let result = await response.json();
    if (result.status === 400) {usernameInput.value = null; passwordInput.value = null; return alert(result.message);}

    window.localStorage.setItem('token', result.token);
    window.location = '/You-tube-frontend/index.html'
}

showButton.onclick = () => {
    passwordInput.type = passwordInput.type === 'password' ? "text": "password"
}


