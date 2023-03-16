import React, { useState, useContext } from 'react'
import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import ShareIcon from '@mui/icons-material/Share';
import { useNavigate } from 'react-router-dom'
import StyleIcon from '@mui/icons-material/Style';
import { AuthContext } from '../contexts/AuthContext'
import GroupsIcon from '@mui/icons-material/Groups';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { CommonContext } from '../contexts/CommonContext';
import Paper from '@mui/material/Paper';
import { Box} from '@mui/material'
import Activities from './Activities';


function BottomNavBar() {
  const [activeIndex, setActiveIndex] = useState(0)
  const {showPopup} = useContext(CommonContext)
  const {getUserId} = useContext(AuthContext)

  const navigate    = useNavigate()
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, height:'7vh' }} elevation={3}>
    <BottomNavigation
      value={activeIndex}
      onChange={(event, newIndex) => {
        setActiveIndex(newIndex)
        switch (newIndex) {
          case 0:
            navigate("/")
            break;
          case 1:
            navigate("/network")
            // navigate("/mycard/"+getUserId())
            break;
          case 2:
            showPopup(<Activities />)
            break;
          case 3:
            navigate("/apps")
            break;
          // case 3:
          //   console.log("Share")
          //   break;
          case 4:
            navigate("/profile")
            break;
          default:
            break;
        }
      }}
      showLabels>
      <BottomNavigationAction label="Home" icon={<HomeIcon />}/> 
      {/* <BottomNavigationAction label="Card" icon={<StyleIcon />}/>  */}
      <BottomNavigationAction label="Network" icon={<GroupsIcon />}/> 
      <BottomNavigationAction label="New" icon={<AddCircleOutlineIcon />} />
      <BottomNavigationAction label="Apps" icon={<AutoAwesomeMosaicIcon />}/> 
      {/* <BottomNavigationAction label="Share" icon={<ShareIcon />}/>  */}
      <BottomNavigationAction label="Profile" icon={<PersonIcon />}/>
    </BottomNavigation>
    </Paper>
  )
}

export default BottomNavBar
