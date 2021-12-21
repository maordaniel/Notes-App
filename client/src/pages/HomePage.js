import React, {useEffect} from "react";
import NotesTable from "../component/NotesTable";
import AddNote from "../component/AddNote";
import {GetData} from "../services/api";
import {useDispatch} from "react-redux";
import {setNotes} from "../redux/actions/main_actions";
import {SetLogout} from "../redux/actions/auth_actions";
import {useHistory} from "react-router-dom";


export default function HomePage() {
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        getNotes();
    }, []);

    //get Notes api call
    const getNotes = () => {
        GetData('get/notes')
            .then(res => {
                if (res.status === 200) {
                    dispatch(setNotes(res.data.notes))
                } else {
                    alert("An error occurred, please try again");
                }
            })
            .catch(e => {
                if (e === undefined) {
                    alert("An error occurred, please try again");
                } else if (e.status === 401) {
                    alert("You are probably logged out, please log in again");
                    //logout

                    dispatch(SetLogout());
                    //redirect to login page
                    return history.push('/login');
                } else {
                    alert("An error occurred, please try again");
                }

            });
    };

    return (
        <div>
            <AddNote/>
            <NotesTable/>
        </div>
    )
}