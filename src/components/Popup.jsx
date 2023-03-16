import React, { useContext } from 'react'
import { CommonContext } from '../contexts/CommonContext'
import Dialog from '@mui/material/Dialog';
import { Outlet } from 'react-router-dom'


function Popup() {

  const { popup, setPopup, popupComp } = useContext(CommonContext)

  const handleClose = () => {
    setPopup(false)
  }

  return (
    <>
      <Dialog open={popup} onClose={handleClose}>
        {popupComp}
      </Dialog>
      <Outlet />
    </>
  )
}

export default Popup


    