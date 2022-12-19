import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { generateRefreshToken } from '../services/api';
import React,  {useContext, useEffect, useState} from 'react'
import { TextField, Button, Box, Card, Paper, Grid } from '@mui/material'
import { AuthContext } from '../contexts/AuthContext';
import { CommonContext } from '../contexts/CommonContext';
import { useForm, Controller } from "react-hook-form";
import { makeStyles } from "@mui/styles";
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import InputAdornment from '@mui/material/InputAdornment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


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

function AddAppointment() {

  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const { register, handleSubmit, control, reset, formState : {errors} } = useForm()
  const {getUserId} = useContext(AuthContext)
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)
  const [dateTime, setDateTime] = React.useState(null);
  const [type, setType] = React.useState('online');


  useEffect(() => {
    setTimeout(() => {
      GoogleAuth.initialize({
        clientId: '812160275286-uvjqfg146kobk8umth52sg8resgnkei4.apps.googleusercontent.com',
        scopes: ['profile', 'email', 'openid', 'https://www.googleapis.com/auth/calendar'],
        grantOfflineAccess: true
      });
    }, 1000)

  }, [])

  function onFormSubmit(data) {
    showLoader()
    // updateUserData(data, getUserId()).then(async()=> {
    //   hideLoader()
    //   showSnackbar('Profile data updated successfully !')
    // }).catch(async() => {
    //   hideLoader()
    //   showSnackbar('Failed to update profile data', 'error')
    // })
  }

  const signIn = async() => {
    const resp =  await GoogleAuth.signIn()
    console.log("========", resp, resp.serverAuthCode)
    generateRefreshToken({serverAuthCode : resp.serverAuthCode}).then((res) => {
      console.log("response received from gen token", res)
    
    }).catch((error) => {
      console.log("error : ", error)
    })
  }

  return (
    <>
        <Box p={2}>
          <h2>Add New Appointment</h2>
          
          <form onSubmit={handleSubmit(onFormSubmit)}>

            <Box mb={3}>
              <TextField
                placeholder="Enter title"
                label="Title"
                variant="outlined"
                fullWidth
                name="title"
                {...register("title", {
                  required: "Required field"
                })}
                error={Boolean(errors?.title)}
                helperText={errors?.title?.message}
              />
            </Box>

            <Box mb={3}>
              <TextField
                placeholder="Enter description"
                label="Description"
                variant="outlined"
                fullWidth
                name="description"
                multiline
                rows={4}
                {...register("description")}
                error={Boolean(errors?.description)}
                helperText={errors?.description?.message}
              />
            </Box>

            <Box mb={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  renderInput={(props) => <TextField sx={{width:'100%'}} {...props} />}
                  label="Select Date and Time"
                  value={dateTime}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <InsertInvitationIcon />
                      </InputAdornment>
                    ),
                  }}
                  minDateTime={dayjs(Date.now())}
                  onChange={(newValue) => {
                    setDateTime(newValue);
                  }}
                />
              </LocalizationProvider>
            </Box>

            <Box mb={3}>
            <ToggleButtonGroup
              color="primary"
              value={type}
              exclusive
              onChange={(event, newType) => setType(newType)}
              aria-label="Platform"
            >
              <ToggleButton value="online">Online</ToggleButton>
              <ToggleButton value="offline">Offline</ToggleButton>
            </ToggleButtonGroup>
            </Box>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{marginBottom:'25px'}}>
            Save 
          </Button>
        </form>
      </Box>
        <Button onClick={signIn}>
          SignIn
        </Button>
    </>
  )
}

export default AddAppointment
