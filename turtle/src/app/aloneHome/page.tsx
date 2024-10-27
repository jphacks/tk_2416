
import * as React from 'react';

import { Header2} from "@/components/header2";
import { NextButton } from "@/components/nextButton";

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Typography } from "@mui/material";
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
            }}
        >
            {/* 設定ボタン */}
            <IconButton aria-label="Settings" sx={{ position: 'absolute', top: 10, left: 10 }}>
                <SettingsIcon sx={{ fontSize: 50 }} />
            </IconButton>

            {/* 現在の状況 */}
            <Typography variant="body1" sx={{ fontSize: 32, fontWeight: 'Bold', textAlign: 'center', mt: 12, width: '359px' }}>
                お出かけ待機中
            </Typography>


            {/* カメ表示 */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 5 }}>
                <img src={turtleImage} alt="Turtle" style={{ width: '211px', height: '318px' }} />
            </Box>


            {/* グループ参加/作成ボタン */}
            <Box
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
            >
                <Stack spacing={2} sx={{ '& button': { m: 1 } }}>
                    <Button variant="contained" size="large" sx={{ width: '262px', height: '55px' }}>
                        グループに参加
                    </Button>
                    <Button variant="contained" size="large" sx={{ width: '262px', height: '55px' }}>
                        グループを作る
                    </Button>
                </Stack>
            </Box>

        </Box>
