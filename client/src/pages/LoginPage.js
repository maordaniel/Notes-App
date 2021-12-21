import React, {useState} from "react";
import '../css/formStyle.css';
import {AiOutlineEye} from "react-icons/ai";
import {AiOutlineEyeInvisible} from "react-icons/ai";
import {useHistory} from "react-router-dom";
import {PostData} from "../services/api";
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {SetLogin} from "../redux/actions/auth_actions";


export default function LoginPage() {
    const history = useHistory();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [passwordShown, setPasswordShown] = useState(false);
    const [submit, setSubmit] = useState(false);

    //validate string
    const isEmpty = (str) =>{
        return !str.trim().length;
    }

    //handle email change
    const handleEmailChange = e => {
        setEmail(e.target.value);
        setEmailError(false);
    }

    //handle password change
    const handlePasswordChange = e => {
        setPassword(e.target.value);
        setPasswordError(false);
    }

    //show and hide password
    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    //email validation
    const validateEmail = () => {
        const emailValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
        return emailValid;
    }

    //inputs validation
    const validateLogin = () => {
        let valid = true;

        //check email
        if (!validateEmail()) {
            valid = false;
            setEmailError(true)
        }

        //check password
        if (isEmpty(password)) {
            valid = false;
            setPasswordError(true);
        }

        return valid;
    }

    //login
    const login = async () => {
        if (validateLogin()) {
            setSubmit(true);
            const body = {email: email, password: password.trim()};

            try {
                const res = await PostData('login', body);
                if (res.status === 200) {
                    //set first letter uppercase
                    const username = res.data.username.charAt(0).toUpperCase() + res.data.username.slice(1);
                    //dispatch login
                    dispatch(SetLogin({username: username, accessToken: res.data.accessToken}));
                    //redirect home page
                    return history.push('/home');
                } else {
                    alert(res.data.message);
                    setSubmit(false);
                }

            } catch (e) {
                if (e === undefined) {
                    alert("An error occurred, please try again");
                    setSubmit(false);
                } else if (e.status === 404) {
                    alert(e.data.message);
                    setSubmit(false);
                } else {
                    alert("An error occurred, please try again");
                    setSubmit(false);
                }
            }
        }
    };

    //on press Enter
    const onKeyPress = (e) => {
        if (e.which === 13)
            login();
    }
    return (
        <div className="formContainer" onKeyPress={onKeyPress}>
            <h1>
                Login
            </h1>
            <div className="inputWrapper">
                <input type="email" className="fieldInput" value={email} placeholder={"Email"}
                       onChange={handleEmailChange}/>
                {emailError ? <span className="errorSpan">Email is not valid</span> : null}
            </div>
            <div className="inputWrapper">
                <div>
                    <input type={passwordShown ? "text" : "password"} className="fieldInput" value={password}
                           placeholder={"Password"} onChange={handlePasswordChange} maxLength={6}/>
                    {passwordShown ?
                        <AiOutlineEyeInvisible className="togglePassword" onClick={togglePassword}/>
                        :
                        <AiOutlineEye className="togglePassword" onClick={togglePassword}/>
                    }
                </div>
                {passwordError ? <span className="errorSpan">Password is not valid</span> : null}
            </div>
            <button disabled={submit} className="styledButton" onClick={login}>Login</button>
            <Link to="/registration" className="haveAccountP">Don't have an account yet? Sign Up</Link>
            <Link to="/recovery" className="haveAccountP">Forgot your password? Click here</Link>
            {submit ? <div className="loader"></div> : null}
        </div>
    )
}