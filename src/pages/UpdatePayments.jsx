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

const useStyles = makeStyles((theme) => ({
  center : {
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
  },
  //TODO - css fix
  // whiteBg : {
  //   background:'white !important',
  //   height:'-webkit-fill-available'
  // },
  prodImg: {
    height:'30vw'
  }
}));

function UpdatePayments() {

  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const { register, handleSubmit, control, reset, formState : {errors} } = useForm()
  const [userData, setUserData] = useState({})
  const {getUserId} = useContext(AuthContext)
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)
  const [qrImgUrl, setQrImgUrl] = useState('')

  useEffect(() => {
    getUserData(getUserId()).then((response => {
      setUserData(response)
      setLoading(false)
    }))
  }, [])

  async function handleQrImgUpload(e) {
    showLoader()
    const fileName = `payment-${getUserId()}-${Date.now()}.jpg`
    uploadImage(await e.target.files[0].arrayBuffer(), e.target.files[0], fileName, 'payments').then((downloadUrl) => {
      hideLoader()
      setQrImgUrl(downloadUrl)
      setUserData({payments : {qrImgUrls : [downloadUrl]}})
    })
  }
  
  function onFormSubmit(data) {
    let paymentObj = {}
    if (qrImgUrl || (userData.payments && userData.payments.qrImg))
      paymentObj.qrImgUrls    = [qrImgUrl || userData.payments.qrImg[0]]
    paymentObj.upi = data.upi
    paymentObj.accounts = [
      {
        accountName   : data.accountName,
        accountNumber : data.accountNumber,
        ifscCode      : data.ifscCode
      }
    ]
    const paymentData = {
      payments : paymentObj
    } 

    showLoader()
    updateUserData(paymentData, getUserId()).then(async()=> {
      hideLoader()
      showSnackbar('Payment details updated successfully !')
    }).catch(async(error) => {
      hideLoader()
      showSnackbar('Failed to update payment details', 'error')      
    })
  }

  return (
    <>
      {
        loading ? <ComponentLoader /> :
        <Box p={2} className={classes.whiteBg}>
          <h2 className={classes.center}>Update Payment Details</h2>
          <form onSubmit={handleSubmit(onFormSubmit)}>

            <h4>Bank Account Details</h4>
            <Box mb={3}>
              <TextField
                placeholder="Enter your bank account name"
                label="Account Name"
                ariant="outlined"
                fullWidth
                defaultValue={userData.payments && userData.payments.accounts ? userData.payments.accounts[0].accountName : null}
                name="accountName"
                {...register("accountName")}
                error={Boolean(errors?.accountName)}
                helperText={errors?.accountName?.message}
              />
            </Box>

            <Box mb={3}>
              <TextField
                placeholder="Enter your bank account number"
                label="Account Number"
                ariant="outlined"
                fullWidth
                defaultValue={userData.payments && userData.payments.accounts ? userData.payments.accounts[0].accountNumber : null}
                name="accountNumber"
                {...register("accountNumber")}
                error={Boolean(errors?.accountNumber)}
                helperText={errors?.accountNumber?.message}
              />
            </Box>

            <Box mb={3}>
              <TextField
                placeholder="Enter your ifsc code"
                label="IFSC Code"
                ariant="outlined"
                fullWidth
                defaultValue={userData.payments && userData.payments.accounts ? userData.payments.accounts[0].ifscCode : null}
                name="ifscCode"
                {...register("ifscCode")}
                error={Boolean(errors?.ifscCode)}
                helperText={errors?.ifscCode?.message}
              />
            </Box>

            <h4>UPI Details</h4>

            <Box mb={3}>
              <TextField
                placeholder="Enter your UPI ID"
                label="UPI ID"
                ariant="outlined"
                fullWidth
                defaultValue={userData.payments ? userData.payments.upi : null}
                name="upi"
                {...register("upi")}
                error={Boolean(errors?.upi)}
                helperText={errors?.upi?.message}
              />
            </Box>

            <h4>Payment QR Code</h4>

            <Box mb={3}>
              <Button
                variant="contained"
                component="label">
                Upload Payment QR
                <input
                  onChange={handleQrImgUpload}
                  type="file"
                  hidden
                />
              </Button>
            </Box>

            <Box mb={3}>
              {
                userData.payments && userData.payments.qrImgUrls && userData.payments.qrImgUrls[0] ?
                <ImageLoader props={{imgUrl:userData.payments.qrImgUrls[0], className : classes.prodImg}} /> : null
              }
            </Box>

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{marginBottom:'20px'}}>
            Save 
          </Button>
        </form>
        </ Box>
      }
    </>
  )
}

export default UpdatePayments
