import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from "react-router-dom"
import ComponentLoader from '../components/ComponentLoader'
import { Button, Box } from '@mui/material'
import { getPosters } from '../services/api'
import ImageLoader from '../components/ImageLoader'

const styles = {
  posterImg : {
    width:'90vw',
    height : '40vh',
    marginBottom:'20px',
    borderRadius:'10px'
  }
}

function PostersList() {

  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [posters, setPosters] = useState([])

  useEffect(() => {
    getPosters(`categories/${location.state.catId}/events/${location.state.uid}/posters`).then((resp) => {
      setPosters(resp)
      setLoading(false)
    })
  }, [])

  function navToPreview(props) {
    console.log("=====props====", props)
    navigate('/posterPreview',{state:props})
  }

  return (
    <>
    {
      loading ? <ComponentLoader /> :
      <Box p={2}>   
        <h2>Please select a template</h2>
        {
          posters.length ?
          posters.map((poster) => { return (
            <div onClick={() => navToPreview(poster)} >
              <ImageLoader key={poster.uid}  props={{imgUrl:poster.sampleImgUrl, styles:styles.posterImg}} />
            </div>)
          }) :
          <h2>No Posters Found</h2>
        }
      </Box>
    }
      
    </>
  )
}

export default PostersList
