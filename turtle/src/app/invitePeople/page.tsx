import * as React from 'react';

import { Header1 } from '@/components/header1';
import { Header3 } from '@/components/header3';

import { NextButton } from "@/components/nextButton";
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import NormalTurtle from '../../components/normalTurtle';


import { TextInput } from '@/components/textInput';

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
                <Stack direction="row" >
                    <Header3 text="グループID" />
                    <TextInput hint="" />
                </Stack>
                    

                    <NextButton url="togetherHome"/>
            </Stack>
       
            </Stack>
            </Container>
  );
}