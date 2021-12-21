import {Link, useHistory} from "react-router-dom";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GetData} from "../services/api";
import {SetLogout} from "../redux/actions/auth_actions";
import '../css/NavbarStyle.css';
import {setNotes} from "../redux/actions/main_actions";


export default function NavBar() {
    const auth = useSelector(state => state.auth_reducers);
    const dispatch = useDispatch();
    const history = useHistory();

    //logout
    const logout = async () => {
        try {
            const res = await GetData('logout');
            if (res.status === 200) {
                dispatch(setNotes([])); //reset notes
                dispatch(SetLogout());
                return history.push('/login'); //redirect to login page
            } else {
                alert(res.data);
            }
        } catch (e) {
            alert("An error occurred, please try again");
        }
    };

    if (auth.isLogged) {
        return (
            <ul className="navbarContainer">
                <li className="navbarWrapper">
                    <span className="usernameWrapper">Hi {auth.username} !</span>
                </li>
                <li className="navbarWrapper">
                    <Link className="LinkToWrapper" to='/home'>HomePage</Link>
                </li>
                <li className="navbarWrapper">
                    <span className="LinkToWrapperLogout" onClick={logout}>Logout</span>
                </li>
            </ul>
        )
    } else {
        return (
            <ul className="navbarContainer">
                <li className="navbarWrapper">
                    <Link className="LinkToWrapper" to='/login'>Sign in</Link>
                </li>
                <li className="navbarWrapper">
                    <Link className="LinkToWrapper" to='/registration'>Sign up</Link>
                </li>
            </ul>
        )
    }

}