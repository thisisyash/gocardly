import React, {useContext, useEffect, useState} from 'react'
import ComponentLoader from '../components/ComponentLoader'
import { AuthContext } from '../contexts/AuthContext'
import { getEnquiries } from '../services/api'
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

function Enquiries() {

  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const [enquiries, setEnquiries] = useState({})
  const {getUserId} = useContext(AuthContext)

  useEffect(() => {
    getEnquiries(getUserId()).then((response => {
      setEnquiries(response)
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
        <h2 className={classes.center}>Enquiries</h2>
        {
          enquiries.map((appointment, index) => {
            return <Paper key={index} className={classes.apptCont}>
              <Box>
                <Box className={classes.apptLabel}>Enquiry ID</Box>
                <Box> {appointment.enqId.slice(0,5).toUpperCase()} </Box>
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
                <Box className={classes.apptLabel}>Query</Box>
                <Box> {appointment.description || 'N/A'} </Box>
              </Box>
          
            </Paper>
          })
        }
      </Box>
    }
    </>
  )
}

export default Enquiries
