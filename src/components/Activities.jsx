import React, { useState, useContext } from 'react'
import { Button, Box, Card, Paper, Grid, makeStyles } from '@mui/material'
import taskImg from '../assets/task.png'
import meetingImg from '../assets/meeting.png'
import leadImg from '../assets/lead.png'
import followupImg from '../assets/followup.png'
import { useNavigate } from 'react-router-dom';
import { CommonContext } from '../contexts/CommonContext';

const styles = {
  actCont : {
    width:'70vw',
    display:'flex',
    flexDirection:'column',
    padding:'4vw'
  },
  actItem : {
    width:'40%',
    display:'flex',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    fontSize:'1.1rem'
  },
  actBox : {
    display:'flex',
    justifyContent:'space-evenly',
    marginBottom:'20px',
    marginTop:'10px'
  },
  logoImg : {
    width:'3.2rem',
    height:'3.2rem',
    marginBottom:'10px'
  }
}

function Activities() {

  const navigate = useNavigate()
  const {hidePopup} = useContext(CommonContext)

  const handleClick = (index) => {
    switch(index) {
      case 1:
        navigate("/addAppointment")
        hidePopup()
        break
      case 2:
        navigate("/addAppointment")
        break
      case 3:
        navigate("/addAppointment")
        break
      case 4:
        navigate("/addAppointment")
        break
      default:
        break
    }
  }

  return (
    <>
      <Box style={styles.actCont}>
        <Box style={styles.actBox}>
          <Box style={styles.actItem} onClick={() => handleClick(1)}>
            <img src={meetingImg} style={styles.logoImg}/>
            Appointment
          </Box>
          <Box style={styles.actItem}>
            <img src={taskImg} style={styles.logoImg}/>
            Task
          </Box>
        </Box>
        <Box style={styles.actBox}>
          <Box style={styles.actItem}>
            <img src={followupImg} style={styles.logoImg}/>
            Follow Up
          </Box>
          <Box style={styles.actItem}>
            <img src={leadImg} style={styles.logoImg}/>
            Lead
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Activities
