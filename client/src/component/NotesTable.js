import React, {useState} from "react";
import Note from "./Note";
import '../css/tableStyle.css';
import {useDispatch, useSelector} from "react-redux";
import {setNotes} from "../redux/actions/main_actions";
import {PostData} from "../services/api";
import {SetLogout} from "../redux/actions/auth_actions";
import {useHistory} from "react-router-dom";
import ModalBox from "./ModalBox";


export default function NotesTable() {
    const history = useHistory();
    const main = useSelector(state => state.main_reducers);
    const dispatch = useDispatch();
    const [submit, setSubmit] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modal, setModal] = useState({});

    const closeModalBox = () => {
        setShowModal(false);
        setModal({});
    }

    const showModalBox = item => {
        setShowModal(true);
        setModal(item);
    }

    //delete note
    const DeleteNoteApiCall = async body => {
        try {
            const res = await PostData('delete/note', body);
            if (res.status === 200) {
                setSubmit(false);
                let NoteList = main.noteList.filter(note => body.id !== note.id)
                dispatch(setNotes(NoteList));
            } else if (res.status === 401) {
                alert("You are probably logged out, please log in again")
                dispatch(SetLogout());
            } else {
                alert(res.data);
            }
            setSubmit(false);

        } catch (e) {
            if (e === undefined) {
                alert("An error occurred, please try again");
                setSubmit(false);
            } else if (e.status === 401) {
                alert("You are probably logged out, please log in again");
                dispatch(SetLogout());
                return history.push('/login');
            } else {
                alert("An error occurred, please try again");
                setSubmit(false);
            }
        }
    };
    return (
        <div className="notes">
            {showModal ? <ModalBox closeModalBox={closeModalBox} modal={modal}/> : null}
            {main.noteList.map(item => <Note key={item.id} item={item} submit={submit}
                 showModalBox={showModalBox} deleteNote={DeleteNoteApiCall}/>)}
        </div>
    )
}