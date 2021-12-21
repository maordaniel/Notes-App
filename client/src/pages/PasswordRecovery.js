import '../css/formStyle.css';
import React, {useState} from "react";
import {PostData} from "../services/api";
import {Link} from "react-router-dom";

export default function PasswordRecovery() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [schoolName, setSchoolName] = useState("");
    const [schoolNameError, setSchoolNameError] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [password, setPassword] = useState("");


    //validate string
    const isEmpty = (str) => {
        return !str.trim().length;
    }

    //handle email change
    const handleEmailChange = e => {
        setEmail(e.target.value);
        setEmailError(false);
    }

    //handle school name change
    const handleSchoolNameChange = e => {
        setSchoolName(e.target.value);
        setSchoolNameError(false);
    }
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
        if (isEmpty(schoolName)) {
            valid = false;
            setSchoolNameError(true);
        }

        return valid;
    }

    //login
    const passwordRecoveryAPI = async () => {
        if (validateLogin()) {
            setSubmit(true);
            const body = {email: email, schoolName: schoolName.trim()};

            try {
                const res = await PostData('recovery', body);
                if (res.status === 200) {
                    setPassword(res.data.password);
                    setSubmit(false);
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
            passwordRecoveryAPI();
    }

    return (
        <div onKeyPress={onKeyPress}>

            {password ?
                <h1 style={{textAlign: "center"}}>
                    Your password:
                    <br/>
                    {password}
                </h1>
                :
                <div className="formContainer">
                    <h1>
                        Password recovery
                    </h1>
                    <div className="inputWrapper">
                        <input type="email" className="fieldInput" value={email} placeholder={"Email"}
                               onChange={handleEmailChange}/>
                        {emailError ? <span className="errorSpan">Email is not valid</span> : null}
                    </div>
                    <div className="inputWrapper">
                        <input type="text" className="fieldInput" value={schoolName}
                               placeholder={"The name of the school in your childhood"} maxLength={20}
                               onChange={handleSchoolNameChange}/>
                        {schoolNameError ? <span className="errorSpan">school name is not valid</span> : null}
                    </div>
                    <button disabled={submit} className="styledButton" onClick={passwordRecoveryAPI}>Submit</button>
                    <Link to="/login" className="haveAccountP">Do you already have an account? Sign in</Link>
                    {submit ? <div className="loader"></div> : null}
                </div>
            }
        </div>
    )
}