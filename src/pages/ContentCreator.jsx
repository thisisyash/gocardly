import React, { useContext, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { CommonContext } from '../contexts/CommonContext';
import { TextField, Button, Box, Card, Paper, Grid } from '@mui/material'

const { Configuration, OpenAIApi } = require("openai");

const styles = {
  center : {
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
  }
}

function ContentCreator() {

  const [genText, setGenText] = useState('')
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)
  const { register, handleSubmit, control, reset, formState : {errors} } = useForm()
  const [showResult, setShowResult] = useState(false)
  const [query, setQuery] = useState('')

  const configuration = new Configuration({
    apiKey:  process.env.REACT_APP_OPENAPI_KEI
  })

  const openai = new OpenAIApi(configuration);

  const getText = async(data) => {
    showLoader("AI is generating content. Please wait...")
    setQuery(data.query)
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: data.query,
      max_tokens: 500
    })
    setGenText(response.data.choices[0].text)
    hideLoader()
    setShowResult(true)
    showSnackbar("Content generated successfully !")
  }

  const newQuery = () => {
    setGenText('')
    setQuery('')
    setShowResult(false)
    reset()
  }

  const copyResult = () => {
    navigator.clipboard.writeText(genText).then(function() {
      showSnackbar("Content copied to clipboard")
    }, function(err) {
      showSnackbar("Failed to copy to clipboard")
    })
  }

  return (
    <>
      <h2 style={styles.center}>AI Content Creator</h2>
      {
        showResult ? 
        <Box p={2}>
          <Paper p={2}>
            <Box sx={{border:'1px solid #eaeaea', padding:'20px', textAlign:'justify', whiteSpace:'pre-wrap'}}>
              {query} :
              {genText}
            </Box> 
            <Box sx={{display:'flex', padding:'10px', justifyContent:'space-evenly'}}>
              <Button variant="outlined" onClick={() => newQuery()}>
                New Query
              </Button>
              <Button variant="contained" onClick={() => copyResult()}>
                Copy Content
              </Button>
            </Box>
          </Paper>
        </Box> : 
        <Box p={2}>
          <form onSubmit={handleSubmit(getText)}>
            <Box mb={3}>
              <TextField
                placeholder="Enter query"
                label="Query"
                variant="outlined"
                fullWidth
                name="query"
                multiline
                rows={4}
                {...register("query", {
                  required: "Required field",
                  pattern: {
                    value: /^(?:(?:^| )\S+ *){3,}$/,
                    message: "Please enter atleast three words in query",
                  }
                })}
                error={Boolean(errors?.query)}
                helperText={errors?.query?.message}
              />
            </Box>

            <Button type="submit" variant="contained" fullWidth>Generate</Button>
          </form> 
        </Box>
      }
    </>
  )
}

export default ContentCreator
