"use client"

import * as React from 'react';

import Modal from '@mui/material/Modal';
import { NextButton } from "@/components/nextButton";
import { Header1 } from '@/components/header1';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import NormalTurtle from '../../components/normalTurtle';
import { TextInput } from '@/components/textInput';
import HealthPopup from '../../features/statePopup';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: 24,
    p: 4,
  };

export default function JoinGroup() {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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

                    <NextButton onClick={handleOpen}/>
                    <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    >

                    <Box sx={style} >
                        <HealthPopup/>
                    </Box>


                    </Modal>

            </Stack>
       
            </Stack>
            </Container>
  );
}