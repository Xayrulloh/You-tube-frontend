let logged = false, lastUpdate = ''

setInterval(() => {
    checkUser()
    renderData()
}, 2000);

async function renderData() {
    let data = await requestJSON('/info', 'GET')
    if (JSON.stringify(lastUpdate) != JSON.stringify(data)) {
        lastUpdate = data

        users.innerHTML = `<h1>YouTube Members</h1>
        <li class="channel active" id="channel" userId="main">
        <a>
        <svg viewbox="0 0 24 24" focusable="false" style="pointer-events: none; display: block; width: 30px; height: 30px;"><g><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8" class="style-scope yt-icon"></path></g></svg>
        <span>Home</span>
        </a>`
    
        if (data.users.length) {
            for (let user of data.users) {
                users.innerHTML += `<li class="channel" id="channel" userId=${user.userId}>
                <a>
                <img src="${backendApi+'/'+user.img}" alt="channel-icon" width="30px" height="30px">
                <span>${user.username}</span>
                </a>
                </li>`
            }
    
            for (let chanel of channel) {
                chanel.onclick = async() => {
                    if (chanel.getAttribute('userId') == 'main' && chanel.getAttribute('class').split(' ').length == 1) {
                        for (let chanel of channel) chanel.classList.remove('active')
                        chanel.classList.add('active')
                        
                        await renderVideo()
                        
                    } else if (chanel.getAttribute('userId') != 'main') {
                        for (let chanel of channel) chanel.classList.remove('active')
                        chanel.classList.add('active')
                        
                        await renderVideo(+chanel.getAttribute('userId'))
                    }
                }
            }
        }
        
        if (data.videos.length) {
            videos.innerHTML = null
            await renderVideo()
        }
    }

}

searchBox.onkeyup = (e) => {
    if (e.keyCode === 13) return textSearch(searchBox.value)
    if (searchBox.value) return showExamples(searchBox.value)
}

async function showExamples(value) {
    datalist.innerHTML = null
    
    let data = await requestJSON('/info', 'GET')
    
    if (data.videos.length) {
        for (let video of data.videos) {
            if (video.videoname.includes(value)) {
                datalist.innerHTML += `<option value="${video.videoname}">`
            }
        }
    }
}

async function textSearch(value) {
    if (!value) return
    
    if (channel.length) {
        for (let chanel of channel) chanel.classList.remove('active')
    }
    
    await renderVideo(value)
}

async function renderVideo(value = null) {
    videos.innerHTML = null
    
    let data = await requestJSON('/info', 'GET')
    
    if (!value) {
        for (let video of data.videos) {
            videos.innerHTML += `<li class="iframe">
            <video src="${backendApi+'/'+video.videoNameFile}" controls=""></video>
            <div class="iframe-footer">
            <img src="${backendApi+'/'+video.userImg}" alt="channel-icon">
            <div class="iframe-footer-text">
            <h2 class="channel-name">${video.username}</h2>
            <h3 class="iframe-title">${video.videoname}</h3>
            <time class="uploaded-time">${video.date}</time>
            <a class="download" href="${backendApi+'/'+video.videoNameFile}" download="${backendApi+'/'+video.videoNameFile}">
            <span>${video.size} MB</span>
            <img src="./img/download.png">
            </a>
            </div>                  
            </div>
            </li>`
        }  
    }
    
    else if (!isNaN(+value) && value) {
        for (let video of data.videos) {
            if (value == video.userId) {
                videos.innerHTML += `<li class="iframe">
                <video src="${backendApi+'/'+video.videoNameFile}" controls=""></video>
                <div class="iframe-footer">
                <img src="${backendApi+'/'+video.userImg}" alt="channel-icon">
                <div class="iframe-footer-text">
                <h2 class="channel-name">${video.username}</h2>
                <h3 class="iframe-title">${video.videoname}</h3>
                <time class="uploaded-time">${video.date}</time>
                <a class="download" href="${backendApi+'/'+video.videoNameFile}" download="${backendApi+'/'+video.videoNameFile}">
                <span>${video.size} MB</span>
                <img src="./img/download.png">
                </a>
                </div>                  
                </div>
                </li>`
            }
        }
    }
    
    else if (typeof value === 'string') {
        for (let video of data.videos) {
            if (video.videoname.includes(value)) {
                videos.innerHTML += `<li class="iframe">
                <video src="${backendApi+'/'+video.videoNameFile}" controls=""></video>
                <div class="iframe-footer">
                <img src="${backendApi+'/'+video.userImg}" alt="channel-icon">
                <div class="iframe-footer-text">
                <h2 class="channel-name">${video.username}</h2>
                <h3 class="iframe-title">${video.videoname}</h3>
                <time class="uploaded-time">${video.date}</time>
                <a class="download" href="${backendApi+'/'+video.videoNameFile}" download="${backendApi+'/'+video.videoNameFile}">
                <span>${video.size} MB</span>
                <img src="./img/download.png">
                </a>
                </div>                  
                </div>
                </li>`
            }
        }
    }
}

async function voiceSearch() {
    if (channel.length) {
        for (let chanel of channel) chanel.classList.remove('active')
    }
    
    const voice = new webkitSpeechRecognition()
    
    voice.lang = 'en-EN'
    voice.continious = false
    
    voice.onresult = async event => {
        searchBox.value = event.results[0][0].transcript
        
        await renderVideo(searchBox.value)
    }
    voice.start()
}

async function checkUser() {
    const token = window.localStorage.getItem('token')

    if (token) {
        let data = await requestJSON('/checkToken', 'POST', {token})

        if (data.status === 200) {
            logged = true
            userImg.innerHTML = `<img class="avatar-img" src="${backendApi+'/'+data.img}" alt="avatar-img" width="32px" height="32px">`

        } else {logged = false; userImg.innerHTML = `<img class="avatar-img" src="./img/avatar.jpg" alt="avatar-img" width="32px" height="32px">`}
    } else userImg.innerHTML = `<img class="avatar-img" src="./img/avatar.jpg" alt="avatar-img" width="32px" height="32px">`
}

function adminPanel() {
    return logged ? window.location = '/You-tube-frontend/admin.html' : window.location = '/You-tube-frontend/register.html';
}

