import React, {useState} from "react";
import {AiOutlineEye} from "react-icons/ai";
import {AiOutlineEyeInvisible} from "react-icons/ai";
import '../css/formStyle.css';
import {useHistory} from "react-router-dom";
import {PostData} from "../services/api";
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {SetLogin} from "../redux/actions/auth_actions";


export default function Registration() {
    const history = useHistory();
    const dispatch = useDispatch();

    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [passwordShown, setPasswordShown] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [schoolName, setSchoolName] = useState("");
    const [schoolNameError, setSchoolNameError] = useState(false);

    //validate string
    const isEmpty = (str) =>{
        return !str.trim().length;
    }

    //handle username change
    const handleUsernameChange = e => {
        setUsername(e.target.value);
        setUsernameError(false);
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

    //handle school name change
    const handleSchoolNameChange = e => {
        setSchoolName(e.target.value);
        setSchoolNameError(false);
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

        //check username
        if (isEmpty(username)) {
            valid = false;
            setUsernameError(true);
        }

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

        if (isEmpty(schoolName)){
            valid = false;
            setSchoolNameError(true);
        }

        return valid;
    }

    //Registration
    const Registration = async () => {
        if (validateLogin()) {
            setSubmit(true);
            const body = {username: username.trim(),
                email: email.trim(),
                password: password.trim(),
                schoolName: schoolName.trim()};

            try {
                const res = await PostData('registration', body);
                if (res.status === 201) {
                    dispatch(SetLogin({username: username.trim(), accessToken: res.data.accessToken}));
                    return history.push('/home');
                } else {
                    alert(res.data);
                }
                setSubmit(false);

            } catch (e) {
               if (e === undefined) {
                    alert("An error occurred, please try again");
                    setSubmit(false);
                } else if (e.status === 400) {
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
            Registration();
    }

    return (
        <div className="formContainer" onKeyPress={onKeyPress}>
            <h1>
                Registration
            </h1>
            <div className="inputWrapper">
                <input type="text" className="fieldInput" value={username} placeholder={"Username"}
                       onChange={handleUsernameChange}/>
                {usernameError ? <span className="errorSpan">Username is not valid</span> : null}
            </div>
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
             <div className="inputWrapper">
                <input type="text" className="fieldInput" value={schoolName}
                       placeholder={"The name of the school in your childhood"} maxLength={20}
                       onChange={handleSchoolNameChange}/>
                {schoolNameError ? <span className="errorSpan">School name is not valid</span> : null}
            </div>

            <button disabled={submit} className="styledButton" onClick={Registration}>Signup</button>
            <Link to="/login" className="haveAccountP">Do you already have an account? Sign in</Link>

            {submit ? <div className="loader"></div> : null}
        </div>
    )
}