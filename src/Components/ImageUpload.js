import React, {useState} from 'react'
import './ImageUpload.css'
import Button from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import {db, storage} from '../firebase'
import firebase from 'firebase'

function getModalStyle() {
    const top = 50 
    const left = 50 
    
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },

}));

function ImageUpload({username}) {

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false)
    const [caption, setCaption] = useState("")
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0);

    const handleChange = (e) =>{
        
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    };

    const handleUpload = () =>{

        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (err) =>{
                console.log(err)
                alert(err.message)
            },
            () => {
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then( url => {
                    db.collection("posts").add({
                        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption : caption,
                        imageURL: url,
                        username: username
                    });

                    setProgress(0);
                    setCaption("");
                    setImage(null);
                    setOpen(false);
                });
            }
        )

    }
    return (
        <div>

        <Modal open={open} onClose={() => setOpen(false)}>
            <div style={modalStyle} className={classes.paper}>
                <div className = "upload-div">
                    <progress value ={progress} max = "100" className = "progress-bar" />
                    <form className = "upload-form">
                        <input 
                            type = "text" 
                            placeholder = "Enter Caption" 
                            value = {caption}
                            onChange = { e => setCaption(e.target.value)} 
                            className = "input-field" 
                        />

                        
                        <input type = "file" onChange = {handleChange} className = "choose-file" />
                        <Button onClick = {handleUpload} className = "upload-btn">
                            Upload
                        </Button>
                    </form>
                </div>
            
                </div>
        </Modal>

        <Button onClick = {() => setOpen(true) } className = "header-upload-btn"> Upload </Button>
        </div>
    )
}

export default ImageUpload
