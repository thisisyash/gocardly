import React, { useContext, useState, useEffect } from 'react'
import { TextField, Button, Box } from '@mui/material'
import { useForm, Controller } from "react-hook-form";
import { makeStyles } from "@mui/styles";
import { CommonContext } from '../contexts/CommonContext';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { setUserData } from '../services/api';
import { getFirebaseError } from '../services/error-codes';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Modal from '@mui/material/Modal';
import gocardlylogo from '../assets/gocardly.png'


const useStyles = makeStyles((theme) => ({
  center : {
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
  },
  whiteBg : {
    background:'white !important',
    height:'100vh'
  },
  modalStyle : {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4
  },
  appointmentBox : {
    background : 'white',
    padding:'20px',
    borderRadius:'5px'
  },
  logoImg : {
    width : '80vw',
    height : 'auto'
  },
  logoImgCont : {
    textAlign : 'center',
    paddingTop:'2vh'
  }
}));


function Authentication() {

  const classes = useStyles()
  const [showSignIn, setShowSignIn] = useState(true)
  const { register, handleSubmit, control, reset, formState : {errors} } = useForm()
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)
  const {userLoggedIn, setUserProfileData, isUserLoggedIn} = useContext(AuthContext)
  const [forgotPasswordModal, setForgotPasswordModal] = React.useState(false)
  const { register : register2, handleSubmit : handleSubmit2, reset : reset2, formState : {errors2} } = useForm()
  const { register : register3, handleSubmit : handleSubmit3, reset : reset3, formState : {errors3} } = useForm()

  const navigate = useNavigate()

  useEffect(() => {
    if(isUserLoggedIn()) {
      navigate("/", {replace:true})
    }
  })

  const onLogin = (data) => {
    showLoader('Logging In...')
    signInWithEmailAndPassword(auth, data.email, data.password)
    .then((userCredential) => {
      userLoggedIn(userCredential.user.uid)
      hideLoader()
      navigate("/")
    })
    .catch((error) => {
      hideLoader()
      showAlert(getFirebaseError(error.code))
    });
  }

  const onSignup = (data) => {
    showLoader('Signing Up...')
    createUserWithEmailAndPassword(auth, data.email, data.password)
    .then((userCredential) => {

      const userData = {
        uid          : userCredential.user.uid,
        userName     : data.userName,
        userUrlId    : data.userName.split(' ').join('-'),
        email        : data.email,
        createdAt    : Date.now(),
        isPremium    : false,
        enquiriesCount    : 0,
        appointmentsCount : 0,
        views        : 0,
        isActive     : false,
        mobileNo     : data.mobileNo,
        profileCompletion : 5
      }
      userLoggedIn(userData.uid)

      setUserData(userData).then(() => {
        hideLoader()
        setUserProfileData(userData)
        navigate('/', {replace:true})
      }).catch((error) => {
        hideLoader()
        showAlert(getFirebaseError(error.code))
      })
   
    })
    .catch((error) => {
      hideLoader()
      showAlert(getFirebaseError(error.code))
    });
  }

  const switchLogin = () => {
    setShowSignIn(!showSignIn) 
    reset()
  }

  const resetPassword = (data) => {
    showLoader('Please Wait...')
    sendPasswordResetEmail(auth, data.email)
    .then(() => {
      hideLoader()
      setForgotPasswordModal(false)
      showSnackbar("Password reset link sent successfully to your email ID")
    })
    .catch((error) => {
      hideLoader()
      showAlert(getFirebaseError(error.code))
    });
  }

  return (
    <div className={classes.whiteBg}>
    <div className={classes.logoImgCont}>
      <img src={gocardlylogo} className={classes.logoImg} />
    </div>
    {
      showSignIn ?
      <>
         <Modal
          open={forgotPasswordModal}
          onClose={() => setForgotPasswordModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className={classes.modalStyle}>
            <Box className={classes.appointmentBox}>
            <h4>Enter your email ID, we will send a password reset link to your mail.</h4>

              <form onSubmit={handleSubmit3(resetPassword)} key={3}>

                <Box mb={3}>
                  <TextField
                    placeholder="Enter your email"
                    label="Email ID"
                    variant="outlined"
                    fullWidth
                    autoComplete='off'
                    name="email"
                    {...register3("email", {
                      required: "Required field",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    error={Boolean(errors3?.email)}
                    helperText={errors3?.email?.message}
                  />
                </Box>
                
                <Box>
                  <Button variant="outlined" sx={{marginRight:2}}
                    onClick={() => setForgotPasswordModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    Reset Password
                  </Button>
                </Box>
                
              </form>
            </Box>
          </Box>
        </Modal>
        
      <Box p={2}>
        <h2 className={classes.center}>Login</h2>
        <form onSubmit={handleSubmit(onLogin)}>

          <Box mb={3}>
            <TextField
              placeholder="Enter your email"
              label="Email"
              variant="outlined"
              fullWidth
              autoComplete='off'
              name="email"
              {...register("email", {
                required: "Required field",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              // InputProps={{
              //   startAdornment: (
              //     <InputAdornment position="start">
              //       <EmailIcon />
              //     </InputAdornment>
              //   ),
              // }}
              error={Boolean(errors?.email)}
              helperText={errors?.email?.message}
            />
          </Box>

          <Box mb={3}>
            <TextField
              placeholder="Enter your password"
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              name="password"
              // InputProps={{
              //   startAdornment: (
              //     <InputAdornment position="start">
              //       <VpnKeyIcon />
              //     </InputAdornment>
              //   ),
              // }}
              {...register("password", {
                required: "Required field",
              })}
              error={Boolean(errors?.password)}
              helperText={errors?.password?.message}
            />
          </Box>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Log In 
          </Button>
        </form>
        <Button fullWidth sx={{marginTop:2}} onClick={() => setForgotPasswordModal(true)}>
          Forgot Password
        </Button>
      </Box>
      </>
      :
      <Box p={2}>
        <h2 className={classes.center}>Signup</h2>
        <form onSubmit={handleSubmit(onSignup)}>
          <Box mb={3}>
            <TextField
              placeholder="Enter your full name"
              label="Full Name"
              variant="outlined"
              fullWidth
              autoComplete='off'
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
              placeholder="Enter your email"
              label="Email ID"
              variant="outlined"
              fullWidth
              autoComplete='off'
              name="email"
              {...register("email", {
                required: "Required field",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              error={Boolean(errors?.email)}
              helperText={errors?.email?.message}
            />
          </Box>

          <Box mb={3}>
            <TextField
              placeholder="Enter your mobile number"
              label="Mobile Number"
              variant="outlined"
              fullWidth
              autoComplete='off'
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
              placeholder="Enter your password"
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              name="password"
              {...register("password", {
                required: "Required field",
              })}
              error={Boolean(errors?.password)}
              helperText={errors?.password?.message}
            />
          </Box>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign Up 
          </Button>
        </form>
      </Box>
    }

    <div className={classes.center} onClick={switchLogin}>
      {
        showSignIn ?
          <p>Didn't have an account ? Signup</p>
          :
          <p>Already had an account ? Login</p>
      }
    </div>
    </div>
  )
}

export default Authentication
