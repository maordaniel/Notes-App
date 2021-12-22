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

    const [form, setForm] = useState({username: "", email: "", password: "", schoolName: ""});
    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordShown, setPasswordShown] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [schoolNameError, setSchoolNameError] = useState(false);

    //validate string
    const isEmpty = (str) => {
        return !str.trim().length;
    }

    //handle change
    const handleFormChange = e => {
        const name = e.target.name;
        const value = e.target.value;

        switch (name) {
            case "username":
                form.username = value;
                setForm({...form});
                setUsernameError(false);
                break;
            case "email":
                form.email = value;
                setForm({...form});
                setEmailError(false);
                break;
            case "password":
                form.password = value;
                setForm({...form});
                setPasswordError(false);
                break;
            case "schoolName":
                form.schoolName = value;
                setForm({...form});
                setSchoolNameError(false);
                break;
            default:
                break;
        }
    };

    //show and hide password
    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    //email validation
    const validateEmail = () => {
        const emailValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email);
        return emailValid;
    }

    //inputs validation
    const validateLogin = () => {
        let valid = true;

        //check username
        if (isEmpty(form.username)) {
            valid = false;
            setUsernameError(true);
        }

        //check email
        if (!validateEmail()) {
            valid = false;
            setEmailError(true)
        }

        //check password
        if (isEmpty(form.password)) {
            valid = false;
            setPasswordError(true);
        }

        if (isEmpty(form.schoolName)) {
            valid = false;
            setSchoolNameError(true);
        }

        return valid;
    }

    //Registration
    const Registration = async () => {
        if (validateLogin()) {
            setSubmit(true);
            const body = {
                username: form.username.trim(),
                email: form.email.trim(),
                password: form.password.trim(),
                schoolName: form.schoolName.trim()
            };

            try {
                const res = await PostData('registration', body);
                if (res.status === 201) {
                    dispatch(SetLogin({username: form.username.trim(), accessToken: res.data.accessToken}));
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
                <input type="text" name="username" className="fieldInput" value={form.username} placeholder={"Username"}
                       onChange={handleFormChange}/>
                {usernameError ? <span className="errorSpan">Username is not valid</span> : null}
            </div>
            <div className="inputWrapper">
                <input type="email" name="email" className="fieldInput" value={form.email} placeholder={"Email"}
                       onChange={handleFormChange}/>
                {emailError ? <span className="errorSpan">Email is not valid</span> : null}
            </div>
            <div className="inputWrapper">
                <div>
                    <input type={passwordShown ? "text" : "password"} name="password" className="fieldInput" value={form.password}
                           placeholder={"Password"} onChange={handleFormChange} maxLength={6}/>
                    {passwordShown ?
                        <AiOutlineEyeInvisible className="togglePassword" onClick={togglePassword}/>
                        :
                        <AiOutlineEye className="togglePassword" onClick={togglePassword}/>
                    }
                </div>
                {passwordError ? <span className="errorSpan">Password is not valid</span> : null}
            </div>
            <div className="inputWrapper">
                <input type="text" className="fieldInput" name="schoolName" value={form.schoolName}
                       placeholder={"The name of the school in your childhood"} maxLength={20}
                       onChange={handleFormChange}/>
                {schoolNameError ? <span className="errorSpan">School name is not valid</span> : null}
            </div>

            <button disabled={submit} className="styledButton" onClick={Registration}>Signup</button>
            <Link to="/login" className="haveAccountP">Do you already have an account? Sign in</Link>

            {submit ? <div className="loader"></div> : null}
        </div>
    )
}
