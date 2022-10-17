import React, { useContext, useEffect, useState } from 'react'
import { Button, Box, Card, Paper, Grid, TextField } from '@mui/material'
import { useForm, Controller, set } from "react-hook-form";
import { CommonContext } from '../contexts/CommonContext';
import { getCouponCode, getGlobals, updateUserData } from '../services/api';
import { getFirebaseError } from '../services/error-codes';
import { AuthContext } from '../contexts/AuthContext';
import ComponentLoader from '../components/ComponentLoader';
import { useNavigate } from 'react-router-dom';

const styles = {
  rowItem : {
    display:'flex',
    justifyContent:'space-between',
    marginTop:'8px'
  },
  smallFont : {
    fontSize:'15px',
    fontWeight:'200'
  },
  underline: {
    borderBottom:'1px solid #eaeaea'
  }
}

function BuyPremium() {

  const [showCouponCode, setShowCouponCode] = useState(false)
  const { register, handleSubmit, control, reset, formState : {errors} } = useForm()
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)
  const [couponAmount, setCouponAmount] = useState(0)
  const [paymentAmount, setPaymentAmount] = useState(235)
  const {getUserId} = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [globalData, setGlobalData] = useState({})
  const navigate = useNavigate()


  useEffect(() => {
    getGlobals(getUserId()).then((response => {
      setGlobalData(response)
      setPaymentAmount(response.payableAmount)
      setLoading(false)
    }))
  }, [])

  async function checkCouponCode(data) {
    showLoader()
    const resp = await getCouponCode(data.code)
    hideLoader()
    if (!resp) {
      showSnackbar("Invalid coupon code", "error")
      return
    }
    reset()
    setShowCouponCode(false)
    setCouponAmount(resp.amount)
    setPaymentAmount(globalData.payableAmount - resp.amount)
    showSnackbar("Coupon code applied successfully !")
  }

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = src
      script.async = true;
      script.onload = () => {
        console.log("Script loaded successfully")
        resolve(true)
      }
      script.onerror = (error) => {
        showSnackbar("Failed to make payment", "error")
        resolve(false)
      }
      document.body.appendChild(script);
    })
  }

  async function initiatePayment() {

    const resp = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
    if (!resp) {
      showSnackbar("Failed to make payment", "error")
      return
    }

    const paymentSuccess = (response) => {
      console.log("payment success ", response)
      const premiumDetails = {
        ...response,
        timeStamp : Date.now(),
        amountPaid     : paymentAmount,
      }
      const profileData = {
        paymentDetails : premiumDetails,
        isPremium      : true,
        isActive       : true
      }

      showLoader()
      updateUserData(profileData, getUserId()).then(() => {
        hideLoader()
        showAlert("Your premium account is activated successfully")
        navigate("/", {replace : true})
      }).catch((error) => {
        hideLoader()
        showAlert(getFirebaseError(error.code))
      })

    }

    var options = {
      "key": "rzp_test_EWq9NNLZhQGIxA", // Enter the Key ID generated from the Dashboard
      "amount": paymentAmount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": "INR",
      "name": "GoCardly Premium",
      "description": "Test Transaction",
      "image": "https://example.com/your_logo",
      "order_id": "order_KURBUZgDERZgfc", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
      "prefill": {
          "name": "Gaurav Kumar",
          "email": "gaurav.kumar@example.com",
          "contact": "9999999999"
      },
      "notes": {
          "address": "Razorpay Corporate Office"
      },
      "theme": {
          "color": "#3399cc"
      },
      "handler": paymentSuccess
    }

    var rzp1 = new window.Razorpay(options);
      rzp1.open();
      rzp1.on('payment.failed', function (response){
        showAlert("Payment Failed !")
    }); 

 
  }
  return (
    <>
    {
      loading ? <ComponentLoader /> :
      <Box p={2}>
      <h2>Buy Premium</h2>
      <Paper sx={{padding:2}}>
        Premium Includes
        <ul>
          <li>Access to all apps</li>
          <li>Lifetime validity</li>
          <li>On call customer support</li>
        </ul>
        <div>
          <Box sx={{fontSize:'15px'}}> Purchase Summary </Box> 
          <div style={{...styles.rowItem, ...styles.smallFont,...styles.underline}}>
            <div>
              Title
            </div>
            <div>
              Cost
            </div>
          </div>
          <div>
            <div style={styles.rowItem}>
              <div>
                Gocardly Premium
              </div>
              <div>
                {globalData.cardAmount}
              </div>
            </div>
            <div style={{...styles.rowItem, ...styles.underline}}>
              <div>
                GST (18%)
              </div>
              <div>
                {globalData.gst}
              </div>
            </div>
            {
              couponAmount ? 
              <div style={{...styles.rowItem, ...styles.underline}}>
                <div>
                 <Box sx={{fontSize:'18px', color:'#1c5c1c'}}>Coupon Applied
                  <Button sx={{fontSize:'10px'}} onClick={() => {
                      setPaymentAmount(globalData.payableAmount)
                      setCouponAmount(0)
                    }}>Remove</Button>
                 </Box> 
                </div>
                <div>
                  -{couponAmount}
                </div>
              </div> : null
            }
            <div style={styles.rowItem}>
              <div>
                Total 
              </div>
              <div>
                ₹ {paymentAmount}/-
              </div>
            </div>
            
          </div>
        </div>
        {
          showCouponCode ?
          <Box sx={{ paddingTop:'10px', paddingBottom:'10px'}}>
            <form onSubmit={handleSubmit(checkCouponCode)}>
            <Box mb={3} mt={3}>
              <TextField
                placeholder="Enter coupon code"
                label="Coupon Code"
                variant="outlined"
                fullWidth
                name="code"
                {...register("code", {
                  required: "Required field"
                })}
                error={Boolean(errors?.code)}
                helperText={errors?.code?.message}
              />
            </Box>
            <Box mb={2}>
            <Button variant="outlined" onClick={() => setShowCouponCode(false)} sx={{marginRight:'10px'}}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Apply Coupon
            </Button>
            </Box>
     
            </form>
          </Box>
          :
          <Box sx={{ paddingTop:'10px', paddingBottom:'10px'}}>
            <Button onClick={() => setShowCouponCode(true)}>Apply coupon code</Button>
          </Box>
        }
        
        <Button onClick={() => initiatePayment(23)}
          fullWidth
          variant='contained'>
          Buy Premium
        </Button>
      </Paper>
  
      </Box>
    }

    </>
    )
  }
export default BuyPremium
