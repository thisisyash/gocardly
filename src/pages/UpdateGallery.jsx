import React,  {useContext, useEffect, useState} from 'react'
import ComponentLoader from '../components/ComponentLoader'
import { TextField, Button, Box, Card, Paper, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { makeStyles } from "@mui/styles";
import { useForm, Controller } from "react-hook-form";
import { getUserData, updateUserData, uploadImage } from '../services/api'
import { AuthContext } from '../contexts/AuthContext';
import { CommonContext } from '../contexts/CommonContext';

const useStyles = makeStyles((theme) => ({
  center : {
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
  },
  // whiteBg : {
  //   height:'-webkit-fill-available'
  // },
  prodImg: {
    height:'30vw',
    margin:'20px',
    width:'30vw'
  }
}));

function UpdateGallery() {

  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState({})
  const {getUserId} = useContext(AuthContext)
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)

  useEffect(() => {
    getUserData(getUserId()).then((response => {
      setUserData(response)
      setLoading(false)
    }))
  }, [])

  function removeProuctImg(imgUrl) {
    showLoader()
    const galleryData = {
      gallery : {
        imgUrls : userData.gallery.imgUrls.filter(img => img != imgUrl)
      }
    }
    updateGalleryData(galleryData, true, imgUrl)
  }

  async function handleProductImgUpload(e) {
    showLoader()
    const fileName = `gallery-${getUserId()}-${Date.now()}.jpg`
    uploadImage(await e.target.files[0].arrayBuffer(), e.target.files[0], fileName, 'gallery').then((downloadUrl) => {
      let data = {}
      data.imgUrls = userData?.gallery?.imgUrls || []
      data.imgUrls.push(downloadUrl)
      const galleryData = {
        gallery : data
      } 
      updateGalleryData(galleryData,false, downloadUrl)
    })
  }

  function updateGalleryData(galleryData, isRemove, imgUrl) {
    updateUserData(galleryData, getUserId()).then(async()=> {
      hideLoader()
      if(isRemove) 
        userData.gallery.imgUrls = userData.gallery.imgUrls.filter(img => img != imgUrl)  
      if (!userData.gallery)  
        userData.gallery = galleryData.gallery
      
      showSnackbar('Gallery items updated successfully !')
    }).catch(async(error) => {
      hideLoader()
      showSnackbar('Failed to update gallery items', 'error')
    })
  }

  return (
    <>
      {
        loading ? <ComponentLoader /> :
        <Box p={2} className={classes.whiteBg}>
          <h2 className={classes.center}>Update Gallery Items</h2>

          <Box mb={3} mt={3}>
            {
              userData.gallery && userData.gallery.imgUrls && userData.gallery.imgUrls.length ?
              userData.gallery.imgUrls.map(img => 
                <Paper sx={{margin:'10px', display:'flex', alignItems:'center', justifyContent:'center'}}  key={img}>
                  <img className={classes.prodImg} src={img} /> 
                  <Button
                    variant="contained"
                    onClick={() => removeProuctImg(img)}
                    component="label">
                    Remove
                  </Button>
                </Paper>
              ) : null
            }
          </Box>
          <Box pb={5}>
            <Button
              variant="contained"
              component="label">
              Upload new image
              <input
                onChange={handleProductImgUpload}
                type="file"
                hidden
              />
            </Button>
          </Box>
      </ Box>
      }
    </>
  )
}

export default UpdateGallery
