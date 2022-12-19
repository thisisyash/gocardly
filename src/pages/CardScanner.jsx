import React, { useContext, useState, useEffect } from 'react'

import { Capacitor } from '@capacitor/core'
import { DocumentScanner } from 'capacitor-document-scanner'
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import Tesseract from 'tesseract.js';
import { Box } from '@mui/system';
import { useForm } from 'react-hook-form';
import { CommonContext } from '../contexts/CommonContext';
import { addContact, uploadImage } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Filesystem } from '@capacitor/filesystem';

const styles = {
  image : {
    width:'80vw',
    maxHeight:'50vh'
  },
  scannerCont : {
    background:'white',
    height:'-webkit-fill-available'
  }
}

function CardScanner() {

  const [showForm, setShowForm] = useState(false)
  const { register, handleSubmit, control, reset, formState : {errors} } = useForm()
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)
  const [defContact, setDefContact] = useState({})
  const {getUserId} = useContext(AuthContext)
  const navigate = useNavigate()
  const [category, setCategory] = useState('')
  const [scannedImgSrc, setScannedImgSrc] = useState(null)

  useEffect(() => {

    async function getDocument() {
        const { scannedImages } = await DocumentScanner.scanDocument({
          maxNumDocuments: 1,
          responseType:'base64'
        })

        showLoader("AI is scanning card. Please wait...")   

        setScannedImgSrc(_base64ToArrayBuffer(scannedImages))

        const scannedImage = document.getElementById('scannedImage')
        scannedImage.src = `data:image/png;base64,${scannedImages}`
        Tesseract.recognize(
          _base64ToArrayBuffer(scannedImages),
          'eng',
          { logger: m => console.log(m) }
        ).then(({ data: { text } }) => {
          setDefContact(getContactDetails(text))
          setShowForm(true)
          hideLoader()
        })
    }

    if (Capacitor.getPlatform != 'web') getDocument()
  }, [])

  function extractEmails(text) {
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)
  }

  function extractWebsite(text) {
    return text.match(/(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi)
  }

  function extractMobile(text) {
    return text.match(/(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g)
  }

  function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

  const getContactDetails = (text) => {
    return {
      mobileNo : extractMobile(text)?.length ?  extractMobile(text)[0].trim() : null,
      email : extractEmails(text)?.length ? extractEmails(text)[0].trim() : null,
      websiteLink: extractWebsite(text)?.length ? extractWebsite(text)[0].trim() : null
    }
  }

  const onSaveContact = async(data) => {


    //Code to save contact to device
    // const contact = {
    //   givenName : 'Wammo',
    //   phoneNumbers: [{number : '8182828282', label:'primary'}],
    //   emailAddresses: [{label:'emailLabel', address : 'email@email.com'}],
    //   organizationName : 'website link'
    // }
    // const resp = Contacts.saveContact(contact)


    showLoader()
    const fileName = `visitingcard-${getUserId()}-${Date.now()}.png`
    uploadImage(scannedImgSrc, {type:'image/png'}, fileName, 'contactcards').then((downloadUrl) => {
      const contact = {
        userName : data.userName,
        mobileNo : data.mobileNo,
        email  : data.email,
        website : data.websiteLink,
        cardImgUrl : downloadUrl,
        userId : getUserId(),
        category:category,
        timeStamp : Date.now()
      }
      addContact(contact).then(() => {
        hideLoader()
        showSnackbar("Contact added successfully !")
        navigate(-1)
      }).catch(() => {
        showAlert("Some error occured")
      })
    })
  }

  return (
    <Box p={2} style={styles.scannerCont}>
      <Box p={2} sx={{display:'flex', justifyContent:'center'}}>
        <img id="scannedImage" style={styles.image}>
        </img>
      </Box>
      {
        showForm ? 
        <Box>
           <form onSubmit={handleSubmit(onSaveContact)}>
          <Box mb={3} mt={2}>
            <TextField
              placeholder="Contact Name"
              label="Full Name"
              variant="outlined"
              fullWidth
              focused
              autoComplete='off'
              defaultValue={defContact.contactName}
              name="userName"
              {...register("userName", {
                required: "Required field"
              })}
              error={Boolean(errors?.userName)}
              helperText={errors?.userName?.message}
            />
          </Box>
          
          <Box mb={3}>
            <TextField
              placeholder="Contact Number"
              label="Mobile Number"
              variant="outlined"
              fullWidth
              autoComplete='off'
              name="mobileNo"
              defaultValue={defContact?.mobileNo}
              color={defContact?.mobileNo ? 'success' : null}
              focused
              {...register("mobileNo", {
                required: "Required field",
                pattern: {
                  value: /^[7896]\d{9}$/,
                  message: "Invalid mobile number",
                },
              })}
              error={Boolean(errors?.mobileNo)}
              helperText={errors?.mobileNo?.message}
            />
          </Box>

          <Box mb={3}>
            <TextField
            
              placeholder="Contact Email"
              label="Email ID"
              variant="outlined"
              fullWidth
              focused
              autoComplete='off'
              color={defContact?.email ? 'success' : null}
              defaultValue={defContact?.email}
              name="email"
              {...register("email", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              error={Boolean(errors?.email)}
              helperText={errors?.email?.message}
            />
          </Box>


          <Box mb={3}>
            <TextField
              placeholder="Website Link"
              label="Website link"
              variant="outlined"
              fullWidth
              focused
              defaultValue={defContact?.websiteLink}
              color={defContact?.websiteLink ? 'success' : null}
              name="websiteLink"
              {...register("websiteLink",{
              pattern: {
                value: /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/i,
                message: "Invalid url pattern",
              }})}
              error={Boolean(errors?.websiteLink)}
              helperText={errors?.websiteLink?.message}
            />
            </Box>

          {/* <Box mb={3}>
            <TextField
              placeholder="Enter company name"
              label="Company Name"
              variant="outlined"
              fullWidth
              defaultValue={defContact?.companyName}
              name="companyName"
            />
          </Box> */}

          <Box>
            <FormControl fullWidth>  
            <InputLabel id="demo-select-small">Category</InputLabel>
              <Select
                value={category}
                labelId="demo-select-small"
                placeholder="Category"
                required
                onChange={(e) => setCategory(e.target.value)}
                label="Category">
                <MenuItem value={'IT'}>IT & Software</MenuItem>
                <MenuItem value={'REAL_ESTATE'}>Real Estate</MenuItem>
                <MenuItem value={'EDUCATION'}>Education</MenuItem>
                <MenuItem value={'OTHERS'}>Others</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Button type="submit" variant="contained" color="primary" fullWidth 
            sx={{marginTop:2}}>
            Save Contact
          </Button>

        </form>
        </Box> :
        <Box>

        </Box>
      }
    </Box>
  )
}

export default CardScanner
