import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { grey } from '@mui/material/colors';
import {
  Box,
  Stack,
  Dialog,
  Typography,
  IconButton,
  DialogTitle,
  ListItemText,
  DialogContent,
} from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import AvatarIcon from 'src/components/avatar-icon/avatar-icon';

import CampaignPitchTextModal from './pitch/pitch-text-modal';
import CampaignPitchVideoModal from './pitch/pitch-video-modal';

const CampaignPitchOptionsModal = ({ open, handleClose, campaign, text, video }) => {
  const smUp = useResponsive('sm', 'down');
  const { user } = useAuthContext();

  const hasDraft = useMemo(
    () => campaign?.draftPitch && campaign.draftPitch.find((item) => item.userId === user?.id),
    [campaign, user]
  );
  const handlePitchClick = () => {
    handleClose();
    if (hasDraft) {
      text.onTrue();
    } else {
      // Open the pitch options
      // (This is the existing functionality when clicking "Pitch Yourself")
    }
  };

  return (
    <>
      <Dialog open={open} fullScreen={smUp} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">How would you like to pitch yourself? 👀</Typography>
            <IconButton onClick={handleClose}>
              <Iconify icon="hugeicons:cancel-01" width={20} />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'center' }}
            gap={2}
            pb={4}
            mt={1}
          >
            <Box
              sx={{
                border: 1,
                p: 2,
                borderRadius: 2,
                borderColor: grey[100],
                transition: 'all .2s ease',
                width: { xs: '100%', sm: 'auto' },
                '&:hover': {
                  borderColor: grey[700],
                  cursor: 'pointer',
                  transform: 'scale(1.05)',
                },
              }}
              component="div"
              onClick={() => {
                handleClose();
                text.onTrue();
              }}
            >
              <AvatarIcon icon="solar:document-bold" />
              <ListItemText
                sx={{
                  mt: 2,
                }}
                primary="Letter Pitch"
                secondary="Write a short letter on how you’d be fit for the campaign!"
                primaryTypographyProps={{
                  variant: 'body1',
                  fontWeight: 'bold',
                  gutterBottom: 1,
                }}
                secondaryTypographyProps={{
                  color: 'text.secondary',
                  lineHeight: 1.2,
                }}
              />
            </Box>
            <Box
              sx={{
                border: 1,
                p: 2,
                borderRadius: 2,
                borderColor: grey[100],
                transition: 'all .2s ease',
                width: { xs: '100%', sm: 'auto' },
                '&:hover': {
                  borderColor: grey[700],
                  cursor: 'pointer',
                  transform: 'scale(1.05)',
                },
              }}
              onClick={() => {
                handleClose();
                video.onTrue();
              }}
            >
              <AvatarIcon icon="akar-icons:video" />
              <ListItemText
                sx={{
                  mt: 2,
                }}
                primary="Video Pitch"
                secondary="Record a short video message on how you’d fit for the campaign!"
                primaryTypographyProps={{
                  variant: 'body1',
                  fontWeight: 'bold',
                  gutterBottom: 1,
                }}
                secondaryTypographyProps={{
                  color: 'text.secondary',
                  lineHeight: 1.2,
                }}
              />
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>
      <CampaignPitchTextModal open={text.value} handleClose={text.onFalse} campaign={campaign} />
      <CampaignPitchVideoModal open={video.value} handleClose={video.onFalse} campaign={campaign} />
    </>
  );
};

export default CampaignPitchOptionsModal;

CampaignPitchOptionsModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  campaign: PropTypes.object,
  text: PropTypes.object,
  video: PropTypes.object,
};
