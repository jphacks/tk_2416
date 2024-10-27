"use client"

import { Box, Typography, TextField, Slider, Button, Stack } from '@mui/material';
//import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState } from 'react';

import { Header1 } from '@/components/header1';
import { NextButton } from "@/components/nextButton";

export default function Setting() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [strength, setStrength] = useState(50);

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    setStrength(newValue as number);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#fff7e6',
      }}
    >
     
    
        <Stack spacing={3} mt={3}>

            <Header1 text="あなたについて教えてください。" />

          <TextField
            label="名前"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              style: { borderColor: '#5a3824', borderRadius: 8 },
            }}
          />

          <TextField
            label="特別体質など"
            variant="outlined"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            InputProps={{
              style: { borderColor: '#5a3824', borderRadius: 8 },
            }}
          />

          <Box>
            <Typography sx={{ color: '#5a3824', mb: 1 }}>
              平均と比べた体力
            </Typography>
            <Slider
              value={strength}
              onChange={handleSliderChange}
              min={0}
              max={100}
              sx={{
                color: '#5a3824',
                height: 8,
                '& .MuiSlider-thumb': {
                  width: 24,
                  height: 24,
                  backgroundColor: '#5a3824',
                },
                '& .MuiSlider-track': {
                  borderRadius: 4,
                },
              }}
            />
          </Box>
          <NextButton url="aloneHome" />
         
        </Stack>
      
    </Box>
  );
}