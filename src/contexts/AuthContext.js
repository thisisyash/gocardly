import React, { useEffect, useState, useContext } from 'react'
import {auth} from '../firebase'
import { signOut } from "firebase/auth";
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom';
import { CommonContext } from './CommonContext';
import { removeUserCache } from '../services/api';
import { Preferences } from '@capacitor/preferences';

export const AuthContext = React.createContext()

export const AuthContextProvider = (props) => {

  const [userProfileData, setUserProfileData] = useState({})
  const [cookies, setCookie, removeCookie] = useCookies(['userId'])
  const { showLoader, hideLoader, showAlert } = useContext(CommonContext)
  const [userId, setUserId] = useState(null)

  const navigate = useNavigate()

  const value = {
    logout,
    userProfileData,
    setUserProfileData,
    userLoggedIn,
    isUserLoggedIn,
    getUserId
  }

  async function userLoggedIn(userId) {
    if (!userId) return
    await Preferences.set({
      key: 'userId',
      value: userId,
    })
    setUserId(userId)
    setCookie('userId', userId, { path: '/'})
  }

  async function isUserLoggedIn() {
      const { value } = await Preferences.get({ key: 'userId' })
      if (value) {
        console.log("User ID found in cap preferences", value)
        setUserId(value)
        return true
      } else {
        console.log("User ID not found in cap preferences")
        return false
      }
  }

  function getUserId() {
    if (userId) return userId
    else logout()
  }

  async function logout() {
    showLoader()
    signOut(auth).then(async () => {
      hideLoader()
      // removeCookie('userId')
      removeUserCache()
      await Preferences.remove({ key: 'userId' })
      navigate("/auth", {replace:true})
    }).catch((error) => {
      hideLoader()
      showAlert("Failed to logout")
    })
  }

  return(
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  )
}