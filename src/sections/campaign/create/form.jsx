/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Step from '@mui/material/Step';
import Paper from '@mui/material/Paper';
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import MenuItem from '@mui/material/MenuItem';
import StepLabel from '@mui/material/StepLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Grid, Stack, Avatar, Divider, IconButton, StepContent, ListItemText } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useBrand } from 'src/hooks/zustands/useBrand';
import { useGetTimeline } from 'src/hooks/use-get-timeline';
import useGetAllTimelineType from 'src/hooks/use-get-all-timeline';
import useGetDefaultTimeLine from 'src/hooks/use-get-default-timeline';
import { useGetCampaignBrandOption } from 'src/hooks/use-get-company-brand';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import FormProvider, {
  RHFUpload,
  RHFSelect,
  RHFTextField,
  RHFMultiSelect,
  RHFAutocomplete,
} from 'src/components/hook-form';

import CreateBrand from './brandDialog';
import { useGetAdmins } from './hooks/get-am';
import SelectTimeline from './steps/select-timeline';
import TimelineTypeModal from './steps/timeline-type-modal';
// import CampaignTaskManagement from './steps/campaign-tasks';

// import NotificationReminder from './steps/notification-reminder';

const steps = [
  'Campaign Information',
  'Campaign brief form',
  'Campaign Images',
  'Timeline',
  'Admin Manager',
  'Agreement Form',
];

const interestsLists = [
  'Art',
  'Beauty',
  'Business',
  'Fashion',
  'Fitness',
  'Food',
  'Gaming',
  'Health',
  'Lifestyle',
  'Music',
  'Sports',
  'Technology',
  'Travel',
];

