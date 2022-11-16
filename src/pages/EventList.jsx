import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from "react-router-dom"
import ComponentLoader from '../components/ComponentLoader'
import { getEventList } from '../services/api'
import { Button, Box } from '@mui/material'


function EventList() {

  const [eventList, setEventList] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    getEventList(location.state.uid).then((response) => {
      setEventList(response)
      setLoading(false)
    })
  }, [])

  return (
    <>
      {
        loading ? <ComponentLoader /> :
        <Box p={2}>
          <h2>Please select an event</h2>
          {
            eventList?.length ?
              <Box>
                {
                  eventList.map((event) => {
                    return (
                      <Button onClick={() => navigate(`/postersList/${event.id}`, {state : event})}
                        key={event.id}
                        fullWidth
                        sx={{marginTop:'3vh'}}
                        variant='contained'>
                        {event.name}
                      </Button>)
                  })
                }
              </Box>
              :
              <Box>
                No Events Found
              </Box>
          }
        </Box>
      }
    </>
  )
}

export default EventList
