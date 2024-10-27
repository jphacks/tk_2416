"use client";

import { Box, Typography, TextField, Slider, Button, Stack } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 修正: next/navigation からインポート
import { Header1 } from '@/components/header1';

import { setUserName, calculateBaseStamina, storeMentionsInfo } from './settingapi.tsx'; // API関数をインポート

const NextButton = ({ onClick }) => {
  return (
    <Button 
      variant="contained" 
      color="primary" 
      onClick={onClick}
    >
      次へ
    </Button>
  );
};


export default function Setting() {
  const router = useRouter(); // useRouter フックを使用
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [strength, setStrength] = useState(50);
  const [userId, setUserId] = useState(''); // ユーザーIDの状態を追加

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setStrength(newValue as number);
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called');
    try {
      const userResponse = await setUserName(name);
      console.log('User response:', userResponse); // ここでレスポンスを確認
  
      if (!userResponse || userResponse.error) {
        throw new Error('User name could not be set');
      }
  
      const newUserId = userResponse.userid;
      setUserId(newUserId);
  
      const staminaResponse = await calculateBaseStamina(newUserId, strength);
      console.log('Stamina response:', staminaResponse); // ここでレスポンスを確認
  
      const mentionsResponse = await storeMentionsInfo(newUserId, description);
      console.log('Mentions response:', mentionsResponse); // ここでレスポンスを確認
  
      router.push('/aloneHome');
    } catch (error) {
      console.error('Error submitting data:', error);
      alert(`エラーが発生しました: ${error.message}`);
    }
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

     


          <TextInput hint="名前!!" />

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
        <NextButton onClick={handleSubmit} />
      </Stack>
    </Box>
  );
}
