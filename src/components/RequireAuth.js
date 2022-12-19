import React, { useContext, useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import {browserHistory} from 'react-router'
import BottomNavBar from './BottomNavBar'
import { AuthContext } from '../contexts/AuthContext'
import { CommonContext } from '../contexts/CommonContext'
import ComponentLoader from './ComponentLoader'

const styles = {
  outletCont : {
    height:'93vh',
    overflowY:'scroll'
  }
}
function RequireAuth({props}) {

  const [login, setLogin] = useState(null)
  const {isUserLoggedIn} = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)

  useEffect(() => {
    showLoader()
    async function checkLogin() {
      console.log("Check login in require auth")
      const resp = await isUserLoggedIn()
      console.log("Response from is user login : ", resp)
      setLogin(resp)
      setLoading(false)
      hideLoader()
    }
    checkLogin()
  }, [login])

  console.log("===Require Auth===", login)
  return (
    <>
      {
        loading ?
        <>
          <ComponentLoader />
        </> :
        <>
          {
            login ?
            <><div><div style={styles.outletCont}><Outlet /></div><div><BottomNavBar /></div> </div></> :
            <Navigate to="/auth" replace="true"/>
          }
        </>
      }
    </>
  )
}

export default RequireAuth
