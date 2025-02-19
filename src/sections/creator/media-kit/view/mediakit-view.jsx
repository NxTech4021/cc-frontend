import { m } from 'framer-motion';
import React, { useMemo, useState, useEffect, useCallback } from 'react';

import {
  Box,
  Stack,
  Avatar,
  Button,
  Divider,
  useTheme,
  Container,
  Typography,
  ListItemText,
  CircularProgress,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { useSocialMediaData } from 'src/utils/store';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import MediaKitSetting from '../media-kit-setting';
import MediaKitSocial from './media-kit-social-view';

const MediaKitCreator = () => {
  const theme = useTheme();
  const smDown = useResponsive('down', 'sm');
  const { user } = useAuthContext();
  const setTiktok = useSocialMediaData((state) => state.setTiktok);
  const setInstagram = useSocialMediaData((state) => state.setInstagram);
  const tiktok = useSocialMediaData((state) => state.tiktok);
  const instagram = useSocialMediaData((state) => state.instagram);
  const isLoading = useBoolean();
  const instaLoading = useBoolean();

  const [currentTab, setCurrentTab] = useState('tiktok');
  const [openSetting, setOpenSetting] = useState(false);

  const getInstagram = useCallback(async () => {
    instaLoading.onTrue();
    const res = await axiosInstance.get(endpoints.creators.social.instagram(user?.id));
    setInstagram(res.data);
    instaLoading.onFalse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setInstagram]);

  const getTiktok = useCallback(async () => {
    isLoading.onTrue();
    const res = await axiosInstance.get(endpoints.creators.social.tiktok(user?.id));
    setTiktok(res.data);
    isLoading.onFalse();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTiktok]);

  // const { data: socialData, isLoading } = useSWR(
  //   endpoints.creators.social.tiktok(user.id),
  //   fetcher,
  //   {
  //     revalidateIfStale: false,
  //     revalidateOnFocus: false,
  //     onSuccess: (data) => {
  //       setTiktok(data);
  //     },
  //   }
  // );

  // const { data: instaData, isLoading: instaLoading } = useSWR(
  //   endpoints.creators.social.instagram(user.id),
  //   fetcher,
  //   {
  //     revalidateIfStale: false,
  //     revalidateOnFocus: false,
  //     onSuccess: (data) => {
  //       setInstagram(data);
  //     },
  //   }
  // );

  const calculateEngagementRate = useCallback((totalLikes, followers) => {
    if (!(totalLikes || followers)) return null;
    return ((parseInt(totalLikes, 10) / parseInt(followers, 10)) * 100).toFixed(2);
  }, []);

  const socialMediaAnalytics = useMemo(() => {
    if (currentTab === 'instagram') {
      return {
        followers: instagram?.user?.followers_count || 0,
        engagement_rate: `${
          calculateEngagementRate(
            instagram?.contents?.reduce((sum, acc) => sum + parseInt(acc.like_count, 10), 0),
            instagram?.user?.followers_count
          ) || 0
        }%`,
        averageLikes: instagram?.user?.average_like || 0,
        username: instagram?.user?.username,
      };
    }

    if (currentTab === 'tiktok') {
      return {
        followers: tiktok?.user?.data?.user?.follower_count || 0,
        engagement_rate: tiktok?.user?.data?.user?.follower_count || 0,
        averageLikes: tiktok?.user?.data?.user?.likes_count || 0,
      };
    }

    return {
      followers: 0,
      engagement_rate: 0,
      averageLikes: 0,
    };
  }, [currentTab, tiktok, instagram, calculateEngagementRate]);

  const handleClose = () => {
    setOpenSetting(!openSetting);
  };

  useEffect(() => {
    getInstagram();
    getTiktok();
  }, [getInstagram, getTiktok]);

  if (isLoading.value || instaLoading.value) {
    return (
      <Box position="absolute" top="50%" left="50%">
        <CircularProgress
          thickness={7}
          size={25}
          sx={{
            color: theme.palette.common.black,
            strokeLinecap: 'round',
          }}
        />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="start" justifyContent="space-between">
        <Avatar
          sx={{
            width: 100,
            height: 100,
          }}
          src={user?.photoURL}
        />

        {!smDown && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Button
              startIcon={<Iconify icon="solar:settings-linear" />}
              variant="outlined"
              sx={{
                color: 'black',
              }}
              onClick={() => {
                setOpenSetting(true);
              }}
            >
              Settings
            </Button>
          </Box>
        )}
      </Stack>
      <Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: theme.typography.fontSecondaryFamily,
              fontWeight: 100,
            }}
          >
            {user?.creator?.mediaKit?.displayName ?? user?.name}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" color="text.secondary">
            {user?.creator?.pronounce}
          </Typography>
          <Iconify icon="mdi:dot" color="text.secondary" />
          <Typography variant="body2" color="text.secondary">
            {user?.country}
          </Typography>
          <Iconify icon="mdi:dot" color="text.secondary" />
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </Stack>
      </Stack>
      <Typography variant="subtitle2" my={1}>
        {user?.creator?.mediaKit?.about}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1} mb={2} flexWrap="wrap">
        {user?.creator?.interests.map((interest) => (
          <Label
            key={interest?.id}
            sx={{
              border: 1,
              height: 30,
              borderColor: '#EBEBEB',
              boxShadow: '0px -3px 0px 0px #E7E7E7 inset',
              bgcolor: 'white',
            }}
          >
            {interest.name.toUpperCase()}
          </Label>
        ))}
      </Stack>

      {smDown && (
        <Box my={1}>
          <Button
            fullWidth
            startIcon={<Iconify icon="lucide:edit" width={20} />}
            sx={{ border: 1, borderColor: '#E7E7E7', boxShadow: '0px -3px 0px 0px #E7E7E7 inset' }}
            onClick={() => {
              setOpenSetting(true);
            }}
          >
            Edit Profile
          </Button>
        </Box>
      )}

      {smDown ? (
        <>
          <Divider sx={{ my: 1.5 }} />
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Followers */}
            <Box
              sx={{
                width: 1,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  right: 0,
                  height: '80%',
                  width: '2px',
                  backgroundColor: '#EBEBEB',
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                <Avatar
                  sx={{
                    bgcolor: '#8A5AFE',
                    width: 35,
                    height: 35,
                  }}
                >
                  <Iconify icon="ic:sharp-people-alt" width={20} />
                </Avatar>

                <Typography variant="subtitle1">{socialMediaAnalytics.followers}</Typography>
              </Stack>
            </Box>

            {/* Engagement rate */}
            <Box
              sx={{
                width: 1,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  right: 0,
                  height: '80%',
                  width: '2px',
                  backgroundColor: '#EBEBEB',
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                <Avatar
                  sx={{
                    bgcolor: '#026D54',
                    width: 35,
                    height: 35,
                  }}
                >
                  <Iconify icon="mage:chart-up-fill" width={20} />
                </Avatar>
                <Typography variant="subtitle1">{socialMediaAnalytics.engagement_rate}</Typography>
              </Stack>
            </Box>

            {/* Average likes */}
            <Box
              sx={{
                width: 1,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="center">
                <Avatar
                  sx={{
                    bgcolor: '#FF3500',
                    width: 35,
                    height: 35,
                  }}
                >
                  <Iconify icon="hugeicons:play-list-favourite-02" width={20} />
                </Avatar>
                <Typography variant="subtitle1">{socialMediaAnalytics.averageLikes}</Typography>
              </Stack>
            </Box>
          </Stack>
          <Divider sx={{ my: 1.5 }} />
        </>
      ) : (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="stretch"
          spacing={2}
          flexWrap={{ xs: 'wrap', md: 'nowrap' }}
          sx={{
            borderTop: 1,
            borderBottom: 1,
            borderColor: '#EBEBEB',
            py: 2,
          }}
        >
          {/* Followers */}
          <Box
            sx={{
              width: 1,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                right: 0,
                height: '80%',
                width: '2px',
                backgroundColor: '#EBEBEB',
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar
                sx={{
                  bgcolor: '#8A5AFE',
                  width: 60,
                  height: 60,
                }}
              >
                <Iconify icon="ic:sharp-people-alt" width={30} />
              </Avatar>
              <ListItemText
                primary="FOLLOWERS"
                secondary={
                  socialMediaAnalytics.followers
                  // socialMediaAnalytics.followers
                  //   ? formatNumber(socialMediaAnalytics.followers)
                  //   : 'No data'
                }
                primaryTypographyProps={{
                  variant: 'caption',
                  color: 'text.secondary',
                  fontWeight: 600,
                }}
                secondaryTypographyProps={{
                  variant: 'h3',
                  color: 'black',
                  key: currentTab,
                  component: m.div,
                  initial: { scale: 0.5 },
                  animate: { scale: 1 },
                  transition: {
                    duration: 1,
                    type: 'spring',
                  },
                  lineHeight: 1,
                }}
              />
            </Stack>
          </Box>

          {/* Engagement rate */}
          <Box
            sx={{
              width: 1,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                right: 0,
                height: '80%',
                width: '2px',
                backgroundColor: '#EBEBEB',
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar
                sx={{
                  bgcolor: '#026D54',
                  width: 60,
                  height: 60,
                }}
              >
                <Iconify icon="mage:chart-up-fill" width={30} />
              </Avatar>
              <ListItemText
                primary="ENGAGEMENT RATE"
                secondary={socialMediaAnalytics.engagement_rate}
                // secondary={
                //   socialMediaAnalytics.engagement_rate
                //     ? `${Number(socialMediaAnalytics.engagement_rate).toFixed(2)}%`
                //     : 0
                // }
                primaryTypographyProps={{
                  variant: 'caption',
                  color: 'text.secondary',
                  fontWeight: 600,
                }}
                secondaryTypographyProps={{
                  variant: 'h3',
                  color: 'black',
                  key: currentTab,
                  component: m.div,
                  initial: { scale: 0.5 },
                  animate: { scale: 1 },
                  transition: {
                    duration: 1,
                    type: 'spring',
                  },
                  lineHeight: 1,
                }}
              />
            </Stack>
          </Box>

          {/* Average likes */}
          <Box
            sx={{
              width: 1,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar
                sx={{
                  bgcolor: '#FF3500',
                  width: 60,
                  height: 60,
                }}
              >
                <Iconify icon="hugeicons:play-list-favourite-02" width={30} />
              </Avatar>
              <ListItemText
                primary="AVERAGE LIKES"
                secondary={
                  socialMediaAnalytics.averageLikes
                  // tiktok?.user?.data?.user?.likes_count || 0
                  // socialMediaAnalytics.averageLikes
                  //   ? formatNumber(socialMediaAnalytics.averageLikes)
                  //   : 'No data'
                }
                primaryTypographyProps={{
                  variant: 'caption',
                  color: 'text.secondary',
                  fontWeight: 600,
                }}
                secondaryTypographyProps={{
                  variant: 'h3',
                  color: 'black',
                  key: currentTab,
                  component: m.div,
                  initial: { scale: 0.5 },
                  animate: { scale: 1 },
                  transition: {
                    duration: 1,
                    type: 'spring',
                  },
                  lineHeight: 1,
                }}
              />
            </Stack>
          </Box>
        </Stack>
      )}

      <Divider sx={{ my: 3 }} />
      {/* Bottom View */}

      <Typography fontWeight={400} fontFamily="Instrument Serif" fontSize="40px">
        Top Content {socialMediaAnalytics?.username && `of ${socialMediaAnalytics?.username}`}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1} my={2} color="text.secondary">
        <Button
          variant="outlined"
          startIcon={<Iconify icon="mdi:instagram" width={20} />}
          sx={{
            boxShadow: '0px -3px 0px 0px #E7E7E7 inset',
            ...(currentTab === 'instagram' && {
              color: theme.palette.mode === 'light' ? '#1340FF' : '#4e70ff',
              boxShadow: 'none',
            }),
          }}
          onClick={() => setCurrentTab('instagram')}
        >
          Instagram
        </Button>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="ic:baseline-tiktok" width={20} />}
          sx={{
            boxShadow: '0px -3px 0px 0px #E7E7E7 inset',
            ...(currentTab === 'tiktok' && {
              color: theme.palette.mode === 'light' ? '#1340FF' : '#4e70ff',
              boxShadow: 'none',
            }),
          }}
          onClick={() => setCurrentTab('tiktok')}
        >
          Tiktok
        </Button>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="mdi:partnership" width={20} />}
          sx={{
            boxShadow: '0px -3px 0px 0px #E7E7E7 inset',
            ...(currentTab === 'partnerships' && {
              color: theme.palette.mode === 'light' ? '#1340FF' : '#4e70ff',
              boxShadow: 'none',
            }),
          }}
          onClick={() => setCurrentTab('partnerships')}
        >
          Partnerships
        </Button>
      </Stack>

      <MediaKitSocial currentTab={currentTab} />
      <MediaKitSetting open={openSetting} handleClose={handleClose} user={user} />
    </Container>
  );
};

export default MediaKitCreator;
