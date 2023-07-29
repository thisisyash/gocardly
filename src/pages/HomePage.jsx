import React, {useContext, useEffect, useState} from 'react'
import { Button, Box, Card, Paper, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { getLanding, getUserData } from '../services/api'
import { AuthContext } from '../contexts/AuthContext'
import ComponentLoader from '../components/ComponentLoader'
import gocardlylogo from '../assets/gocardly.png'
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { CommonContext } from '../contexts/CommonContext'
import ActionItem from '../components/ActionItem'

const styles = {
  contentCard : {
    height:130,
    width:150,
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-around',
    padding:10
  },

  infoCard : {
    height:100,
    marginBottom:10,
    display:'flex',
    flexDirection:'column',
    alignItems:'start',
    justifyContent:'space-between',
    padding:20
  },

  countText: {
    fontSize:30,
    textAlign:'center',
    fontWeight:'bold'
  },
  statusText: {
    fontSize:23,
    textAlign:'center',
    fontWeight:'bold'
  },
  logoImg :{
    height: '100px',
    width:'-webkit-fill-available'
  },
  center : {
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
  },
  anCont : {
    display:'flex',
    alignItems:'center',
    justifyContent:'space-between',
    width:'100%'
  }

}

function HomePage() {

  const navigate = useNavigate()
  const [userData, setUserData] = useState({})
  const {getUserId} = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)
  const [actionData, setActionData] = useState({})

  useEffect(() => {
    const params = {
      uid       : getUserId(),
      timeStamp : Date.now()
    }
    getLanding(params).then((response => {

      setUserData(response.userData)
      
      if (response.actionData.length)
        setActionData(sortActionData(response.actionData))
      setLoading(false)
    })).catch((error) => {
      console.log(error)
      showAlert(error.error)
    })
  }, [])

  function sortActionData(actionItems) {
    actionItems.sort((a, b) => parseFloat(a.fromTs) - parseFloat(b.fromTs));
    return actionItems
  }

  function shareCard() {
    if (navigator.share) {
      navigator.share({
        title: 'Tykoon',
        text: 'Check out my digital visiting card created from Tykoon.io',
        url: process.env.REACT_APP_DOMAIN_URL+'card/'+userData.userUrlId,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(process.env.REACT_APP_DOMAIN_URL+'card/'+userData.userUrlId).then(function() {
        showSnackbar("Card url copied to clipboard")
      }, function(err) {
        showSnackbar("Card url copied to clipboard")
      })
    }
  }

  return (
    <>
    {
      loading ? <ComponentLoader /> :
      <Box p={2}>
        <Paper sx={{marginBottom:2}}>
          <img src={gocardlylogo} style={styles.logoImg}/>
        </Paper>
        <Box>
          <Paper style={styles.infoCard}>
            
            <span>
              Welcome, {userData.userName}
            </span>
            <Box style={styles.anCont}>
              <Box onClick={() => navigate('/analytics')}>
                <Box style={styles.countText}>
                  {userData.views || 0}
                </Box>
                <Box>
                  Card Views
                </Box>
              </Box>

              <Box onClick={() => navigate('/enquiries')}>
                <Box style={styles.countText}>
                  {userData.enquiriesCount || 0}
                </Box>
                <Box>
                  Enquiries
                </Box>
              </Box>

              <Box onClick={() => navigate('/appointments')}>
                <Box style={styles.countText}>
                  {userData.appointmentsCount || 0}
                </Box>
                <Box>
                  Appointments
                </Box>
              </Box>
            </Box>
            {/* <span>
              Profile completion status : {userData.profileCompletion || 0}%
            </span>
            <div>
              <Button variant="outlined" color="primary" onClick={() => navigate('/profile')}>
                Update Profile
              </Button>
              <Button variant="outlined" color="primary" sx={{marginLeft:2}} onClick={() => navigate("/mycard/"+getUserId())}>
                View Card
              </Button>
            </div> */}
          </Paper>
        </Box>

        <Box>
          <p>Today's Events</p>
          {
            actionData.length ? 
            <Box>
              {
                actionData.map((event, index) => {
                  return(
                    <ActionItem {...event} {...{index : index}} key={index} />
                  )
                })
              }
            </Box>
            :
            <Box>
              No Events Today
            </Box>
          }
        </Box>

{/* 
        <Grid container spacing={3} justifyContent="center">

          <Grid item xs>
            <Paper style={styles.contentCard}>
              <span>
                Card Status 
              </span>
         
              {
                userData.isPremium ?
                <Box sx={{...styles.center,  color:'green'}}>
                  <CheckIcon  fontSize='large'/>
                </Box>
                 :
                <Button onClick={() => navigate('/buy-premium')}>
                  Buy Premium
                </Button>
              }
              <span style={styles.statusText}>
                {userData.isActive ? 'Active' : 'In-Active'}
              </span>
            </Paper>
          </Grid>

          <Grid item xs>
            <Paper style={styles.contentCard}>
              <span>
                Card Views
              </span>
              <span style={styles.countText}>
                {userData.views || 0}
              </span>
              <Button onClick={() => navigate('/analytics')}>
                Analyze
              </Button>
            </Paper>
          </Grid>

          <Grid item xs>
            <Paper style={styles.contentCard}>
              <span>
                Enquiries
              </span>
              <span style={styles.countText}>
                {userData.enquiriesCount || 0}
              </span>
              <Button onClick={() => navigate('/enquiries')}>
                View Enquiries
              </Button>
            </Paper>
          </Grid>

          <Grid item xs>
            <Paper style={styles.contentCard}>
              <span>
                Appointments
              </span>
              <span style={styles.countText}>
                {userData.appointmentsCount || 0}
              </span>
              <Button onClick={() => navigate('/appointments')}>
                View Bookings
              </Button>
            </Paper>
          </Grid>

        </Grid> */}
        {/* <Box style={styles.center} pt={2}>
          <Button sx={{height:'40px'}} variant='contained' onClick={shareCard}>
            Share My Card
          </Button>
        </Box> */}
        <Box style={styles.center} pt={2}>
          <Button sx={{height:'40px'}} variant='contained' onClick={shareCard}>
            Share Card
          </Button>
        </Box>
      </Box>
    }
   </>
  )
}

export default HomePage
