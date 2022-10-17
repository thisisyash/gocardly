import React, {useContext, useEffect, useState} from 'react'
import { Button, Box, Paper, TextField, Grid} from '@mui/material'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { bookNewAppointment, getUserData, sendNewEnquiry } from '../services/api'
import ComponentLoader from '../components/ComponentLoader'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ImageLoader from '../components/ImageLoader'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import LanguageIcon from '@mui/icons-material/Language';
import CallIcon from '@mui/icons-material/Call';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import Modal from '@mui/material/Modal';
import { useForm, Controller } from "react-hook-form";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import InputAdornment from '@mui/material/InputAdornment';
import { CommonContext } from '../contexts/CommonContext'


const styles = {
  profilePic : {
    width:'30vw',
    height:'30vw',
    border: '1px solid #b8b8b8',
    marginTop:'15px',
    borderRadius:'50%'
  },
  defIcon: {
    fontSize:'25vw'
  },
  profilePicCont : {
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    fontSize:'25vw'
  },
  userCard : {
    display:'flex',
    flexDirection:'column',
    padding:'10px'
  },
 
  userNameCont: {
    textAlign:'center',
    marginTop:'10px',
    fontSize:'30px'
  },
  aboutMeCont: {
    marginTop:'10px',
    textAlign:'justify',
    fontSize:'16px'
  },
  addressCont: {
    marginTop:'10px'
  },
  professionCont: {
    marginTop:'10px'
  },
  contactCont: {
    display:'flex',
    marginTop:'20px',
    justifyContent:'space-around'
  },
  socialMediaCont: {
    display:'flex',
    marginTop:'30px',
    justifyContent:'space-around'
  },
  enquiryCont: {
    display:'flex',
    marginTop:'30px',
    justifyContent:'space-around'
  },
  circleIcon : {
    border:'1px solid black',
    borderRadius:'50%',
    padding:'10px'
  },
  squareIcon: {
    border:'1px solid black',
    padding:'10px',
    borderRadius:'5px',
    boxShadow:'4px 4px 5px 2px #eaeaea'
  },
  galleryCont: {
    display:'flex'
  },
  galleryImg : {
    height:'50vw',
    width:'35vw',
    borderRadius:'5px'
  },

  companiesCont: {
    display:'flex',
    flexDirection:'column'
  },
  companyCont: {
    border:'1px solid #919191',
    padding:'10px',
    borderRadius:'10px'
  },
  companyNameCont : {
    fontSize:'23px',
    marginBottom:'10px',
    borderBottom:'1px solid #eaeaea'
  },
  companyDescCont : {
    fontSize:'20px'
  },
  companyImg: {
    width:'80vw',
    borderRadius:'5px'
  },

  productsCont: {
    display:'flex',
    flexDirection:'column'
  },
  productCont: {
    border:'1px solid #919191',
    padding:'10px',
    borderRadius:'10px'
  },
  productNameCont: {
    fontSize:'23px',
    marginBottom:'10px',
    borderBottom:'1px solid #eaeaea'
  },
  productDescCont: {
    fontSize:'20px',
    marginBottom:'10px'
  },
  prodImg: {
    width:'80vw',
    borderRadius:'5px',
    marginTop:'10px'
  },
  
  paymentLabel: {
    fontSize:'15px',
    marginTop:'10px',
    fontWeight:'280'
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
  center : {
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    marginTop:'0px'
  }

}

function MyCard() {

  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState({})

  const { register, handleSubmit, control, reset, formState : {errors} } = useForm()
  const { register : register2, handleSubmit : handleSubmit2, reset : reset2, formState : {errors2} } = useForm()

  const { id } = useParams()
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)
  const [appointmentModal, setAppointmentModal] = React.useState(false);
  const [enquiryModal, setEnquiryModal] = React.useState(false)

  const [dateTime, setDateTime] = React.useState(null);

  useEffect(() => {
    getUserData(id).then((response => {
      setUserData(response)
      setLoading(false)
    })).catch((error) => {
      
    })
  }, [])

  function openUrl(url) {
    if (url.slice(0,4) != 'http')
      url = 'https://'+url
    window.open(url, '_blank')
  }

  function callMe(number) {
    window.open(`tel:${number}`, '_self');
  }

  function whatsappMe(number) {
    window.open(`https://wa.me/91${number}`, '_blank')
  }

  function mailMe(mailId) {
    window.open(`mailto:${mailId}`)
  }

  function bookAppointment(data) {
    data.userId    = id
    data.timeStamp = Date.now()
    if (dateTime && dateTime.$d) data.appointmentTime = dateTime.$d.getTime()
    showLoader()
    bookNewAppointment(data).then(()=> {
      hideLoader()
      showSnackbar("Appointment booked successfully")
      reset()
      setAppointmentModal(false)
    }).catch((error) => {
      hideLoader()
      showSnackbar("Failed to book appointment",'error')
    })
  }

  function sendEnquiry(data) {
    data.userId = id
    data.timeStamp = Date.now()
    showLoader()
    sendNewEnquiry(data).then(()=> {
      hideLoader()
      showSnackbar("Enquiry sent successfully")
      reset2()
      setEnquiryModal(false)
    })
  }

  return (
    <>
    {
      loading ? <ComponentLoader /> :
      <>
      <Box p={2}>
      <h2 style={styles.center}>My Card</h2>
        <Modal
          open={appointmentModal}
          onClose={() => setAppointmentModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box style={styles.modalStyle}>
            <Box style={styles.appointmentBox}>
              Book  Appointment for {userData.userName}
              <form onSubmit={handleSubmit(bookAppointment)} key={1}>

                <Box mb={3} mt={3}>
                  <TextField
                    placeholder="Enter your full name"
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    autoFocus
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

                <Box sx={{display:'flex'}}>
                  <Button variant="outlined" sx={{marginRight:2}}
                    onClick={() => setAppointmentModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Send 
                  </Button>
                </Box>

              </form>
            </Box>
          </Box>
        </Modal>

        <Modal
          open={enquiryModal}
          onClose={() => setEnquiryModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box style={styles.modalStyle}>
            <Box style={styles.appointmentBox}>
              Send Enquiry to {userData.userName}
              <form onSubmit={handleSubmit2(sendEnquiry)} key={2}>

                <Box mb={3} mt={3}>
                  <TextField
                    placeholder="Enter your full name"
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    autoFocus
                    autoComplete='off'
                    name="userName"
                    {...register2("userName", {
                      required: "Required field"
                    })}
                    error={Boolean(errors2?.userName)}
                    helperText={errors2?.userName?.message}
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
                    {...register2("mobileNo", {
                      required: "Required field",
                      pattern: {
                        value: /^[7896]\d{9}$/,
                        message: "Invalid mobile number",
                      },
                    })}
                    error={Boolean(errors2?.mobileNo)}
                    helperText={errors2?.mobileNo?.message}
                  />
                </Box>

                <Box mb={3}>
                  <TextField
                    placeholder="Describe your query here"
                    label="Your Query"
                    variant="outlined"
                    fullWidth
                    autoComplete='off'
                    name="description"
                    multiline
                    rows={2}
                    {...register2("description",{
                      required: "Required field"
                    })}
                    error={Boolean(errors2?.description)}
                    helperText={errors2?.description?.message}
                  />
                </Box>

                <Box sx={{display:'flex'}}>
                  <Button variant="outlined" sx={{marginRight:2}}
                    onClick={() => setEnquiryModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Send 
                  </Button>
                </Box>

              </form>
            </Box>
          </Box>
        </Modal>
        
        <Paper style={styles.userCard}>
          <div style={styles.profilePicCont}> 
            {
              userData?.profilePicUrl ?
              <ImageLoader props={{imgUrl:userData.profilePicUrl, styles:styles.profilePic}}/>
               :
              <AccountCircleIcon style={styles.defIcon}/>
            }
          </div>

          <Box style={styles.userNameCont}>
            { userData.userName } 
          </Box>
          <Box style={styles.aboutMeCont}>
            { userData.aboutMe } 
          </Box>
          <Box style={styles.professionCont}>
            { userData.profession } 
          </Box>
          <Box style={styles.addressCont}>
            { userData.address } 
          </Box>
          
          <Box style={styles.contactCont}>
            {
              userData.mobileNo ? 
              <CallIcon style={styles.circleIcon} onClick={() => callMe(userData.mobileNo)}/> : null
            }

            {
              userData.whatsappNo ? 
              <WhatsAppIcon style={styles.circleIcon} onClick={() => whatsappMe(userData.whatsappNo)}/> : null
            }

            {
              userData.email ? 
              <EmailIcon style={styles.circleIcon} onClick={() => mailMe(userData.email)}/> : null
            }

          </Box>

          <Box style={styles.enquiryCont}>
            <Button variant="contained" size="medium"  onClick={() => setAppointmentModal(true)} sx={{mr:3}}>
              Book Appointment
            </Button>
            <Button variant="contained" size="medium" onClick={() => setEnquiryModal(true)}>
              Send Enquiry
            </Button>
          </Box>

          <Box style={styles.socialMediaCont}>
            {
              userData?.mediaLinks?.facebookLink ? 
              <FacebookIcon style={styles.squareIcon} onClick={() => openUrl(userData.mediaLinks.facebookLink)} /> : null
            }
            {
              userData?.mediaLinks?.twitterLink ? 
              <TwitterIcon style={styles.squareIcon} onClick={() => openUrl(userData.mediaLinks.twitterLink)} /> : null
            }
            {
              userData?.mediaLinks?.linkedinLink ? 
              <LinkedInIcon style={styles.squareIcon} onClick={() => openUrl(userData.mediaLinks.linkedinLink)} /> : null
            }
            {
              userData?.mediaLinks?.instagramLink ? 
              <InstagramIcon style={styles.squareIcon} onClick={() => openUrl(userData.mediaLinks.instagramLink)} /> : null
            }
            {
              userData?.mediaLinks?.websiteLink ? 
              <LanguageIcon style={styles.squareIcon} onClick={() => openUrl(userData.mediaLinks.websiteLink)} /> : null
            }
          </Box>

          <Box>
            {
              userData.companies ? 
              <>
                <h3>Companies</h3>
                <Box style={styles.companiesCont}>
                {
                  userData.companies.map((company, index) => {
                    return <Box key={index} style={styles.companyCont}>
                      {
                        company.logo ?
                        <ImageLoader props={{imgUrl: company.logo ? company.logo : null, styles : styles.companyImg}} />
                        : null
                      }
                      <div style={styles.companyNameCont}>{company.name}</div>
                      <div style={styles.companyDescCont}>{company.description}</div>
                    </Box>
                  })
                }
                </Box>
              </> : null
            }
          </Box>

          <Box>
            {
              userData.products ? 
              <>
                <h3>Products & Services</h3>
                <Box style={styles.productsCont}>
                {
                  userData.products.map((product, index) => {
                    return <Box key={index} style={styles.productCont}>
                      <div style={styles.productNameCont}> {product.name} </div>  
                      <div style={styles.productDescCont}> {product.description} </div> 
                      {
                        product.imgUrls ?
                        <ImageLoader props={{imgUrl: product?.imgUrls[0], styles : styles.prodImg}} /> : null
                      }
                    </Box>
                  })
                }
                </Box>
              </> : null
            }
          </Box>

          <Box>
            {
              userData.gallery ? 
              <>
                <h3>Gallery</h3>
                <Grid container spacing={3} justifyContent="center">
                  {
                    userData.gallery.imgUrls.map((imgUrl, index) => {
                      return<Grid item xs key={index}>
                        <ImageLoader props={{imgUrl: imgUrl, styles : styles.galleryImg}} />
                      </Grid>
                    })
                  }
                </Grid>
              </> : null
            }
          </Box>

          <Box>
            {
              userData.payments ? 
              <>
                <h3>Payment Details</h3>
                {
                  userData.payments.accounts.map((account, index) => {
                    return <Box key={index}>
                      {
                        <>
                          <Box>
                            <Box style={styles.paymentLabel}>Account Name</Box>
                            <Box> {account.accountName} </Box>
                          </Box>
                          <Box>
                            <Box style={styles.paymentLabel}>Account Number</Box>
                            <Box> {account.accountNumber} </Box>
                          </Box>
                          <Box>
                            <Box style={styles.paymentLabel}>IFSC Code</Box>
                            <Box> {account.ifscCode} </Box>
                          </Box>
                        </>
                      }
                    </Box>
                  })
                }

                <Box sx={{borderTop:'1px solid #eaeaea', marginTop:'10px'}}>
                  <Box style={styles.paymentLabel}>UPI ID</Box>
                  <Box> {userData.payments.upi} </Box>
                </Box>

                {
                  userData.payments && userData.payments.qrImgUrls ?
                  <Box sx={{borderTop:'1px solid #eaeaea', marginTop:'10px'}}>
                    <Box style={styles.paymentLabel}>Payment QR</Box>
                    <ImageLoader props={{imgUrl: userData.payments.qrImgUrls[0], styles : styles.prodImg}} />
                  </Box> : null
                }
                
              </> : null
            }
          </Box>

        </Paper>
                
      </Box>
      </>
    }
    </>
  )
}

export default MyCard
