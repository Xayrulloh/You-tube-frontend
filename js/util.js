const backendApi = 'http://localhost:5000'

async function requestJSON(route, method, body) {
    try {
        let response = await fetch(backendApi + route, {
            method,
            headers: {
                'Content-Type': 'application/json',
                token: window.localStorage.getItem('token')
            },
            body: body ? JSON.stringify(body): null
        })

        if (response.status == 400) {
            window.localStorage.removeItem('token')
            window.location = './index.html'
            return
        }

        if (![200, 201].includes(response.status)) {
            response = await response.json()

            console.log(response);
        }

        return await response.json()
    } catch (error) {
        console.log(error)
    }
}

function createElements(...elements) {
    return elements.map(el => document.createElement(el))
}