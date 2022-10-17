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
}));

function UpdateProducts() {

  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const { register, handleSubmit, control, reset, formState : {errors} } = useForm()
  const [userData, setUserData] = useState({})
  const {getUserId} = useContext(AuthContext)
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)
  const [productImgUrl, setProductImgUrl] = useState('')

  useEffect(() => {
    getUserData(getUserId()).then((response => {
      setUserData(response)
      setLoading(false)
    }))
  }, [])

  async function handleProductImgUpload(e) {
    showLoader()
    const fileName = `prod-${getUserId()}-${Date.now()}.jpg`
    uploadImage(await e.target.files[0].arrayBuffer(), e.target.files[0], fileName, 'products').then((downloadUrl) => {
      hideLoader()
      setProductImgUrl(downloadUrl)
      if (userData.products)
        userData.products[0].imgUrls = [downloadUrl]
      else  
        userData.products = [{imgUrls : [downloadUrl]}]
    })
  }
  
  function onFormSubmit(data) {

    if (productImgUrl || (userData.products && userData.products.imgUrls))
      data.imgUrls = [productImgUrl || userData.products[0].imgUrls[0]]

    const productsData = {
      products : [data]
    } 
    showLoader()
    updateUserData(productsData, getUserId()).then(async()=> {
      hideLoader()
      showSnackbar('Products data updated successfully !')
    }).catch(async() => {
      hideLoader()
      showSnackbar('Failed to update products data', 'error')
    })
  }

  return (
    <>
      {
        loading ? <ComponentLoader /> :
        <Box p={2} className={classes.whiteBg}>
          <h2 className={classes.center}>Update Products & Services</h2>
          <form onSubmit={handleSubmit(onFormSubmit)}>

            <Box mb={3}>
              <TextField
                placeholder="Enter product name"
                label="Product Name"
                variant="outlined"
                fullWidth
                defaultValue={userData.products ? userData.products[0].name : ''}
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
                placeholder="Enter product description"
                label="Product Description"
                variant="outlined"
                fullWidth
                defaultValue={userData.products ? userData.products[0].description : ''}
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

            <Box mb={3}>
              <Button
                variant="contained"
                component="label">
                Upload product image
                <input
                  onChange={handleProductImgUpload}
                  type="file"
                  hidden
                />
              </Button>
            </Box>

            <Box mb={3}>
                {
                  userData.products && userData.products[0].imgUrls ?
                  <ImageLoader props={{imgUrl: (productImgUrl || userData.products[0].imgUrls[0]), className : classes.prodImg}} />
                  : null
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

export default UpdateProducts
