import React,  {useContext, useEffect, useState} from 'react'
import ComponentLoader from '../components/ComponentLoader'
import { TextField, Button, Box, Card, Paper, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { makeStyles } from "@mui/styles";
import { useForm, Controller } from "react-hook-form";
import { getUserData, updateUserData, uploadImage } from '../services/api'
import { AuthContext } from '../contexts/AuthContext';
import { CommonContext } from '../contexts/CommonContext';
import ImageLoader from '../components/ImageLoader';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const useStyles = makeStyles((theme) => ({
  center : {
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
  },
  // whiteBg : {
    // background:'white !important',
    // height:'-webkit-fill-available'
  // },
  profilePicCont : {
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    fontSize:'25vw'
  },
  profilePic : {
    width:'30vw',
    height:'30vw',
    border: '1px solid #b8b8b8',
    borderRadius:'50%'
  },
  defIcon: {
    fontSize:'25vw'
  }
}));

function UpdatePersonalDetails() {

  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const { register, handleSubmit, control, reset, formState : {errors} } = useForm()
  const [userData, setUserData] = useState({})
  const {getUserId} = useContext(AuthContext)
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)

  useEffect(() => {
    getUserData(getUserId()).then((response => {
      setUserData(response)
      setLoading(false)
    }))
  }, [])

  async function handleProfilePicUpload(e) {
    showLoader()
    const fileName = `profilepic-${getUserId()}-${Date.now()}.jpg`
    uploadImage(await e.target.files[0].arrayBuffer(), e.target.files[0], fileName, 'personal').then((downloadUrl) => {
      hideLoader()
      updateProfilePicUrl(downloadUrl)
    })
  }

  function updateProfilePicUrl(imgUrl) {
    updateUserData({profilePicUrl : imgUrl}, getUserId()).then(async()=> {
      hideLoader()
      userData['profilePicUrl'] = imgUrl
      showSnackbar('Profile pic updated successfully !')
    }).catch(async() => {
      hideLoader()
      showSnackbar('Failed to update profile pic', 'error')
    })
  }

  function onFormSubmit(data) {
    showLoader()
    updateUserData(data, getUserId()).then(async()=> {
      hideLoader()
      showSnackbar('Profile data updated successfully !')
    }).catch(async() => {
      hideLoader()
      showSnackbar('Failed to update profile data', 'error')
    })
  }

  return (
    <>
      {
        loading ? <ComponentLoader /> :
        <Box p={2} className={classes.whiteBg}>
          <h2 className={classes.center}>Update Personal Details</h2>

          <div className={classes.profilePicCont}> 
            {
              userData?.profilePicUrl ?
              <ImageLoader props={{imgUrl:userData.profilePicUrl, className:classes.profilePic}}/>
               :
              <AccountCircleIcon className={classes.defIcon}/>
            }
          </div>

          <Box mb={3} mt={2} sx={{textAlign:'center'}}>
            <Button
              variant="contained"
              component="label">
              Upload profile pic
              <input
                onChange={handleProfilePicUpload}
                type="file"
                hidden
              />
            </Button>
          </Box>
          
          <form onSubmit={handleSubmit(onFormSubmit)}>

            <Box mb={3}>
              <TextField
                placeholder="Enter your full name"
                label="Full Name"
                variant="outlined"
                fullWidth
                defaultValue={userData.userName}
                name="userName"
                {...register("userName", {
                  required: "Required field"
                })}
                error={Boolean(errors?.userName)}
                helperText={errors?.userName?.message}
              />
            </Box>

            <Box mb={3}>
              <TextField
                placeholder="Enter your mobile number"
                label="Mobile Number"
                variant="outlined"
                fullWidth
                defaultValue={userData.mobileNo}
                name="mobileNo"
                {...register("mobileNo", {
                  required: "Required field",
                  pattern: {
                    value: /^[7896]\d{9}$/,
                    message: "Invalid mobile number",
                  },
                })}
                error={Boolean(errors?.mobileNo)}
                helperText={errors?.mobileNo?.message}
              />
            </Box>

            <Box mb={3}>
              <TextField
                placeholder="Enter whatsapp number"
                label="WhatsApp Number"
                variant="outlined"
                fullWidth
                defaultValue={userData.whatsappNo}
                name="whatsappNo"
                {...register("whatsappNo", {
                  required: "Required field",
                  pattern: {
                    value: /^[7896]\d{9}$/,
                    message: "Invalid mobile number",
                  },
                })}
                error={Boolean(errors?.whatsappNo)}
                helperText={errors?.whatsappNo?.message}
              />
            </Box>

            <Box mb={3}>
              <TextField
                placeholder="Enter your designation"
                label="Proffesion"
                variant="outlined"
                fullWidth
                defaultValue={userData.profession}
                name="profession"
                {...register("profession")}
                error={Boolean(errors?.profession)}
                helperText={errors?.profession?.message}
              />
            </Box>

            <Box mb={3}>
              <TextField
                placeholder="Enter address"
                label="Address"
                variant="outlined"
                fullWidth
                defaultValue={userData.address}
                name="address"
                multiline
                rows={4}
                {...register("address")}
                error={Boolean(errors?.address)}
                helperText={errors?.address?.message}
              />
            </Box>

            <Box mb={3}>
              <TextField
                placeholder="Enter description about you"
                label="About Me"
                variant="outlined"
                fullWidth
                defaultValue={userData.aboutMe}
                name="aboutMe"
                multiline
                rows={4}
                {...register("aboutMe")}
                error={Boolean(errors?.aboutMe)}
                helperText={errors?.aboutMe?.message}
              />
            </Box>

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{marginBottom:'25px'}}>
            Save 
          </Button>
        </form>
        </ Box>
      }
    </>
  )
}

export default UpdatePersonalDetails
