import React from 'react'
import './Header.css'
import {RiMessengerLine} from 'react-icons/ri';
import {HiHome} from 'react-icons/hi';
import {AiOutlineHeart} from 'react-icons/ai';


function Header({user}) {
    return (
        <div className = "header">
            <div className = "header-div">
                <img
                className="header-image"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
              {user?
                <>
                    <form>
                    <input type ="text" placeholder = {`Search`} className = "searchBar"/>
                    </form>
                    <div className = "header-icons">
                        <HiHome className = "icon"/>
                        <RiMessengerLine className = "icon"/>
                        <AiOutlineHeart className= "icon"/>
                    </div>
                
                </>
              : 
              ''
              }
            
            </div>
            
             
            
        </div>
    )
}

export default Header
