import * as React from 'react';

import { Header2} from "@/components/header2";
import { NextButton } from "@/components/nextButton";
import { SettingButton } from '@/components/settingButton';
import { TextButton } from '@/components/textButton';
import { Header1 } from '@/components/header1';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import NormalTurtle from '../../components/normalTurtle';
import Setting from '../setting/page';
import Head from 'next/head';

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
                    <TextInput hint="グループID" />
                    <NextButton url="togetherHome"/>
            </Stack>
       
            </Stack>
            </Container>
  );
}