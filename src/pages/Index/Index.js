import React, {useRef, useState, useEffect} from "react";
import {api_login} from '../../services/api';
import {useNavigate} from "react-router-dom";

const Index = () => {
    const navigate = useNavigate();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        usernameRef.current.value='texas';
        passwordRef.current.value='loverino';
    }, []);

    const login = async () => {
        try{
            setErrorMessage("");
            setError(false);
            if(
                !usernameRef.current.value || !passwordRef.current.value
            ){
                setErrorMessage("Please enter username and password");
                setError(true);
                return;
            }
            const result = await api_login(usernameRef.current.value, passwordRef.current.value);
            if(result?.status !== 200 || !result?.data?.admin_token){
                setErrorMessage("Wrong username or password");
                setError(true);
                return;
            }
            localStorage.setItem("admin_token", result.data.admin_token);
            return navigate("/home");
        }
        catch(exception){
            console.log("exception",exception);
        }
    }

    return(
        <>
            <div className="bg-gradient-primary">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-10 col-lg-12 col-md-9">
                            <div className="card o-hidden border-0 shadow-lg my-5">
                                <div className="card-body p-0 login_container">
                                    <div className="row">
                                        <div className="col-lg-6 d-none d-lg-block bg-login-image_no text-center" style={{verticalAlign: 'baseline', marginTop: '10px'}}>
                                            <img alt="" src="/img/login-pic.png" className="login-pic"/>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="p-5">
                                                <div className="text-center">
                                                    <h1 className="h4 text-gray-900 mb-4">Admin Login</h1>
                                                    {
                                                        error &&
                                                        <div className="card bg-danger text-white shadow lover_alert">
                                                            <div className="card-body">
                                                                {errorMessage}
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                                <div className="user">
                                                    <div className="form-group">
                                                        <input type="text" ref={usernameRef} className="form-control form-control-user" placeholder="Username" autoComplete="new-password" />
                                                    </div>
                                                    <div className="form-group">
                                                        <input type="password" ref={passwordRef} className="form-control form-control-user" placeholder="Password" autoComplete="new-password" />
                                                    </div>
                                                    <button onClick={login} className="btn btn-primary btn-user btn-block">
                                                        Login
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Index;