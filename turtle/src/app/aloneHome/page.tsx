
import * as React from 'react';

import { TextButton } from '@/components/textButton';
import { Header1 } from '@/components/header1';

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import NormalTurtle from '../../components/normalTurtle';

export default function aloneHome() {
  return (

    <Container sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9f4e8',
      }}>
        
        <Stack spacing={5} >

          <Header1 text="お出かけ待機中"/>

          <NormalTurtle/>

        
            <Stack spacing={2} sx={{ '& button': { m: 1 } }}>
                    <TextButton url="joinGroup" text = "グループに参加"/>
                    <TextButton url="invitePeople" text = "グループを作る"/>
            </Stack>
       
            </Stack>
            </Container>
  );
}