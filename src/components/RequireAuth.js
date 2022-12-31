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
      const resp = await isUserLoggedIn()
      setLogin(resp)
      setLoading(false)
      hideLoader()
    }
    checkLogin()
  }, [login])

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
