/* eslint-disable jsx-a11y/media-has-caption */
import { mutate } from 'swr';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import React, { useState, useCallback } from 'react';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Button, Typography } from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFUpload, RHFTextField } from 'src/components/hook-form';

const CampaignFinalDraft = ({ campaign, timeline, submission }) => {
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [taskId, setTimelineId] = useState('');
  const methods = useForm({
    defaultValues: {
      caption: '',
    },
  });

  const { handleSubmit, setValue, reset } = methods;

  const handleRemoveFile = () => {
    setValue('draft', '');
    setPreview('');
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      setPreview(newFile.preview);

      if (file) {
        setValue('draft', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const onSubmit = handleSubmit(async (value) => {
    setLoading(true);
    const formData = new FormData();
    const newData = { ...value, campaignId: campaign.id, taskId };
    formData.append('data', JSON.stringify(newData));
    formData.append('finalDraftVideo', value.draft);
    try {
      const res = await axiosInstance.post(endpoints.campaign.draft.submitFinalDraft, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      enqueueSnackbar(res.data.message);
      mutate(endpoints.campaign.creator.getCampaign(campaign.id));
      reset();
      setPreview('');
    } catch (error) {
      enqueueSnackbar('Failed to submit draft', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  });

  return (
    <Box>
      {timeline?.status === 'PENDING_REVIEW' && (
        <Box component={Card} position="relative" p={10}>
          <Stack gap={1.5} alignItems="center">
            <Iconify icon="ic:sharp-pending-actions" color="success.main" width={40} />
            <Typography variant="subtitle2" color="text.secondary">
              Your submission is in review
            </Typography>
          </Stack>
        </Box>
      )}
      {timeline?.status === 'IN_PROGRESS' && (
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack gap={2}>
            {preview ? (
              <Box>
                {/* // eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video autoPlay controls width="100%" style={{ borderRadius: 10 }}>
                  <source src={preview} />
                </video>
                <Button color="error" variant="outlined" size="small" onClick={handleRemoveFile}>
                  Change Video
                </Button>
              </Box>
            ) : (
              <RHFUpload
                name="draft"
                type="video"
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
              />
            )}
            <RHFTextField name="caption" placeholder="Caption" multiline />
            <LoadingButton
              loading={loading}
              variant="contained"
              type="submit"
              onClick={() => setTimelineId(timeline.id)}
            >
              Submit Final Draft
            </LoadingButton>
          </Stack>
        </FormProvider>
      )}
      {/* {timeline?.status === 'CHANGES_REQUIRED' && (
        <>
          <Box textAlign="center">
            {submission && (
              <video autoPlay controls width="80%" style={{ borderRadius: 10 }}>
                <source src={submission && submission?.firstDraft?.draftURL} />
              </video>
            )}
          </Box>
          <Box p={2}>
            <Typography variant="h6">Changes Required</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {submission?.feedback?.content}
            </Typography>
          </Box>
        </>
      )} */}
    </Box>
  );
};

export default CampaignFinalDraft;

CampaignFinalDraft.propTypes = {
  campaign: PropTypes.object,
  timeline: PropTypes.object,
  submission: PropTypes.object,
};
