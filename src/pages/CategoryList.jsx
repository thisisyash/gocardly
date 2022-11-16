import React, { useContext, useEffect, useState } from 'react'
import ComponentLoader from '../components/ComponentLoader'
import { CommonContext } from '../contexts/CommonContext'
import { getPosterCategories } from '../services/api'
import { Button, Box, Card, Paper, Grid, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import '../App.css'

const styles = {
  appCenter : {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    marginTop:'8px',
    flexDirection:'column'
  }
}

function CategoryList() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)

  useEffect(() => {
    getPosterCategories().then((resp) => {
      setCategories(resp)
      setLoading(false)
    })
  }, [])

  return (
    <>
      {
        loading ? <ComponentLoader /> :
        <Box p={2}>
          <h2>Please select a category</h2>
          {
            categories?.length ?
              <div style={styles.appCenter}>
                {
                  categories.map((category) => {
                    return (
                      <Button onClick={() => navigate(`/eventList/${category.id}`, {state : category })}
                        key={category.id}
                        fullWidth
                        sx={{marginTop:'3vh'}}
                        variant='contained'>
                        {category.name}
                      </Button>
                    )
                  })
                }
              </div>
              :
              <Box>
                No Categories Found
              </Box>
          }
        </Box>
      }
    </>
  )
}

export default CategoryList