function CreateCampaignForm() {
  const { enqueueSnackbar } = useSnackbar();
  const active = localStorage.getItem('activeStep');
  const modal = useBoolean();

  const { options } = useGetCampaignBrandOption();
  const [activeStep, setActiveStep] = useState(parseInt(active, 10) || 0);
  const [openCompanyDialog, setOpenCompanyDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const open = Boolean(anchorEl);
  const [image, setImage] = useState(null);
  const { brand } = useBrand();
  const [brandState, setBrandState] = useState('');
  const [campaignDo, setcampaignDo] = useState(['']);
  const [campaignDont, setcampaignDont] = useState(['']);
  const { defaultTimeline } = useGetTimeline();
  const { data: defaultTimelines, isLoading: defaultTimelineLoading } = useGetDefaultTimeLine();
  const [timeline, setTimeline] = useState('defaultTimeline');
  const { admins } = useGetAdmins();
  const { user } = useAuthContext();
  const timelineType = useGetAllTimelineType();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseCompanyDialog = () => {
    setOpenCompanyDialog(false);
  };

  const handleOpenCompanyDialog = () => {
    setOpenCompanyDialog(true);
    handleClose();
  };

  const campaignSchema = Yup.object().shape({
    // campaignName: Yup.string().required('Campaign name is required'),
    campaignInterests: Yup.array().min(3, 'Choose at least three option'),
    campaignDescription: Yup.string().required('Campaign Description is required.'),
    // campaignCompany: Yup.string().required('Company name is required'),
    campaignBrand: Yup.object().required('Brand name is required'),
    campaignStartDate: Yup.mixed().nullable().required('Campaign start date is required'),
    // campaignEndDate: Yup.mixed().nullable().required('birthDate date is required'),
    campaignTitle: Yup.string().required('Campaign title is required'),
    campaignObjectives: Yup.string().required('Campaign objectives is required'),
    // campaginCoverImage: Yup.string().required('Campaign cover image is required'),
    // campaignSuccessMetrics: Yup.string().required('Campaign success metrics is required'),
    audienceAge: Yup.array().required('Audience age is required'),
    audienceGender: Yup.array().required('Audience Gender is required'),
    audienceLocation: Yup.array().required('Audience location is required'),
    audienceLanguage: Yup.array().required('Audience language is required'),
    audienceCreatorPersona: Yup.array().required('Audience creator persona is required'),
    audienceUserPersona: Yup.string().required('Audience influencer persona is required'),
    campaignDo: Yup.array()
      .min(1, 'insert at least one option')
      .required('Campaign do is required '),
    campaignDont: Yup.array()
      .min(1, 'insert at least one option')
      .required('Campaign dont is required '),

    adminManager: Yup.array().required('Admin Manager is required'),
    campaignImages: Yup.array().min(3, 'Must have at least 3 items'),
    agreementFrom: Yup.mixed().nullable().required('Single upload is required'),
    timeline: Yup.mixed().required(),
    campaignTasksAdmin: Yup.array()
      .min(1)
      .of(
        Yup.object().shape({
          name: Yup.string().required('Name is required'),
        })
      ),
  });

  const campaignInformationSchema = Yup.object().shape({
    campaignInterests: Yup.array().min(3, 'Choose at least three option'),
    campaignDescription: Yup.string().required('Campaign Description is required.'),
    campaignBrand: Yup.object().required('Brand name is required'),
    campaignTitle: Yup.string().required('Campaign title is required'),
    campaignObjectives: Yup.string().required('Campaign objectives is required'),
  });

  const campaignRequirementSchema = Yup.object().shape({
    audienceAge: Yup.array().min(1, 'At least one option').required('Audience age is required'),
    audienceGender: Yup.array()
      .min(1, 'At least one option')
      .required('Audience Gender is required'),
    audienceLocation: Yup.array()
      .min(1, 'At least one option')
      .required('Audience location is required'),
    audienceLanguage: Yup.array()
      .min(1, 'At least one option')
      .required('Audience language is required'),
    audienceCreatorPersona: Yup.array()
      .min(1, 'At least one option')
      .required('Audience creator persona is required'),
    audienceUserPersona: Yup.string().required('Audience influencer persona is required'),
    campaignDo: Yup.array()
      .min(1, 'At least one option')
      .of(
        Yup.object().shape({
          value: Yup.string().required('This field is required'),
        })
      ),
    campaignDont: Yup.array()
      .min(1, 'At least one option')
      .of(
        Yup.object().shape({
          value: Yup.string().required('This field is required'),
        })
      ),
    // campaignDo: Yup.array().min(1, 'At least one option').required('Campaign do is required '),
    // campaignDont: Yup.array().min(1, 'At least one option').required('Campaign dont is required '),
  });

  const campaignImagesSchema = Yup.object().shape({
    campaignImages: Yup.array()
      .min(3, 'Must have at least 3 items')
      .required('Campaign Images ares required'),
  });

  const campaignAdminSchema = Yup.object().shape({
    adminManager: Yup.array()
      .min(1, 'At least One Admin is required')
      .required('Admin Manager is required'),
  });

  const savedData = localStorage.getItem('formData');

  const defaultValues = savedData
    ? JSON.parse(savedData)
    : {
        campaignTitle: '',
        campaignBrand: null,
        campaignStartDate: null,
        campaignEndDate: null,
        campaignInterests: [],
        campaignObjectives: '',
        campaignDescription: '',
        audienceGender: [],
        audienceAge: [],
        audienceLocation: [],
        audienceLanguage: [],
        audienceCreatorPersona: [],
        audienceUserPersona: '',
        campaignDo: [
          {
            value: '',
          },
        ],
        campaignDont: [
          {
            value: '',
          },
        ],
        campaignImages: [],
        adminManager: [],
        agreementFrom: null,
        timeline: [{ timeline_type: '', duration: undefined, startDate: '', endDate: '' }],
        // campaignTasksAdmin: [{ id: '', name: '', dependency: '', dueDate: null, status: '' }],
        campaignTasksAdmin: [],
        campaignTasksCreator: [{ id: '', name: '', dependency: '', dueDate: null, status: '' }],
      };

  const getSchemaForStep = (step) => {
    switch (step) {
      case 0:
        return campaignInformationSchema;
      case 1:
        return campaignRequirementSchema;
      case 2:
        return campaignImagesSchema;
      case 3:
        return undefined;
      case 4:
        return undefined;
      case 5:
        return campaignAdminSchema;
      default:
        return campaignSchema; // Assuming step 3 is the default or final step
    }
  };

  const methods = useForm({
    resolver: yupResolver(getSchemaForStep(activeStep)),
    defaultValues,
    reValidateMode: 'onChange',
    mode: 'onChange',
  });

  const {
    // eslint-disable-next-line no-unused-vars
    handleSubmit,
    getValues,
    control,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = methods;

  const values = watch();

  // useEffect(() => {
  //   localStorage.setItem('formData', JSON.stringify(values));
  // }, [values]);

  const {
    append: doAppend,
    fields: doFields,
    remove: doRemove,
  } = useFieldArray({
    name: 'campaignDo',
    control,
  });

  const {
    append: dontAppend,
    fields: dontFields,
    remove: dontRemove,
  } = useFieldArray({
    name: 'campaignDont',
    control,
  });

  const timelineMethods = useFieldArray({
    name: 'timeline',
    control,
  });

  const audienceGeoLocation = watch('audienceLocation');

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      const files = values.campaignImages || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('campaignImages', [...files, ...newFiles]);
    },
    [setValue, values.campaignImages]
  );

  useEffect(() => {
    if (brandState !== '') {
      setValue('campaignBrand', brandState);
    }
  }, [brandState, setValue]);

  const handleNext = async () => {
    if (activeStep === 3 || activeStep === 4) {
      localStorage.setItem('activeStep', activeStep + 1);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    const result = await trigger();
    if (result) {
      localStorage.setItem('activeStep', activeStep + 1);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    localStorage.setItem('activeStep', activeStep - 1);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onDrop = useCallback(
    (e) => {
      const preview = URL.createObjectURL(e[0]);
      setImage(preview);
      setValue('image', e[0]);
    },
    [setValue]
  );

  const handleCampaginDontAdd = () => {
    setcampaignDont([...campaignDont, '']);
  };

  const handleCampaginDontChange = (index, event) => {
    const newDont = [...campaignDont];
    newDont[index] = event.target.value;
    setcampaignDont(newDont);
    setValue('campaignDont', newDont);
  };

  const handleAddObjective = () => {
    setcampaignDo([...campaignDo, '']);
  };

  const handleObjectiveChange = (index, event) => {
    const newObjectives = [...campaignDo];
    newObjectives[index] = event.target.value;
    setcampaignDo(newObjectives);
    setValue('campaignDo', newObjectives);
  };

  function hasEmptyValue(obj) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in obj) {
      if (obj[key] === null || obj[key] === '') {
        return true;
      }
    }
    return false;
  }

  const onSubmit = handleSubmit(async (data, stage) => {
    const formData = new FormData();

    const combinedData = { ...data, ...{ campaignStage: stage } };

    formData.append('data', JSON.stringify(combinedData));
    formData.append('agreementForm', data.agreementFrom);

    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const i in data.campaignImages) {
      formData.append('campaignImages', data.campaignImages[i]);
    }
    // formData.append('campaignImage', data.campaignImages[0]);

    try {
      setIsLoading(true);
      const res = await axiosInstance.post(endpoints.campaign.createCampaign, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsLoading(false);
      enqueueSnackbar(res?.data?.message, {
        variant: 'success',
      });
      reset();
      setActiveStep(0);
      localStorage.setItem('activeStep', 0);
    } catch (error) {
      enqueueSnackbar('Error creating campaign. Contact our admin', {
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  });

  const formFirstStep = (
    <Box
      gap={2}
      display="grid"
      mt={4}
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
      }}
    >
      <RHFTextField name="campaignTitle" label="Campaign Title" />
      <RHFTextField name="campaignDescription" label="Campaign Description" multiline />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {options && (
          <RHFAutocomplete
            fullWidth
            name="campaignBrand"
            placeholder="Brand"
            options={brandState ? [brandState] : options}
            getOptionLabel={(option) => option.name}
            noOptionsText={
              <Button
                variant="contained"
                size="small"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleOpenCompanyDialog}
              >
                Create new brand
              </Button>
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option) => (
              <Stack direction="row" spacing={1} p={1} {...props}>
                <Avatar src={option?.logo} sx={{ width: 35, height: 35 }} />
                <ListItemText primary={option.name} />
              </Stack>
            )}
          />
        )}
        {/* <Box>
          <Tooltip title="Create brand">
            <IconButton
              sx={{
                mx: 1,
                bgcolor: 'whitesmoke',
              }}
              onClick={handleClick}
              size="small"
            >
              <Iconify icon="mingcute:add-line" width={15} />
            </IconButton>
          </Tooltip>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem
              onClick={() => {
                handleOpenCompanyDialog();
              }}
            >
              <Stack direction="row" alignItems="center" gap={1}>
                <Iconify icon="mdi:invite" />
                <Typography variant="button">Create Brand</Typography>
              </Stack>
            </MenuItem>
          </Menu>
        </Box> */}
      </Box>

      <RHFSelect name="campaignObjectives" label="Campaign Objectives">
        <MenuItem value="I'm launching a new product">I&apos;m launching a new product</MenuItem>
        <MenuItem value="I'm launching a new service">I&apos;m launching a new service</MenuItem>
        <MenuItem value="I want to drive brand awareness">I want to drive brand awareness</MenuItem>
        <MenuItem value="Want to drive product awareness">Want to drive product awareness</MenuItem>
      </RHFSelect>

      {/* <RHFDatePicker name="campaignStartDate" label="Start Date" />
      <RHFDatePicker name="campaignEndDate" label="End Date" /> */}

      <RHFAutocomplete
        name="campaignInterests"
        placeholder="+ Interests"
        multiple
        freeSolo
        disableCloseOnSelect
        options={interestsLists.map((option) => option)}
        getOptionLabel={(option) => option}
        renderOption={(props, option) => (
          <li {...props} key={option}>
            {option}
          </li>
        )}
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option}
              label={option}
              size="small"
              color="info"
              variant="soft"
            />
          ))
        }
      />

      {/* <RHFAutocomplete
        name="campaignIndustries"
        placeholder="+ Industries"
        multiple
        freeSolo
        disableCloseOnSelect
        options={interestsLists.map((option) => option)}
        getOptionLabel={(option) => option}
        renderOption={(props, option) => (
          <li {...props} key={option}>
            {option}
          </li>
        )}
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option}
              label={option}
              size="small"
              color="info"
              variant="soft"
            />
          ))
        }
      /> */}
    </Box>
  );

  const formSecondStep = (
    <Stack spacing={3}>
      <Box
        rowGap={2}
        columnGap={3}
        display="grid"
        mt={4}
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
      >
        <Typography variant="h4">Audience Requirements</Typography>
        <Box flexGrow={1} />
        <RHFMultiSelect
          name="audienceGender"
          checkbox
          chip
          options={[
            { value: 'female', label: 'Female' },
            { value: 'male', label: 'Male' },
            { value: 'nonbinary', label: 'Non-Binary' },
          ]}
          label="Audience Gender"
        />
        <RHFMultiSelect
          name="audienceAge"
          checkbox
          chip
          options={[
            { value: '18-25', label: '18-25' },
            { value: '26-34', label: '26-34' },
            { value: '35-40', label: '35-40' },
            { value: '>40', label: '>40' },
          ]}
          label="Audience Age"
        />

        <RHFMultiSelect
          name="audienceLocation"
          label="Audience Geo Location"
          checkbox
          chip
          options={[
            { value: 'KlangValley', label: 'Klang Valley' },
            { value: 'Selangor', label: 'Selangor' },
            { value: 'KualaLumpur', label: 'Kuala Lumpur' },
            { value: 'MainCities', label: 'Main cities in Malaysia' },
            { value: 'EastMalaysia', label: 'East Malaysia' },
            { value: 'Others', label: 'Others' },
          ]}
        />

        {audienceGeoLocation === 'Others' && (
          <TextField name="audienceLocation" label="Specify Other Location" variant="outlined" />
        )}

        <RHFMultiSelect
          name="audienceLanguage"
          label="Audience Language"
          checkbox
          chip
          options={[
            { value: 'Malay', label: 'Malay' },
            { value: 'English', label: 'English' },
            { value: 'Chinese', label: 'Chinese' },
            { value: 'Tamil', label: 'Tamil' },
            { value: 'Korean', label: 'Korean' },
          ]}
        />

        <RHFMultiSelect
          name="audienceCreatorPersona"
          label="Audience Creator Persona"
          checkbox
          chip
          options={[
            { value: 'lifestyle', label: 'LifeStyle' },
            { value: 'fashion', label: 'Fashion' },
            { value: 'beauty', label: 'Beauty' },
            { value: 'tech', label: 'Tech' },
            { value: 'sports', label: 'Sports & Fitness' },
            { value: 'health', label: 'Health & wellness' },
            { value: 'family', label: 'Family & motherhood' },
            { value: 'finance', label: 'Finance' },
            { value: 'education', label: 'Education' },
            { value: 'music', label: 'Music' },
            { value: 'gamer', label: 'Gamer' },
            { value: 'entertainment', label: 'Entertainment' },
            { value: 'travel', label: 'Travel' },
          ]}
        />

        <RHFTextField
          name="audienceUserPersona"
          label="User Persona"
          placeholder=" let us know who you want your campaign to reach!"
        />

        {audienceGeoLocation === 'Others' && <Box flexGrow={1} />}
      </Box>

      <Divider
        sx={{
          borderStyle: 'dashed',
        }}
      />

      <Typography variant="h5">Dos and Don&apos;ts</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" spacing={2}>
            {doFields.map((item, index) => (
              <Stack key={item.id} direction="row" spacing={1} alignItems="center">
                <RHFTextField
                  name={`campaignDo[${index}].value`}
                  label={`Campaign Do's ${index + 1}`}
                />
                {index !== 0 && (
                  <IconButton color="error" onClick={() => doRemove(index)}>
                    <Iconify icon="ic:outline-delete" color="error.main" />
                  </IconButton>
                )}
              </Stack>
            ))}

            <Button variant="contained" onClick={() => doAppend({ value: '' })}>
              Add Do
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" spacing={2}>
            {dontFields.map((item, index) => (
              <Stack key={item.id} direction="row" spacing={1} alignItems="center">
                <RHFTextField
                  name={`campaignDont[${index}].value`}
                  label={`Campaign Dont's ${index + 1}`}
                />
                {index !== 0 && (
                  <IconButton color="error" onClick={() => dontRemove(index)}>
                    <Iconify icon="ic:outline-delete" color="error.main" />
                  </IconButton>
                )}
              </Stack>
            ))}

            <Button variant="contained" onClick={() => dontAppend({ value: '' })}>
              Add Don&apos;t
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );

  const formSelectAdminManager = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        gap: 2,
        p: 3,
      }}
    >
      <Typography variant="h5">Select Admin Manager</Typography>

      <RHFAutocomplete
        name="adminManager"
        multiple
        placeholder="Admin Manager"
        options={(admins && admins.map((admin) => ({ id: admin?.id, name: admin?.name }))) || []}
        freeSolo
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => (option?.id === user?.id ? 'Me' : option?.name || '')}
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option?.id}
              label={option?.id === user?.id ? 'Me' : option?.name || ''}
              size="small"
              color="info"
              variant="soft"
            />
          ))
        }
      />
    </Box>
  );

  const imageUpload = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        gap: 3,
        p: 3,
      }}
    >
      <Typography variant="h4">Upload Campaign Images</Typography>
      <RHFUpload
        multiple
        thumbnail
        name="campaignImages"
        maxSize={3145728}
        onDrop={handleDropMultiFile}
        onRemove={(inputFile) =>
          setValue(
            'campaignImages',
            values.campaignImages && values.campaignImages?.filter((file) => file !== inputFile),
            { shouldValidate: true }
          )
        }
        onRemoveAll={() => setValue('campaignImages', [], { shouldValidate: true })}
        // onUpload={() => console.info('ON UPLOAD')}
      />
    </Box>
  );

  const handleDropSingleFile = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      console.log(newFile);

      if (newFile) {
        setValue('agreementFrom', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const formUpload = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        gap: 3,
        p: 3,
      }}
    >
      <Typography variant="h4">Upload Agreement</Typography>
      <RHFUpload
        type="pdf"
        name="agreementFrom"
        onDrop={handleDropSingleFile}
        onDelete={() => setValue('singleUpload', null, { shouldValidate: true })}
      />
    </Box>
  );

  function getStepContent(step) {
    switch (step) {
      case 0:
        return formFirstStep;
      case 1:
        return formSecondStep;
      case 2:
        return imageUpload;
      case 3:
        return (
          <SelectTimeline
            control={control}
            defaultTimelines={defaultTimelines}
            getValues={getValues}
            setValue={setValue}
            errors={errors}
            timeline={timeline}
            setTimeline={setTimeline}
            timelineMethods={timelineMethods}
            watch={watch}
            timelineType={timelineType}
            modal={modal}
          />
        );
      case 4:
        return formSelectAdminManager;
      case 5:
        return formUpload;
      default:
        return 'Unknown step';
    }
  }

  const startDate = getValues('campaignStartDate');

  return (
    <Box
      sx={{
        boxShadow: (theme) => theme.customShadows.z20,
        borderRadius: '20px',
        mt: 3,
        bgcolor: 'background.paper',
        p: { xs: 1, md: 3 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stepper
          sx={{
            pt: 2,
            m: 1,
          }}
          activeStep={activeStep}
          // alternativeLabel
          orientation="vertical"
        >
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
                <StepContent>
                  {getStepContent(activeStep)}
                  {activeStep !== steps.length - 1 && (
                    <Stack mt={2} direction="row" gap={2}>
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        variant="outlined"
                        size="small"
                      >
                        Back
                      </Button>

                      <Button variant="contained" size="small" onClick={handleNext}>
                        Next
                      </Button>
                    </Stack>
                  )}
                </StepContent>
              </Step>
            );
          })}
        </Stepper>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Paper
            sx={{
              p: 0.5,
              my: 0.5,
              mx: 1,
              width: '100%',
            }}
          >
            <Box sx={{ my: 1 }}>
              <FormProvider methods={methods} onSubmit={onSubmit}>
                {/* {getStepContent(activeStep)} */}
                {activeStep === steps.length - 1 && (
                  <Box sx={{ display: 'flex', m: 2, direction: { xs: 'column', md: 'row' } }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Box sx={{ flexGrow: 1 }} />
                    {activeStep === steps.length - 1 ? (
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                        <LoadingButton
                          variant="outlined"
                          startIcon={<Iconify icon="fluent:preview-link-16-regular" width={16} />}
                        >
                          Preview
                        </LoadingButton>
                        <LoadingButton
                          variant="outlined"
                          onClick={() => onSubmit('DRAFT')}
                          startIcon={<Iconify icon="hugeicons:license-draft" width={16} />}
                          loading={isLoading}
                        >
                          Draft
                        </LoadingButton>
                        <LoadingButton
                          variant="contained"
                          color="primary"
                          onClick={() => onSubmit('SCHEDULED')}
                          startIcon={<Iconify icon="material-symbols:publish" width={16} />}
                          loading={isLoading}
                        >
                          Schedule on {dayjs(startDate).format('ddd LL')}
                        </LoadingButton>
                      </Stack>
                    ) : (
                      <Button variant="contained" onClick={handleNext}>
                        Next
                      </Button>
                    )}
                  </Box>
                )}
              </FormProvider>
            </Box>
          </Paper>
        </Box>
      </FormProvider>
      <CreateBrand
        open={openCompanyDialog}
        onClose={handleCloseCompanyDialog}
        setBrand={setBrandState}
      />
      <TimelineTypeModal open={modal.value} onClose={modal.onFalse} />
    </Box>
  );
}
export default CreateCampaignForm;
