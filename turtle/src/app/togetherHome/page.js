import * as React from 'react';

import { Header2} from "@/components/header2";
import { NextButton } from "@/components/nextButton";
import { SettingButton } from '@/components/settingButton';
import { TextButton } from '@/components/textButton';
import { Header1 } from '@/components/header1';
import { Header2 } from '@/components/header2';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import NormalTurtle from '../../components/normalTurtle';
import Setting from '../setting/page';
import Head from 'next/head';

export default function TogetherHome() {

  function restFunction(){
    console.log("rested")
  }

  return (

          <Box
            sx={{
                width: '390px',
                height: '844px',
                margin: 'auto',
                border: '1px solid #ddd',
                overflow: 'auto',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                position: 'relative',
                backgroundColor: '#f9f4e8'
            }}
        >
          

          <Header1 text="お出かけ中"/>

          <Header2 text="6人"/>

          <NormalTurtle/>
          <TextButton text = "休憩する" onClick={restFunction} />


        </Box>
  );
}