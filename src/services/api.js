const API_BASE_URL = process.env.REACT_APP_API_BASE;
const API_BASE = `${API_BASE_URL}/api/v1/texas`;
const API_BASE_GEO = `${API_BASE_URL}/api/v1/geo`;

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

export async function api_get_users(current_page, users_per_page, currentSort, currentSortDirection){
    try{
        const url_key = {auth: true, url: `${API_BASE}/getUsers`, method: 'POST'};
        const body = {
            users_per_page: users_per_page
            ,current_page: current_page
            ,sort_by: currentSort
            ,sort_dir: currentSortDirection
        };
        const request = await make_request(url_key, body);
        return request;
    }
    catch(exception){
        console.log('exception',exception);
        throw exception;
    }
}

export async function api_delete_user(user_id){
    try{
        const url_key = {auth: true, url: `${API_BASE}/deleteUser`, method: 'DELETE'};
        const body = {
            user_id: user_id
        };
        const request = await make_request(url_key, body);
        return request;
    }
    catch(exception){
        console.log('exception',exception);
        throw exception;
    }
}

export async function api_get_user(id){
    try{
        const url_key = {auth: true, url: `${API_BASE}/user/${id}`, method: 'GET'};
        const request = await make_request(url_key);
        return request;
    }
    catch(exception){
        console.log('exception',exception);
        throw exception;
    }
}

export async function api_get_regions(){
    try{
        const url_key = {auth: false, url: `${API_BASE_GEO}/region`, method: 'GET'};
        const request = await make_request(url_key);
        return request;
    }
    catch(exception){
        console.log('exception',exception);
        throw exception;
    }
}

export async function api_get_cities(region){
    try{
        const url_key = {auth: false, url: `${API_BASE_GEO}/city/${region}`, method: 'GET'};
        const request = await make_request(url_key);
        return request;
    }
    catch(exception){
        console.log('exception',exception);
        throw exception;
    }
}

export async function api_save_user(user){
    try{
        const url_key = {auth: true, url: `${API_BASE}/user`, method: 'POST'};
        const body = {user: user};
        const request = await make_request(url_key, body);
        return request;
    }
    catch(exception){
        console.log('exception',exception);
        throw exception;
    }
}

export async function api_search_user(query){
    try{
        const url_key = {auth: true, url: `${API_BASE}/searchUser`, method: 'POST'};
        const body = {query: query};
        const request = await make_request(url_key, body);
        return request;
    }
    catch(exception){
        console.log('exception',exception);
        throw exception;
    }
}

export function api_convert_pictures(pictures){
    const base_url = `${process.env.REACT_APP_IMAGE_SERVER_BASE}/getImage/small-picture-`;
    const pic_array = [];
    pictures.forEach(el => {
        pic_array.push({src: `${base_url}${el}`, id: el});
    });
    return pic_array;
}



export async function api_delete_picture(picture_id, user_id){
    try{
        const body = {picture_id: picture_id,user_id: user_id};
        const header = {
            method: "DELETE"
            ,headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
            },
            body: JSON.stringify(body)
        };
        const url = `${process.env.REACT_APP_IMAGE_SERVER_BASE}/deletePictureAdmin`;
        const response = await fetch(`${url}`, header);
        const data = await response.json();
        return {status: response.status, data: data};
    }
    catch(exception){
        console.log('exception',exception);
        throw exception;
    }
}

export async function api_upload_picture(file, user_id){
    try{
        const formData = new FormData();
        formData.append('picture', file);
        formData.append('user_id', user_id);
        const header = {
            method: "POST"
            ,headers: {
                "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
            },
            body: formData
        };
        const url = `${process.env.REACT_APP_IMAGE_SERVER_BASE}/uploadPictureAdmin`;
        const response = await fetch(`${url}`, header);
        const data = await response.json();
        return {status: response.status, data: data};
    }
    catch(exception){
        console.log('exception',exception);
        throw exception;
    }
}