import React, {useContext, useEffect, useState} from 'react'
import { Button, Box, Paper , FormControl, InputLabel, MenuItem, Select, Modal } from '@mui/material'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import ComponentLoader from '../components/ComponentLoader'
import { getNetwork } from '../services/api'
import { CommonContext } from '../contexts/CommonContext'
import ImageLoader from '../components/ImageLoader'
import CallIcon from '@mui/icons-material/Call';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';

const styles = {
  center : {
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    marginTop:'0px'
  },
  contactItem : {
    margin:'5px 0',
    fontSize:'15px',
    wordBreak:'break-all'
  },
  cardPic : {
    borderRadius:'10px',
    width:'25vw',
    height:'70px',
    border:'1px solid #eaeaea'
  },
  circleIcon : {
    padding:'5px',
    borderRadius:'10px',
    border:'1px solid grey',
    marginRight:'20px'
  },
  modalStyle : {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4
  },
  modalCardPic : {
    width:'90vw'
  }
}


export const categoryMap = {
  'IT' : 'IT',
  'REAL_ESTATE' : 'Real Estate',
  'EDUCATION' : 'Education',
  'OTHERS' : 'Others'
}

function Network() {

  const [loading, setLoading] = useState(true)
  const {getUserId} = useContext(AuthContext)
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)
  const [contacts, setContacts] = useState([])
  const [category, setCategory] = useState('')
  const navigate = useNavigate()
  const [photoModal, setPhotoModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [filteredContacts, setFilteredContacts] = useState(null)

  useEffect(() => {
    getNetwork(getUserId()).then((contacts) => {
      setContacts(contacts)
      setFilteredContacts(contacts)
      setLoading(false)
    }).catch((error) => {
      showAlert("Something went wrong")
    })
  }, [])

  const scanDocument = (() => {
    navigate("/cardScanner")
  })

  function callMe(number) {
    window.open(`tel:${number}`, '_self');
  }

  function whatsappMe(number) {
    window.open(`https://wa.me/91${number}`, '_blank')
  }

  function mailMe(mailId) {
    window.open(`mailto:${mailId}`)
  }

  const filterCategory = (category) => {
    setCategory(category)
    setFilteredContacts(contacts.filter((contact) => contact.category == category))
  }

  const viewCardImg = (contact) => {
    setSelectedContact(contact)
    setPhotoModal(true)
  }

  return (
    <>
      {
        loading ? <ComponentLoader /> :
        <>
        <Modal
          open={photoModal}
          onClose={() => setPhotoModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
            <Box style={styles.modalStyle}>
              <ImageLoader
              props={{imgUrl:selectedContact?.cardImgUrl, styles:styles.modalCardPic}} >

              </ImageLoader>
            </Box>
        </Modal>
        <Box p={2}>
          <h2 style={styles.center}>My Network</h2>
          <Box>

            <Button variant="contained" onClick={scanDocument} fullWidth 
              sx={{margin:'10px 0'}}>
              Scan New Card
            </Button>

            <FormControl 
              sx={{margin:'10px 0', width:'50vw'}}>  
              <InputLabel id="demo-select-small">Filter Contacts</InputLabel>
                <Select
                  value={category}
                  labelId="demo-select-small"
                  placeholder="Category"
                  required
                  onChange={(e) => filterCategory(e.target.value)}
                  label="Category">
                  <MenuItem value={'IT'}>IT & Software</MenuItem>
                  <MenuItem value={'REAL_ESTATE'}>Real Estate</MenuItem>
                  <MenuItem value={'EDUCATION'}>Education</MenuItem>
                  <MenuItem value={'OTHERS'}>Others</MenuItem>
                </Select>
              </FormControl>

          </Box>
   
          {
            filteredContacts.length ? 
            <Box>
              {
                filteredContacts.map((contact, index) => {
                  return(
                    <Box key={index}>
                      <Paper 
                      sx={{padding:1, margin:'10px 0', display:'flex'}}>
                        <Box sx={{display:'flex', flexDirection:'column'}}>
                          <Box sx={{display:'flex'}}>
                            <Box sx={{width:'60vw'}}>
                              <Box style={styles.contactItem}>
                                {contact?.userName}
                              </Box>
                              <Box style={styles.contactItem}>
                                {contact?.mobileNo}
                              </Box>
                              <Box style={styles.contactItem}>
                                {
                                  contact?.email ? 
                                  contact.email : null
                                }
                              </Box>
                              <Box style={styles.contactItem}>
                                {
                                  contact?.website ? 
                                  contact.website : null
                                }
                              </Box>
                              <Box style={styles.contactItem}>
                                {categoryMap[contact?.category]}
                              </Box>
                            </Box>
                            <Box sx={{width:'25vw', display:'flex', alignItems:'center', justifyContent:'center'}}
                              onClick={() => viewCardImg(contact)}>
                              <ImageLoader
                      
                              props={{imgUrl:contact.cardImgUrl, styles:styles.cardPic}} >

                              </ImageLoader>
                            </Box>
                          </Box>
                          <Box>
                            <Box sx={{display:'flex', justifyContent:'start', marginTop:'10px'}}>
                              {
                                contact.mobileNo ? 
                                <CallIcon style={styles.circleIcon} onClick={() => callMe(contact.mobileNo)}/> : null
                              }

                              {
                                contact.mobileNo ? 
                                <WhatsAppIcon style={styles.circleIcon} onClick={() => whatsappMe(contact.mobileNo)}/> : null
                              }

                              {
                                contact.email ? 
                                <EmailIcon style={styles.circleIcon} onClick={() => mailMe(contact.email)}/> : null
                              }
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                    </Box>
                  )
                })
              }
            </Box> :
            <Box>
              <h4>No contacts found. Scan visiting cards and add contacts</h4>
            </Box>
          }
        </Box>
        </>
      }
    </>
  )
}

export default Network
