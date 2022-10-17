import React, {useContext, useEffect, useState} from 'react'
import ComponentLoader from '../components/ComponentLoader'
import { AuthContext } from '../contexts/AuthContext'
import { getAppointments } from '../services/api'
import { Button, Box, Paper, TextField, Grid} from '@mui/material'
import { makeStyles } from "@mui/styles";


const useStyles = makeStyles((theme) => ({
  apptCont : {
    display:'flex',
    padding:'10px',
    margin:'10px',
    flexDirection:'column'
  },

  apptLabel: {
    fontSize:'15px',
    marginTop:'10px',
    fontWeight:'280'
  },

  center : {
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
  }
}));

function Appointments() {

  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState({})
  const {getUserId} = useContext(AuthContext)

  useEffect(() => {
    getAppointments(getUserId()).then((response => {
      setAppointments(response)
      setLoading(false)
      console.log(response)
    }))
  }, [])

  return (
    <>
    {
      loading ? 
      <ComponentLoader /> :
      <Box>
        <h2 className={classes.center}>Appointments</h2>
        {
          appointments.map((appointment, index) => {
            return <Paper key={index} className={classes.apptCont}>
              <Box>
                <Box className={classes.apptLabel}>Appointment ID</Box>
                <Box> {appointment.appntId.slice(0,5).toUpperCase()} </Box>
              </Box>

              <Box>
                <Box className={classes.apptLabel}>Client Name</Box>
                <Box> {appointment.userName} </Box>
              </Box>

              <Box>
                <Box className={classes.apptLabel}>Client Number</Box>
                <Box> {appointment.mobileNo} </Box>
              </Box>

              <Box>
                <Box className={classes.apptLabel}>Appointment Date & Time</Box>
                <Box> {appointment.time || 'N/A'} </Box>
              </Box>
          
            </Paper>
          })
        }
      </Box>
    }
    </>
  )
}

export default Appointments
