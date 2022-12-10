import React from 'react'
import { Button, Box, Card, Paper, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import CollectionsIcon from '@mui/icons-material/Collections';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import GroupsIcon from '@mui/icons-material/Groups';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

const styles = {
  contentCard : {
    height:120,
    width:125,
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    padding:10
  },
  cardIcon : {
    fontSize:25,
    textAlign:'center'
  },
  center : {
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    marginTop:'0px'
  }
}

function AppsPage() {
  const navigate = useNavigate()

  return (
    <Box p={2}>
        <h2 style={styles.center}>Apps</h2>
        <Grid container spacing={3} justifyContent="center">

          <Grid item xs>
            <Paper style={styles.contentCard} onClick={() => navigate('/appointments')}>
              <span style={styles.cardIcon}>
                <BookOnlineIcon fontSize='large' />
              </span>
                
              <Button>
                Appointments
              </Button>
            </Paper>
          </Grid>

          <Grid item xs>
            <Paper style={styles.contentCard} onClick={() => navigate('/enquiries')}>
              <span style={styles.cardIcon}>
                <RecordVoiceOverIcon fontSize='large' />
              </span>
                
              <Button>
                Enquiries
              </Button>
            </Paper>
          </Grid>

          <Grid item xs>
            <Paper style={styles.contentCard} onClick={() => navigate('/themes')}>
              <span style={styles.cardIcon}>
                <ColorLensIcon fontSize='large' />
              </span>
                
              <Button>
                Themes
              </Button>
            </Paper>
          </Grid>

          <Grid item xs>
            <Paper style={styles.contentCard} onClick={() => navigate('/posterCategories')}>
              <span style={styles.cardIcon}>
                <CollectionsIcon fontSize='large' />
              </span>
                
              <Button>
                Poster Maker
              </Button>
            </Paper>
          </Grid>

          <Grid item xs>
            <Paper style={styles.contentCard} onClick={() => navigate('/contentCreator')}>
              <span style={styles.cardIcon}>
                <DriveFileRenameOutlineIcon fontSize='large' />
              </span>
                
              <Button>
                Content Creator
              </Button>
            </Paper>
          </Grid>
          
          {/* <Grid item xs>
            <Paper style={styles.contentCard}>
              <span style={styles.cardIcon}>
                <ShoppingCartIcon fontSize='large' />
              </span>
                
              <Button>
                E-commerce
              </Button>
            </Paper>
          </Grid> */}
{/* 
          <Grid item xs>
            <Paper style={styles.contentCard}>
              <span style={styles.cardIcon}>
                <QuestionAnswerIcon fontSize='large' />
              </span>
                
              <Button>
                Chatbot
              </Button>
            </Paper>
          </Grid> */}

          {/* <Grid item xs>
            <Paper style={styles.contentCard}>
              <span style={styles.cardIcon}>
                <ViewInArIcon fontSize='large' />
              </span>
                
              <Button>
                AR/VR
              </Button>
            </Paper>
          </Grid> */}

          <Grid item xs>
            <Paper style={styles.contentCard} onClick={() => navigate('/network')}>
              <span style={styles.cardIcon}>
                <GroupsIcon fontSize='large' />
              </span>
                
              <Button>
                Network
              </Button>
            </Paper>
          </Grid>

        </Grid>
    </Box>
  )
}

export default AppsPage
