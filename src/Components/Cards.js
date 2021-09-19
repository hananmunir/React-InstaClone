import React,{useState, useEffect} from 'react'
import {db} from '../firebase'
import './Cards.css'
import firebase from 'firebase'
import Avatar from "@material-ui/core/Avatar"

function Cards({postID, name, imageURL, caption, user}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    useEffect( () => {
        let unsubscribe;
        if(postID) {
            unsubscribe = db
            .collection("posts")
            .doc(postID)
            .collection("comments")
            .orderBy("timeStamp", 'desc')
            .onSnapshot( snapshot =>{
                setComments(snapshot.docs.map( doc => doc.data() ))
            })
        }

        return() => {
            unsubscribe();
        }
    }, [postID])

    const postComment = (e)=>{
        e.preventDefault();
        db.collection("posts").doc(postID).collection("comments").add({
        text: comment,
        username: user.displayName,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      setComment("");
    }
    return (
        <div className = "cards-div">
            <div className = "post-header">
                <Avatar
                    className = "post-header-img"
                    src = "data:image/jpeg;base64,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"
                    alt = {name}
                
                />
                <h4>{name}</h4>
            </div>
         
            
            <img
                className = "post-img"
                src = {imageURL}
                alt = {name}
            />
            <div className = "post-icons">

            </div>
            <div className = "post-footer">
                <p ><strong>{name} </strong> {caption} </p>
            </div>
            {comments.length > 0 ? 
                <div className = "post-comments">
               { comments.map((comment) => (
                        <div className = "comment">
                            <p>
                                <span className = "username">{comment.username}</span>       {comment.text}
                            </p>
                        </div>
                        
                    
                ))}
            </div> :
            ''
            }
            
           
            <form className = "post-commentbox" >
                <input
                type = "text"
                value = {comment}
                onChange = {(e) => setComment(e.target.value)}
                placeholder = "Add a Comment..."
                className = "post-input"
                />
                <button onClick = {postComment} className = "post-btn">
                    Post
                </button>

            </form>
            
        </div>
    )
}

export default Cards
