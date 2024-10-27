
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

export default function aloneHome() {
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
           <Setting/>

          <Header1 text="お出かけ待機中"/>
          <NormalTurtle/>

            <Box
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
            >
                <Stack spacing={2} sx={{ '& button': { m: 1 } }}>
                    <TextButton url="" text = "グループに参加"/>
                    <TextButton url="" text = "グループを作る"/>
                </Stack>
            </Box>

        </Box>
  );
}