import React from 'react'
import { Button, Box, Card, Paper, Grid, makeStyles } from '@mui/material'
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import ShareIcon from '@mui/icons-material/Share';

const styles = {
  meetingCont : {
    padding:'10px',
    marginBottom:'10px'
  },
  dottedCont : {
    borderLeft: '2px dashed black',
    height: '25px',
    marginLeft:'44vw',
    marginBottom:'10px'
  }
}

function ActionItem(props) {
  
  const openMeetLink = (meetLink) => {
    window.open(meetLink, '_blank')
  }

  return (<>  
    {
      props.actionType == 'MEETING' ?
        <>
        {
          props.index == 0 ? null : 
          <div style={styles.dottedCont}></div>
        }
        <Paper style={styles.meetingCont}>
          <Box sx={{display:'flex', justifyContent:'center'}}>
            <Box sx={{background:'#eaeaea', padding:'5px 30px', width:'fit-content', borderRadius:'5px'}}>
              {new Date(props.fromTs).toLocaleTimeString()}
            </Box>
          </Box>
          <Box sx={{fontSize:'25px', margin:'5px'}}>
            {props.title} 
          </Box>
          <Box sx={{display:'flex', alignItems:'center'}}>
            <Box sx={{margin:'5px'}}>
              <FiberManualRecordRoundedIcon sx={{fontSize:'10px', marginRight:'5px'}}/>
              {props.duration} Mins
            </Box>
            <Box>
              - {props.meetingType}
            </Box>
          </Box>
          {
            props.description ? 
              <Box sx={{margin:'5px'}}>
                <FiberManualRecordRoundedIcon sx={{fontSize:'10px', marginRight:'5px'}}/>
                {props.description}
              </Box> : null
          }
          <Box sx={{borderTop:'1px solid #eaeaea', paddingTop:'5px', marginTop:'10px', display:'flex', justifyContent:'space-between'}}>
            <Button onClick={() => openMeetLink(props.meetLink)}>
              <ShareIcon sx={{marginRight:'5px', fontSize:'15px'}} />
              Share Event
            </Button>

            {
              props.meetLink ? 
              <Button onClick={() => openMeetLink(props.meetLink)} variant='contained'>
                Join Meet
              </Button> : null
            }
          </Box>
        </Paper>
        </>
      :
      ''
    }
  
  </>
      
  )
}

export default ActionItem
