import React from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';

import {
  Box,
  Card,
  Stack,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import EmptyContent from 'src/components/empty-content/empty-content';

const Agreement = ({ campaign, submission, creator }) => {
  const modal = useBoolean();
  const methods = useForm({
    defaultValues: {
      feedback: '',
    },
  });
  // const campaignTasks = creator?.user?.campaignTasks.filter(
  //   (task) => task?.campaignId === campaign.id
  // );

  const { reset, handleSubmit } = methods;

  const handleClick = async () => {
    try {
      const res = await axiosInstance.patch(endpoints.submission.admin.agreement, {
        campaignId: campaign?.id,
        status: 'approve',
        userId: creator?.user?.id,
        submissionId: submission?.id,
      });
      enqueueSnackbar(res?.data?.message);
    } catch (error) {
      enqueueSnackbar('Faileddsadsa', {
        variant: 'error',
      });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await axiosInstance.patch(endpoints.submission.admin.agreement, {
        campaignId: campaign?.id,
        status: 'reject',
        userId: creator?.user?.id,
        campaignTaskId: submission?.campaignTask?.id,
        // firstDraftId: campaignTasks.filter((value) => value.task === 'First Draft')[0]?.id,
        submissionId: submission?.id,
        feedback: data.feedback,
      });
      enqueueSnackbar(res?.data?.message);
    } catch (error) {
      enqueueSnackbar('Failed', {
        variant: 'error',
      });
    }
  });

  const renderFeedbackForm = (
    <Dialog open={modal.value} onClose={modal.onFalse} maxWidth="xs" fullWidth>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Feedback</DialogTitle>
        <DialogContent>
          <Box pt={2}>
            <RHFTextField
              name="feedback"
              label="Feedback"
              placeholder="Reason to reject"
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              reset();
              modal.onFalse();
            }}
            size="small"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button type="submit" size="small" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );

  return (
    <Box>
      <Card sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="caption" color="text.secondary">
            Due date
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {dayjs(submission?.dueDate).format('ddd LL')}
          </Typography>
        </Stack>
      </Card>
      {submission?.status === 'IN_PROGRESS' && !submission?.content ? (
        <EmptyContent title="No submission" />
      ) : (
        <>
          <iframe
            src={submission?.content}
            style={{
              borderRadius: 10,
              width: '100%',
              height: 900,
            }}
            title="AgreementForm"
          />
          {submission.status === 'PENDING_REVIEW' && (
            <Stack direction="row" gap={1.5} justifyContent="end" mt={2}>
              <Button
                onClick={modal.onTrue}
                size="small"
                variant="outlined"
                startIcon={<Iconify icon="mingcute:close-fill" />}
              >
                Reject
              </Button>
              <Button
                size="small"
                onClick={() => handleClick()}
                variant="contained"
                color="success"
                startIcon={<Iconify icon="hugeicons:tick-03" />}
              >
                Approve
              </Button>
            </Stack>
          )}
          {renderFeedbackForm}
        </>
      )}
    </Box>
  );
};

export default Agreement;

Agreement.propTypes = {
  campaign: PropTypes.object,
  submission: PropTypes.object,
  creator: PropTypes.object,
};