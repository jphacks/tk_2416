
import * as React from 'react';

import { Header2} from "@/components/header2";
import { NextButton } from "@/components/nextButton";

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Typography } from "@mui/material";
import Stack from '@mui/material/Stack';
import NormalTurtle from '../../components/normalTurtle';

export default function Intro() {
  return (
    <Container sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f9f4e8',
    }}>
      <Stack spacing={2}>

      <Typography
          variant="h3"
          sx={{ color: '#5a3824', fontWeight: 'bold', mb: 2 }}
        >
          turtle stamina
        </Typography>
        
        <NormalTurtle/>
        <Header2 text="友達の体力を把握して旅行を楽しもう！"/>
        <NextButton url="setting" />
      </Stack>
    </Container>
  );
}

