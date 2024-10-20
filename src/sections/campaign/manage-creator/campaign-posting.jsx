import dayjs from 'dayjs';
import * as yup from 'yup';
import { mutate } from 'swr';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Box,
  List,
  Stack,
  Alert,
  Dialog,
  Button,
  ListItem,
  Typography,
  DialogTitle,
  ListItemText,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';

import Image from 'src/components/image';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';

const guideSteps = [
  'Log in to Instagram.',
  'Create a new post by tapping the "+" icon.',
  'Upload or capture your content and edit it as needed.',
  'Add a caption, hashtags, tags, or location.',
  'Tap "Share" to publish the post.',
  'Navigate to your profile and find the post.',
  'Open the post, tap the three dots (⋯), and select "Copy Link".',
  'Paste the copied link into the designated text field in your application.',
  'Submit the link to complete the process.',
];

const CampaignPosting = ({ campaign, submission, getDependency, fullSubmission }) => {
  const dependency = getDependency(submission?.id);
  const dialog = useBoolean();
  const { user } = useAuthContext();

  const invoiceId = campaign?.invoice?.find((invoice) => invoice?.creatorId === user?.id)?.id;

  const router = useRouter();

  const previewSubmission = useMemo(() => {
    const finalDraftSubmission = fullSubmission?.find(
      (item) => item?.id === dependency?.dependentSubmissionId
    );
    const firstDraftSubmission = fullSubmission?.find(
      (item) => item?.id === finalDraftSubmission?.dependentOn[0]?.dependentSubmissionId
    );

    if (firstDraftSubmission?.status === 'APPROVED') {
      return firstDraftSubmission;
    }
    return finalDraftSubmission;
  }, [fullSubmission, dependency]);

  const schema = yup.object().shape({
    postingLink: yup.string().required('Posting Link is required.'),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      postingLink: '',
    },
  });

  const { handleSubmit, reset } = methods;

  const renderGuide = (
    <Dialog open={dialog.value} onClose={dialog.onFalse}>
      <DialogTitle>
        <Typography variant="h5" gutterBottom>
          Steps to Post on Instagram and Copy Link
        </Typography>
      </DialogTitle>
      <DialogContent>
        <List>
          {guideSteps.map((step, index) => (
            <ListItem key={index}>
              <ListItemText primary={`Step ${index + 1}: ${step}`} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button size="small" onClick={dialog.onFalse}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderPostingTimeline = (
    <Alert severity="success">
      <Typography variant="subtitle1">Draft Approved ! Next Step: Post Your Deliverable</Typography>
      <Typography variant="subtitle2">
        You can now post your content between {dayjs(submission?.startDate).format('D MMMM, YYYY')}{' '}
        and {dayjs(submission?.endDate).format('D MMMM, YYYY')}
      </Typography>
    </Alert>
  );

  const renderRejectMessage = (
    <Alert severity="error">
      <Typography variant="subtitle1">Posting Rejected !</Typography>
      <ListItemText
        primary={submission?.feedback?.content}
        secondary="Please re-post and submit the link again."
        primaryTypographyProps={{
          variant: 'subtitle2',
        }}
        secondaryTypographyProps={{
          variant: 'caption',
        }}
      />
    </Alert>
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await axiosInstance.post(endpoints.submission.creator.postSubmission, {
        ...data,
        submissionId: submission?.id,
      });
      enqueueSnackbar(res?.data?.message);
      mutate(`${endpoints.submission.root}?creatorId=${user?.id}&campaignId=${campaign?.id}`);
      mutate(endpoints.kanban.root);
      mutate(endpoints.campaign.creator.getCampaign(campaign.id));
      reset();
    } catch (error) {
      enqueueSnackbar('Error submitting post link', {
        variant: 'error',
      });
    } finally {
      mutate(`${endpoints.submission.root}?creatorId=${user?.id}&campaignId=${campaign?.id}`);
    }
  });

  console.log(submission)

  return (
    <>
      {previewSubmission?.status === 'APPROVED' && (
        <Box>
          {submission?.status === 'PENDING_REVIEW' && (
            <Stack justifyContent="center" alignItems="center" spacing={2}>
              <Image src="/assets/pending.svg" sx={{ width: 250 }} />
              <Typography variant="subtitle2">Your Submission is in review.</Typography>
            </Stack>
          )}
          {submission?.status === 'IN_PROGRESS' && (
            <Stack spacing={1}>
              {renderPostingTimeline}
              <Box>
                <Button size="small" variant="outlined" onClick={dialog.onTrue}>
                  Show guide
                </Button>
              </Box>
              <Box>
                <FormProvider methods={methods} onSubmit={onSubmit}>
                  <Stack spacing={1} alignItems="flex-end">
                    <RHFTextField
                      name="postingLink"
                      label="Posting Link"
                      placeholder="Paste you posting link"
                    />
                    <Button variant="contained" size="small" type="submit">
                      Submit
                    </Button>
                  </Stack>
                </FormProvider>
              </Box>
            </Stack>
          )}
          {submission?.status === 'APPROVED' && (
            <Stack justifyContent="center" alignItems="center" spacing={2}>
              <Image src="/assets/approve.svg" sx={{ width: 250 }} />
              <Typography variant="subtitle2">Your Posting has been approved.</Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => router.push(paths.dashboard.finance.invoiceDetail(invoiceId))}
              >
                View Invoice
              </Button>
            </Stack>
          )}
          {submission?.status === 'REJECTED' && (
            <>
              {renderRejectMessage}
              <Stack spacing={1} my={1.5}>
                <Box>
                  <Button size="small" variant="outlined" onClick={dialog.onTrue}>
                    Show guide
                  </Button>
                </Box>
                <Box>
                  <FormProvider methods={methods} onSubmit={onSubmit}>
                    <Stack spacing={1} alignItems="flex-end">
                      <RHFTextField
                        name="postingLink"
                        label="Posting Link"
                        placeholder="Paste you posting link"
                      />
                      <Button variant="contained" size="small" type="submit">
                        Submit
                      </Button>
                    </Stack>
                  </FormProvider>
                </Box>
              </Stack>
            </>
          )}
        </Box>
      )}
      {renderGuide}
    </>
  );
};

export default CampaignPosting;

CampaignPosting.propTypes = {
  campaign: PropTypes.object,
  submission: PropTypes.object,
  getDependency: PropTypes.func,
  fullSubmission: PropTypes.array,
};
