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

function BottomNavBar() {
  const [activeIndex, setActiveIndex] = useState(0)
  const {getUserId} = useContext(AuthContext)

  const navigate    = useNavigate()
  return (
    <BottomNavigation sx={{width:'100%', position:'absolute', bottom:0, height:'7vh'}}
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
            navigate("/apps")
            break;
          // case 3:
          //   console.log("Share")
          //   break;
          case 3:
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
      <BottomNavigationAction label="Apps" icon={<AutoAwesomeMosaicIcon />}/> 
      {/* <BottomNavigationAction label="Share" icon={<ShareIcon />}/>  */}
      <BottomNavigationAction label="Profile" icon={<PersonIcon />}/>
    </BottomNavigation>
  )
}

export default BottomNavBar
