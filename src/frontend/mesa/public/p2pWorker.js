let user = null
let token = null


onmessage = function(e) {
    if (e.data.message == 'user_data') {
        user = e.data.user
        token = e.data.token
    }
}
