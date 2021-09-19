import React, {useState, useEffect} from 'react'
import './App.css';
import Cards from './Components/Cards';
import Header from './Components/Header';
import {db,auth} from './firebase' 
import Signup from './Components/Signup';
import ImageUpload from './Components/ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function App() {
  
  
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

      useEffect(() => {
        const unsubscribe =  auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                // user is logged in...
                
                setUser(authUser);
              
            } else {
                setUser(null);
                setPosts([]);
            }
        });
        
        return () => {
            unsubscribe();
        };
    }, [user])

  useEffect(() => {
    if(user){
    db.collection('posts').orderBy("timeStamp", 'desc').onSnapshot( (snapshot) =>{
      setPosts(snapshot.docs.map( doc => {
        return {
          id : doc.id,
          post: doc.data()
        }
      }))
    })
  }
  else{
    setPosts([]);
  }
  }, [user]) 

  
  return (
    <div className="App">
      
        <Header user = {user}/>
        <Signup />
        {user?.displayName ? 
        <ImageUpload username = {user.displayName} />  :
        ""
        }

        <div>
          <InstagramEmbed
          url='https://www.instagram.com/p/CQOgBS-HTRV/'
          clientAccessToken='123|456'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
          />
        </div>
        
     
            {
              posts.map(({id ,post}) =>{
                return(
                  <Cards 
                  key = {id} 
                  postID = {id} 
                  name = {post.username} 
                  imageURL = {post.imageURL} 
                  caption = {post.caption} 
                  user = {user}
                  />
                )
              })
           }
        
    </div>
    
  );
}

export default App;
