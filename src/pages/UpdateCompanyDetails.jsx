import React,  {useContext, useEffect, useState} from 'react'
import ComponentLoader from '../components/ComponentLoader'
import { TextField, Button, Box, Card, Paper, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { makeStyles } from "@mui/styles";
import { useForm, Controller } from "react-hook-form";
import { getUserData, updateUserData, uploadImage } from '../services/api'
import { AuthContext } from '../contexts/AuthContext';
import { CommonContext } from '../contexts/CommonContext';
import ImageLoader from '../components/ImageLoader';

const useStyles = makeStyles((theme) => ({
  center : {
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
  },
  // whiteBg : {
  //   background:'white !important',
  //   height:'-webkit-fill-available'
  // },
  prodImg: {
    height:'30vw',
    width:'30vw'
  }
}))

function UpdateCompanyDetails() {

  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const { register, handleSubmit, control, reset, formState : {errors} } = useForm()
  const [userData, setUserData] = useState({})
  const {getUserId} = useContext(AuthContext)
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)
  const [companyLogoUrl, setcompanyLogoUrl] = useState('')


  useEffect(() => {
    getUserData(getUserId()).then((response => {
      setUserData(response)
      setLoading(false)
    }))
  }, [])

  async function handleCompanyLogoUpload(e) {
    showLoader()
    const fileName = `company-${getUserId()}-${Date.now()}.jpg`
    uploadImage(await e.target.files[0].arrayBuffer(), e.target.files[0], fileName, 'companies').then((downloadUrl) => {
      hideLoader()
      setcompanyLogoUrl(downloadUrl)
      if (userData.companies)
        userData.companies[0].logo = downloadUrl
      else 
        userData.companies = [{logo:downloadUrl}]
    })
  }

  function onFormSubmit(data) {

    if (companyLogoUrl || (userData.companies && userData.companies[0].logo))
      data.logo = (companyLogoUrl || userData.companies[0].logo)

    const companyData = {
      companies : [data]
    } 
    showLoader()
    updateUserData(companyData, getUserId()).then(async()=> {
      hideLoader()
      showSnackbar('Company details updated successfully !')
    }).catch(async() => {
      hideLoader()
      showSnackbar('Failed to update company details', 'error')
    })
  }

  return (
    <>
      {
        loading ? <ComponentLoader /> :
        <Box p={2} className={classes.whiteBg}>
          <h2 className={classes.center}>Update Company Details</h2>
          <form onSubmit={handleSubmit(onFormSubmit)}>

            <Box mb={3}>
              <TextField
                placeholder="Enter company name"
                label="Company Name"
                variant="outlined"
                fullWidth
                defaultValue={userData.companies ? userData.companies[0].name : ''}
                name="name"
                {...register("name", {
                  required: "Required field"
                })}
                error={Boolean(errors?.name)}
                helperText={errors?.name?.message}
              />
            </Box>

            <Box mb={3}>
              <TextField
                placeholder="Enter company description"
                label="Company Description"
                variant="outlined"
                fullWidth
                defaultValue={userData.companies ? userData.companies[0].description : ''}
                name="description"
                multiline
                rows={4}
                {...register("description",{
                  required: "Required field"
                })}
                error={Boolean(errors?.description)}
                helperText={errors?.description?.message}
              />
            </Box>

            <h4>Company Logo</h4>

            <Box mb={3}>
              <Button
                variant="contained"
                component="label">
                Upload Company Logo
                <input
                  onChange={handleCompanyLogoUpload}
                  type="file"
                  hidden
                />
              </Button>
            </Box>

            <Box mb={3}>
              {
                userData.companies && userData.companies[0].logo ?
                <ImageLoader props={{imgUrl: (companyLogoUrl || userData.companies[0].logo), className : classes.prodImg}} /> : null
              }
            </Box>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Save 
          </Button>
        </form>
        </ Box>
      }
    </>
  )
}

export default UpdateCompanyDetails
