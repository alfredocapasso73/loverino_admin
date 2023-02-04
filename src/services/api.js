const API_BASE = "http://localhost:8081/api/v1/texas";

const header = {
    method: "GET"
    ,headers: {
        "Content-Type": "application/json"
    }
};

export async function make_request(url_key, body = undefined){
    try{
        if(url_key.auth && !localStorage.getItem("admin_token")){
            throw Object.assign(new Error('missing_token_for_auth_request'),{ code: 401 });
        }
        if(url_key.method === 'POST' && !body){
            throw Object.assign(new Error('missing_body_for_request'),{ code: 400 });
        }
        const url = url_key.url;
        header.method = url_key.method;
        if(url_key.auth){
            header.headers['Authorization'] = `Bearer ${localStorage.getItem("admin_token")}`;
        }
        if(url_key.method !== 'GET'){
            header.body = JSON.stringify(body);
        }
        else{
            delete header.body;
        }
        const response = await fetch(`${url}`, header);

        const data = await response.json();
        return {status: response.status, data: data};
    }
    catch(exception){
        console.log('exception:',exception);
        throw exception;
    }
}

export async function api_login(username, password){
    try{
        const url_key = {auth: false, url: `${API_BASE}/signin`, method: 'POST'};
        const body = {username: username, password: password};
        const request = await make_request(url_key, body);
        return request;
    }
    catch(exception){
        console.log('exception',exception);
        throw exception;
    }
}

export async function api_get_users(current_page, users_per_page){
    try{
        const url_key = {auth: true, url: `${API_BASE}/getUsers`, method: 'POST'};
        const body = {
            users_per_page: users_per_page
            ,current_page: current_page
        };
        const request = await make_request(url_key, body);
        return request;
    }
    catch(exception){
        console.log('exception',exception);
        throw exception;
    }
}