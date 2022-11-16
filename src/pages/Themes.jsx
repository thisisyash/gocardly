import React, { useContext, useEffect, useState } from 'react'
import ComponentLoader from '../components/ComponentLoader'
import { CommonContext } from '../contexts/CommonContext'
import { Button, Box, Card, Paper, Grid, TextField } from '@mui/material'
import { getThemes, updateUserData } from '../services/api'
import ImageLoader from '../components/ImageLoader'
import { AuthContext } from '../contexts/AuthContext'

const styles = {
  themeTitle : {
    fontSize:'25px',
    fontWeight:'bold'
  },
  themeImg : {
    width:'100%',
    maxHeight:'50vh'
  }
}

function Themes() {

  const [loading, setLoading] = useState(true)
  const [themes, setThemes]   = useState(null)
  const {getUserId} = useContext(AuthContext)
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)

  useEffect(() => {
    getThemes().then((resp) => {
      setThemes(resp)
      setLoading(false)
    })
  }, [])

  const selectTheme = (theme) => {
    showLoader()
    updateUserData({theme : theme.theme||{}, activeTheme:theme.id}, getUserId()).then(() => {
      hideLoader()
      showSnackbar("Theme updated successfully")
    }).catch((error) => {
      hideLoader()
      showAlert("Failed to update theme. Please try again later.")
    })
  }

  return (
    <>
      {
        loading ? <ComponentLoader /> :
        <Box p={2}>
          {
            themes.length ?
            <Box>
            <Grid container spacing={3} justifyContent="center">
              {
                themes.map((theme) => {
                  return (
                    <Grid item xs key={theme.id}>
                      <Paper sx={{padding:2, textAlign:'center'}}>
                        <span style={styles.themeTitle}>
                          {theme.name}
                        </span>
                        <ImageLoader props={{imgUrl: theme.sampleImg, styles : styles.themeImg}}/>
                        <Button variant="contained"
                          sx={{marginTop:3}}
                          onClick={() => selectTheme(theme)}>
                          Select
                        </Button>
                      </Paper>
                    </Grid>
                  )
                })
              }
            </Grid>
          </Box>:
          <Box>
            No themes found.
          </Box>
          }
        </Box>
      }
    </>
  )
}

export default Themes
