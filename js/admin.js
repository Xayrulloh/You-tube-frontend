let lastUpdate = ''

setInterval(() => {
    checkUser()
    ownVideo()
}, 2000);

function logOut() {
    window.localStorage.removeItem('token')
    window.location = '/You-tube-frontend/index.html'
}

async function checkUser() {
    const token = window.localStorage.getItem('token')
    
    if (token) {
        let data = await requestJSON('/checkToken', 'POST', {token})
        
        if (data.status === 400) {
            window.localStorage.removeItem('token')
            window.location = '/You-tube-frontend/index.html'
        }
    } else {
        window.location = '/You-tube-frontend/index.html'
    }
}

async function sendVideo() {
    const token = window.localStorage.getItem('token')
    
    let formData = new FormData();
    formData.append('videoname', videoInput.value)
    formData.append('token', token)
    formData.append('video', uploadInput.files[0])
    
    let response = await fetch(backendApi + '/upload', {
        method: 'POST',
        body: formData
    })
    
    let result = await response.json();
    
    if (result.status === 400) {videoInput.value = null; return alert(result.message);}
}

async function ownVideo() {
    const token = window.localStorage.getItem('token')
    
    let data = await requestJSON('/ownVideo', 'POST', {token})

    if (data.status === 400) {return alert(data.message);}
    
    if(JSON.stringify(lastUpdate) != JSON.stringify(data)) {
        lastUpdate = data

        videosBoard.innerHTML = null
        for (let video of data.video) {
            videosBoard.innerHTML += `<li class="video-item">
            <video src="${backendApi+'/'+video.videoNameFile}" controls=""></video>
            <p class="content" videoId="${video.videoId}" contenteditable="true" onkeyup="changeVideoName(this)">${video.videoname}</p>
            <img src="./img/delete.png" width="25px" alt="upload" class="delete-icon" onclick="deleteVideo(this)" videoId="${video.videoId}">
            </li>`
        }
    }

    
}

async function deleteVideo(value) {
    const token = window.localStorage.getItem('token')

    let data = await requestJSON('/delete', 'DELETE', {token, "videoId":value.getAttribute('videoId')})

    if (data.status === 400) {return alert(data.message);}
}

async function changeVideoName(value) {
    const token = window.localStorage.getItem('token')

    let data = await requestJSON('/change', 'POST', {token, "videoId":value.getAttribute('videoId'), "value":value.textContent})

    if (data.status === 400) {return alert(data.message);}
}

