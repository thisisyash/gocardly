import React, { createContext, useState } from 'react'

export const CommonContext = createContext()

export const CommonProvider = (props) => {

  const [alert, setAlert] = useState(false)
  const [alertText, setAlertText] = useState('')

  const [popup, setPopup] = useState(false)
  const [popupComp, setPopupComp] = useState(null)

  const [loader, setLoader] = useState(false)
  const [loadingText, setLoadingText] = useState('Loading...')

  const [snackbar, setSnackbar] =  useState(false)
  const [snackbarText, setSnackbarText] = useState('')
  const [snackbarType, setSnackbarType] = useState('success')

  const showLoader = (loadingText) => {
    setLoadingText(loadingText)
    setLoader(true)
  }
  const hideLoader = () => {
    setLoader(false)
    setLoadingText('Loading...')
  }

  const showAlert = (alertText) => {
    setAlertText(alertText)
    setAlert(true)
  }

  const hideAlert = () => {
    setAlert(false)
    setAlertText(null)
  }

  const showPopup = (alertComp) => {
    setPopupComp(alertComp)
    setPopup(true)
  }

  const hidePopup = () => {
    setPopup(false)
    setPopupComp(null)
  }

  const showSnackbar = (snackbarText, type) => {
    setSnackbarText(snackbarText)
    setSnackbarType(type)
    setSnackbar(true)
  }

  const hideSnackbar = () => {
    setSnackbar(false)
    setSnackbarText(null)
    setSnackbarType('success')
  }

  const value = {
    showLoader,
    hideLoader,
    showAlert,
    hideAlert,
    setAlert,
    showPopup,
    hidePopup,
    setPopup,
    popupComp,
    setPopupComp,
    loader,
    loadingText,
    alert,
    alertText,
    popup,
    snackbar,
    snackbarText,
    showSnackbar,
    hideSnackbar,
    snackbarType,
    setSnackbarType
  }

  return <CommonContext.Provider value={value}> {props.children} </CommonContext.Provider>
}
