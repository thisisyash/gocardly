import { Capacitor } from '@capacitor/core'
import { Directory } from '@capacitor/filesystem'
import { Button, Box } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import ComponentLoader from '../components/ComponentLoader'
import { AuthContext } from '../contexts/AuthContext'
import { CommonContext } from '../contexts/CommonContext'
import { getUserData } from '../services/api'

const styles = {
  previewImg : {
    width:'90vw'
  },
  frameBox : {
    visibility: 'hidden',
    height: '0vh'
  
    /* width: 100vw;
    height: 100vh;
    visibility: block;  */
  },
  previewCont : {
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'column'
  }
}
function PosterPreview() {

  const location = useLocation()
  const [poster, setPoster] = useState(null)
  const [userData, setUserData] = useState({})
  const [loading, setLoading] = useState(true)
  const {getUserId} = useContext(AuthContext)
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)

  const [msgCount, setMsgCount] = useState(0)
  const [loadingTitle, setLoadingTitle] = useState("Loading...")
  const [imgBase64, setImgBase64] = useState(null)
  const [imgSrc, setImgSrc] = useState(null)
  const [scripts, setScripts] = useState([])
  const didMount = useRef(false);

  useEffect(() => {

    if ( !didMount.current ) {
      
      setPoster(location.state)
      getUserData(getUserId()).then((response => {
        setUserData(response)
        setScripts(processScript(response, location.state.script))
        setLoading(false)
      }))
      didMount.current = true
      return 
    }

    verifyPosterLoad()
  }, [msgCount])
  
  const generateImgSrc = (files) => {

    if (poster.templateItems.find(item => item == 'userCompanyLogo')) {
      files.push(userData.profilePicUrl)
    }
     
    const photopeaUrl = 'https://www.photopea.com#%7B%22files%22:%5B',
          trailString = '%5D%7D',
          quoteCode   = '%22'

    const fileString = files.map((file, index) => {
                        return quoteCode + file + quoteCode +  (index < files.length-1 ? ",":'')
                      }).join("")

    return photopeaUrl + fileString + trailString
  }

  const onFrameLoad = () => {
    window.addEventListener("message", onMessage)
  }

  const verifyPosterLoad = () => {

    if (msgCount + 1 < poster.logCount) {
      setLoadingTitle(`Please wait, Generating template... ${msgCount + 1}/${poster.logCount}`)
    }
    if (msgCount + 1 == (Capacitor.getPlatform() == 'web' ? poster.logCount : (poster.logCount - 1))) {
      setTimeout(() => {
        var wnd = document.getElementById("photopea").contentWindow
        scripts.forEach(script => {
          wnd.postMessage(script, "*")
        })
        wnd.postMessage("activeDocument.saveToOE(\"jpg\")","*")
      }, 500)
    }
  }

  const onMessage = (e) => { 

    setMsgCount(msgCount + 1)

    if (e.data instanceof ArrayBuffer) {

      var reader = new FileReader()
      reader.readAsDataURL(new Blob([new Uint8Array(e.data)], { type: 'application/octet-stream' }))
      reader.onloadend = () => {  
        setImgBase64(reader.result)
        return
      }
      setImgSrc(window.URL.createObjectURL(new Blob([new Uint8Array(e.data)], { type: 'application/octet-stream' })))
    }
  }

  const downloadImage = async() => {

    const platform = Capacitor.getPlatform()
    if (platform === 'web') {

      console.log('Downloading file for web')
      var element = document.createElement("a")
      element.href = imgSrc
      element.download = poster.fileName+Date.now()+'.jpg'
      element.click()
      showSnackbar('Image downloaded successfully !')
    } else if (platform === 'android' || platform === 'ios') {

      console.log('Downloading file for android')
      Capacitor.Plugins.Filesystem.writeFile({
        data:imgBase64,
        path:`PosterMaker/${poster.fileName+Date.now()+'.jpg'}`,
        recursive: true,
        directory:Directory.Documents
      }).then(async() => {
        showSnackbar('Image saved to gallery successfully !')
      })
    }
  }

  const processScript = (userData, script) => {
    let userDataScript = []
    script.forEach((scriptItem) => {

      if (scriptItem.includes("=userName") || scriptItem.includes("=mobileNo")) {
        const scriptArr = scriptItem.split("=")
        scriptArr[1] = `'${userData[scriptArr[1]]}'`
        userDataScript.push(scriptArr.join('='))
      } else {
        userDataScript.push(scriptItem)
      }
    })
    return userDataScript
  }

  return (
    <>
    {
      loading ? <ComponentLoader title={loadingTitle} /> :
      <>
        <iframe title="Photo Preview" 
          src={generateImgSrc(poster.iframeSrc)}
          sandbox="allow-scripts allow-same-origin allow-presentation" 
          id="photopea"
          style={styles.frameBox}
          onLoad={onFrameLoad}>
        </iframe> 
        { 
          imgSrc ?
            <>
              <h2>Image generated successfully !</h2>
              <div style={styles.previewCont}>
                <img src={imgSrc} style={styles.previewImg} alt="preview image"/>
                <Button variant="contained" fullWidth onClick={downloadImage}
                sx={{marginTop:3}}>
                  Download Image
                </Button>
              </div>
            </> : 
            <Box p={4} style={styles.previewCont}> 
              <h3>{loadingTitle}</h3>
            </Box>
        }
      </>
    }
    </>
  )
}

export default PosterPreview
