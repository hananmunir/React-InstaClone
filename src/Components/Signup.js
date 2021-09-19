import { Button } from '@material-ui/core'
import React, {useState, useEffect} from 'react'
import { auth, provider, firebaseApp} from "../firebase";
import {makeStyles} from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import './Signup.css'

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

function Signup() {
    
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [username, setUsername] = useState('');
    const [email, setEmail] =  useState('');
    const [password, setPassword] = useState('');
    const [passRep, setPassRep] = useState('');
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loginOpen, setLoginOpen] = useState(false);
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                // user is logged in...
                
                setUser(authUser);
                
                console.log("Authenticated user is", authUser)
                console.log("User is", user)
                
                
                if (authUser.displayName) {
                    // dont update username
                } else {
                    return authUser.updateProfile({
                        displayName: username,
                    });
                }
            } else {
                setUser(null);
            }
        });
        
        return () => {
            unsubscribe();
        };
    }, [user, username])
    
    const handleRegister = (e)=> {
        e.preventDefault();
        if(password === passRep){
            auth
            .createUserWithEmailAndPassword(email,passRep)
            .catch((err) => alert(err.message))
            
            console.log("User Created")
            setOpen(false)
        }
        else{
            alert("Password doesnot match")
        }
    }
    const handleGoogle = () =>{
        
        console.log("here")
        firebaseApp.auth()
        .signInWithPopup(provider)
        .then((result) => {
    
        const token = result.credential.accessToken;
        const user = result.user;
        const data = {
          storetoken : token,
          username : user.displayName,
          email: user.email,
          imageurl : user.photoURL
        }
        localStorage.setItem("user",JSON.stringify(data))
        console.log("User Signed In")
      }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        console.log(error)
      });
    }
    const handleLogin =(e) =>{
        e.preventDefault();
        auth
        .signInWithEmailAndPassword(email,password)
        .catch( err => alert(err.message))

        setLoginOpen(false)
    }
    
    
    
   
    
    
    return (
        <div>
        <Modal open={loginOpen} onClose={() => setLoginOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
            <form >
            <div className ="container">
            <h1>Sign in</h1>
            
            <hr/>
            
            <label for="email"><b>Email</b></label>
            <input
            type="email" 
            placeholder="Enter Email" 
            value = {email}
            onChange = { (e) => setEmail(e.target.value)}
            required
            />
        <label for="psw"><b>Password</b></label>
        <input 
        type="password" 
        placeholder="Enter Password" 
        value = {password}
        onChange = { e => setPassword(e.target.value)}
        required
        />
        
        <center>
        <Button className = "signup-button" onClick = {handleLogin} >SignIn</Button>
        <Button className = "cancel-button" onClick = {() => setLoginOpen(false)} >Cancel</Button>
        </center>
        
        </div>
        </form>
        </div>
        </Modal>
        
        <Modal
        open={open}
        onClose={() => setOpen(false)}
        >
        <div style={modalStyle} className={classes.paper}>
        <center>
        <img
        className="header-image"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt=""
        />
        </center>
        <form >
        <div className ="container">
        <h1>Sign Up</h1>
        <p>Please fill in this form to create an account.</p>
        <hr/>
        
        <label for="email"><b>Email</b></label>
        <input
        type="email" 
        placeholder="Enter Email" 
        value = {email}
        onChange = { (e) => setEmail(e.target.value)}
        required
        />
        
        <label for="username"><b>UserName</b></label>
        <input 
        type="text" 
        placeholder="Enter UserName" 
        value = {username}
        onChange = {(e) => setUsername(e.target.value)}
        required
        />
        
        
        <label for="psw"><b>Password</b></label>
        <input 
        type="password" 
        placeholder="Enter Password" 
        value = {password}
        onChange = { e => setPassword(e.target.value)}
        required
        />
        
        <label for="psw-repeat"><b>Repeat Password</b></label>
        <input 
        type="password" 
        placeholder="Repeat Password" 
        value = {passRep} 
        onChange = { e => { setPassRep(e.target.value) }}
        required
        />
        
        <center>
        <Button className = "signup-button" onClick = {handleRegister} >Register</Button>
        <Button className = "cancel-button" onClick = {() => setOpen(false)} >Cancel</Button>
        </center>
        
        </div>
        </form>
        </div>
        </Modal>
        {user?.displayName ? (
          <div >
            <button onClick={() => auth.signOut()} className = "logout-button">LOGOUT</button>
          </div>
        ) : (
          <form >
            <div className = "landing-page">
                <Button onClick={() => setLoginOpen(true)}>Sign IN</Button>
                <Button onClick={() => setOpen(true)}>Sign Up</Button>
                <Button onClick = {handleGoogle}>Sign UP with Google</Button>
            </div>
            
          </form>
        )}
        
        
        </div>
        )
    }
    
    export default Signup
    