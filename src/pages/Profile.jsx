import React, {useContext, useEffect, useState} from 'react'
import { Button, Box, Paper , Grid} from '@mui/material'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getUserData } from '../services/api'
import ComponentLoader from '../components/ComponentLoader'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ImageLoader from '../components/ImageLoader'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const styles = {
  userCard : {
    display:'flex',
    flexDirection:'column'
  },
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
  menuItem: {
    padding:'10px', 
    display:'flex',
    alignItems:'center',
    justifyContent:'space-between'
  },
  center : {
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    marginTop:'0px'
  }
}

function Profile() {

  const {logout} = useContext(AuthContext)
  const navigate = useNavigate()
  const [userData, setUserData] = useState({})
  const {getUserId} = useContext(AuthContext)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserData(getUserId()).then((response => {
      setUserData(response)
      setLoading(false)
    }))
  }, [])

  function changePassword() {
    navigate('/changePassword')
  }

  return (
    <>
    {
      loading ? <ComponentLoader /> :
      <>
      <Box p={2}>
        <h2 style={styles.center}>My Profile</h2>
        <Paper style={styles.userCard}>
          <div style={styles.profilePicCont}> 
            {
              userData?.profilePicUrl ?
              <ImageLoader props={{imgUrl:userData.profilePicUrl, styles:styles.profilePic}}/>
               :
              <AccountCircleIcon style={styles.defIcon}/>
            }
          </div>

          <Box sx={{p:2}}>
            <Box sx={{mb:1, mt:1,}}>
              <b>Name : </b> {userData.userName}
            </Box>
            <Box sx={{mb:1, mt:1,}}>
              <b>Email : </b> {userData.email}
            </Box>
            <Box sx={{mb:1, mt:1,}}>
              <b>Mobile : </b> {userData.mobileNo}
            </Box>
            <Box sx={{mb:1}}>
              <b>Profile completion status : </b> {userData.profileCompletion || '0'}%
            </Box>
            <Box sx={{display:'flex'}}>
              {/* <Button variant="outlined" size="medium" onClick={() => changePassword()} sx={{mr:3}}>
                Change Password
              </Button> */}
              <Button variant="outlined" size="medium" onClick={() => logout()}>
                Logout
              </Button>
            </Box>
          </Box>
        
        </Paper>
      </Box>
      <Box p={2} >
        <h3>Update Profile Details</h3>
          <Grid  columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} mb={2}>
              <Paper style={styles.menuItem} onClick={() => navigate("/updatePersonalDetails")}>
                <span>
                  Personal Details
                </span>
                <NavigateNextIcon />
              </Paper>
            </Grid>
            <Grid item xs={12} mb={2}>
              <Paper style={styles.menuItem} onClick={() => navigate("/UpdateCompanyDetails")}>
                <span>Company Details</span> 
                <NavigateNextIcon />
              </Paper>
            </Grid>
            <Grid item xs={12} mb={2}>
              <Paper style={styles.menuItem} onClick={() => navigate("/UpdateProducts")}>
                <span>Products & Services</span> 
                <NavigateNextIcon />
              </Paper>
            </Grid>
            <Grid item xs={12} mb={2}>
              <Paper style={styles.menuItem} onClick={() => navigate("/updateSocialMedia")}>
                <span>Social Media Links</span> 
                <NavigateNextIcon />
              </Paper>
            </Grid>
            <Grid item xs={12} mb={2}>
              <Paper style={styles.menuItem} onClick={() => navigate("/UpdateGallery")}>
                <span>Gallery</span>
                <NavigateNextIcon />
              </Paper>
            </Grid>
            <Grid item xs={12} mb={2}>
              <Paper style={styles.menuItem} onClick={() => navigate("/UpdatePayments")}>
                <span>Payment Details</span>
                <NavigateNextIcon />
              </Paper>
            </Grid>
           
          </Grid>
        </Box>
      </>
      
    }
    </>
  )
}

export default Profile
