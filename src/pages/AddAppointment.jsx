import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { createMeeting, generateRefreshToken } from '../services/api';
import React,  {useContext, useEffect, useState} from 'react'
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
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { TextField, Button, Box, Paper , FormControl, InputLabel, MenuItem, Select, Modal } from '@mui/material'
import { useNavigate } from 'react-router-dom';


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
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const { register, handleSubmit, control, reset, formState : {errors} } = useForm()
  const {getUserId} = useContext(AuthContext)
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)
  const [dateTime, setDateTime] = useState(null)
  const [type, setType] = useState('Online')
  const [meetLink, setMeetLink] = useState(true)
  const [duration, setDuration] = useState('30')
  const [showError, setShowError] = useState(false)


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
    
    if (dateTime && dateTime.$d) data.fromTs = dateTime.$d.getTime()
    data.meetingType = type
    data.meetLinkRequired = meetLink
    data.duration = duration
    data.uid = getUserId()
    if (!data.fromTs) {
      setShowError(true)
      return
    }
    
    showLoader()
    createMeeting(data).then(async()=> {
      hideLoader()
      showSnackbar('Meeting created successfully !')
      navigate("/")
    }).catch(async() => {
      hideLoader()
      showSnackbar('Failed to create meeting', 'error')
    })
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
                  inputFormat="DD/MM/YYYY hh:mm A"
                  value={dateTime}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <InsertInvitationIcon />
                      </InputAdornment>
                    ),
                    error:showError
                  }}
                  
                  onChange={(newValue) => {
                    setDateTime(newValue)
                    setShowError(false)
                  }}
                />
              </LocalizationProvider>
              <Box sx={{color:'#d32f2f', fontSize:'0.80rem', marginTop:'3px', marginLeft:'14px'}}>
                {
                  showError ? 'Please select date and time' : ''
                }
              </Box>
            </Box>

            <Box mb={3}>
              <FormControl 
                sx={{margin:'10px 0', width:'50vw'}}>  
                <InputLabel id="demo-select-small">Duration</InputLabel>
                  <Select
                    value={duration}
                    labelId="demo-select-small"
                    placeholder="Duration"
                    required
                    onChange={(e) => setDuration(e.target.value)}
                    label="Duration">
                    <MenuItem value={'15'}>15 Mins</MenuItem>
                    <MenuItem value={'30'}>30 Mins</MenuItem>
                    <MenuItem value={'45'}>45 Mins</MenuItem>
                    <MenuItem value={'60'}>1 Hour</MenuItem>
                    <MenuItem value={'120'}>2 Hours</MenuItem>
                  </Select>
                </FormControl>
            </Box>

            <Box mb={3}>
              <ToggleButtonGroup
                color="primary"
                value={type}
                exclusive
                onChange={(event, newType) => setType(newType)}
                aria-label="Platform"
              >
                <ToggleButton value="Online">Online</ToggleButton>
                <ToggleButton value="Offline">Offline</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            {
              type === 'Online' ? 
              <Box>
                <FormGroup>
                  <FormControlLabel control={
                    <Checkbox defaultChecked onChange={(e) => setMeetLink(e.target.checked)}/>
                    } label="Create Meeting Link" />
                </FormGroup>
              </Box> :
              <Box>
                <TextField
                  placeholder="Enter location"
                  label="Meeting Location"
                  variant="outlined"
                  fullWidth
                  name="location"
                  {...register("location")}
                  error={Boolean(errors?.location)}
                  helperText={errors?.location?.message}
                />
              </Box>
            }
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{marginBottom:'25px', marginTop:'25px'}}>
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
