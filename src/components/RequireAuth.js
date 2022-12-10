import React, { useContext, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import {browserHistory} from 'react-router'
import BottomNavBar from './BottomNavBar'
import { AuthContext } from '../contexts/AuthContext'

const styles = {
  outletCont : {
    height:'93vh',
    overflowY:'scroll'
  }
}
function RequireAuth({props}) {

  const {isUserLoggedIn} = useContext(AuthContext)

  if (isUserLoggedIn()) return <><div><div style={styles.outletCont}><Outlet /></div><div><BottomNavBar /></div> </div></> 
  return  <Navigate to="/auth" replace="true"/>
}

export default RequireAuth
