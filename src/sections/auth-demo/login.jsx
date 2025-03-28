import * as Yup from 'yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { Page, pdfjs, Document } from 'react-pdf';
import { yupResolver } from '@hookform/resolvers/yup';
import TagManager from "react-gtm-module";


import Link from '@mui/material/Link';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Stack,
  Dialog,
  Button,
  Divider,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  DialogActions,
  InputAdornment,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';

// import error from '../../../public/sounds/error.mp3';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const socialLogins = [
  {
    platform: 'google',
    icon: 'mingcute:google-fill',
  },
  {
    platform: 'facebook',
    icon: 'ic:baseline-facebook',
  },
];

// eslint-disable-next-line react/prop-types
const PdfModal = ({ open, onClose, pdfFile, title }) => {
  const [numPages, setNumPages] = useState(null);
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  // eslint-disable-next-line no-shadow
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullScreen={isSmallScreen}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Box sx={{ flexGrow: 1, mt: 1, borderRadius: 2, overflow: 'scroll' }}>
          <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <div key={index} style={{ marginBottom: '0px' }}>
                <Page
                  key={`${index}-${isSmallScreen ? '1' : '1.5'}`}
                  pageNumber={index + 1}
                  scale={isSmallScreen ? 0.7 : 1.5}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  style={{ overflow: 'scroll' }}
                />
              </div>
            ))}
          </Document>
        </Box>
      </DialogContent>

      {/* </DialogContent> */}
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const Login = () => {
  const password = useBoolean();
  const [openTermsModal, setOpenTermsModal] = useState(false);
  const [openPrivacyModal, setOpenPrivacyModal] = useState(false);
  // const [play] = useSound(error, {
  //   interrupt: true,
  // });

  const { login } = useAuthContext();
  const router = useRouter();

  const handleOpenTerms = () => {
    const a = document.createElement('a');
    a.href = `https://cultcreativeasia.com/my/terms-and-conditions`;
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
    // setOpenTermsModal(true);
  };

  const handleOpenPrivacy = () => {
    const a = document.createElement('a');
    a.href = `https://cultcreativeasia.com/my/privacy-policy`;
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
    // setOpenPrivacyModal(true);
  };

  const handleCloseTerms = () => {
    setOpenTermsModal(false);
  };

  const handleClosePrivacy = () => {
    setOpenPrivacyModal(false);
  };

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required.').email('Invalid email entered. Please try again.'),
    password: Yup.string().required('Password is required.'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  const getDeviceType = () => {
    const userAgent = navigator.userAgent;
    if (/mobile/i.test(userAgent)) return "mobile";
    if (/tablet/i.test(userAgent)) return "tablet";
    return "desktop";
  };

  console.log("login data", login)
  const onSubmit = handleSubmit(async (data) => {
    try {
      // await login(data.email, data.password, { admin: false });
      const res = await login(data.email, data.password, { admin: false }); // Assuming this returns a response with `user`
 
      // if (res?.user?.role === 'creator') {
      //   router.push(paths.dashboard.overview.root);
      // }

      enqueueSnackbar('Logged in. Welcome back!');
    } catch (err) {
      // // play();
      // enqueueSnackbar(err.message, {
      // variant: 'error',
      // });
      // error message for user that has not registered yet
      if (err.message === 'User not registered.') {
        methods.setError('email', {
          type: 'manual',
          message: 'User not registered.'
        });
      } else {
        // error message for incorrect password
        methods.setError('password', {
          type: 'manual',
          message: 'Incorrect password entered. Please try again.'
        });
      }
    }
  });


      // Check if user is a creator
      const isCreator = !!res?.user?.creator;

      // Store user_type in localStorage
      //  localStorage.setItem("user_type", isCreator ? "creator" : "admin");


        // Push login success event to GTM
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "login_success",
          user_device: getDeviceType(),
          user_email: data.email,
          user_type: isCreator ? "creator" : "admin", 
        });

        // If user is a creator, track them as active
        if (isCreator) {
          window.dataLayer.push({
            event: "creator_active",
            user_email: data.email,
            timestamp: new Date().toISOString(),
            last_login: new Date().toISOString(), 
          });
        }
        enqueueSnackbar('Successfully login');
      } catch (err) {
        // play();
        // Push failure event to GTM
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "login_failed",
          error_message: err.message,
        });
        // TagManager.dataLayer({
        //   dataLayer: {
        //     event: "login_failed",
        //     error_message: err.message,
        //   },
        // });
        enqueueSnackbar(err.message, {
          variant: 'error',
        });
      }
    });

  const googleAuth = async () => {
    window.open(`${import.meta.env.VITE_BASE_URL}/api/auth/google`, '_self');
  };


  const renderForm = (
    <Stack spacing={2.5}>
      <Typography variant="body2" color="#636366" fontWeight={500} sx={{ fontSize: '13px', mb: -2 }}>
        Email <Box component="span" sx={{ color: 'error.main' }}>*</Box>
      </Typography>
      <Box>
        <RHFTextField
          name="email"
          placeholder="Email"
          InputLabelProps={{ shrink: false }}
          FormHelperTextProps={{ sx: { display: 'none' } }}
          sx={{
            '&.MuiTextField-root': {
              bgcolor: 'white',
              borderRadius: 1,
              '& .MuiInputLabel-root': {
                display: 'none',
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#B0B0B0',
                fontSize: '16px',
                opacity: 1,
              },
            },
          }}
        />
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#F04438',
            mt: 0.5,
            ml: 0.5,
            display: 'block',
            fontSize: '12px',
          }}
        >
          {methods.formState.errors.email?.message}
        </Typography>
      </Box>

      <Typography variant="body2" color="#636366" fontWeight={500} sx={{ fontSize: '13px', mb: -2 }}>
        Password <Box component="span" sx={{ color: 'error.main' }}>*</Box>
      </Typography>
      <Box>
        <RHFTextField
          name="password"
          placeholder="Password"
          type={password.value ? 'text' : 'password'}
          InputLabelProps={{ shrink: false }}
          FormHelperTextProps={{ sx: { display: 'none' } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle}>
                  <Box component="img" src={`/assets/icons/components/${password.value ? 'ic_open_passwordeye.svg' 
                    : 'ic_closed_passwordeye.svg'}`} sx={{ width: 24, height: 24 }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '&.MuiTextField-root': {
              bgcolor: 'white',
              borderRadius: 1,
              '& .MuiInputLabel-root': {
                display: 'none',
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#B0B0B0',
                fontSize: '16px',
                opacity: 1,
              },
            },
          }}
        />  
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#F04438',
            mt: 0.5,
            ml: 0.5,
            display: 'block',
            fontSize: '12px',
          }}
        >
          {methods.formState.errors.password?.message}
        </Typography>
      </Box>

      <Link
        component={RouterLink}
        href={paths.auth.jwt.forgetPassword}
        variant="body2"
        color="#636366"
        underline="always"
        sx={{ alignSelf: 'flex-start', fontWeight: 500, fontSize: '14px', mb: -0.5, mt: -1, ml: 0.1 }}
      >
        Forgot your password?
      </Link>

      <LoadingButton
        fullWidth
        sx={{
          background: isDirty
            ? '#1340FF'
            : 'linear-gradient(0deg, rgba(255, 255, 255, 0.60) 0%, rgba(255, 255, 255, 0.60) 100%), #1340FF',
          pointerEvents: !isDirty && 'none',
          fontSize: '17px',
          borderRadius: '12px',
          borderBottom: isDirty ? '3px solid #0c2aa6' : '3px solid #91a2e5',
          transition: 'none',
        }}
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Login
      </LoadingButton>

      <Divider textAlign="center" sx={{ color: 'text.secondary', fontSize: 14 }}>
        More login options
      </Divider>

      <Stack direction="row" justifyContent="center" spacing={2}>
        {socialLogins.map((item) => {
          const handleAuth = item.platform === 'google' ? googleAuth : null;

          return (
            <LoadingButton
              fullWidth
              size="large"
              variant="outlined"
              loading={isSubmitting}
              onClick={handleAuth}
              sx={{
                boxShadow: '0px -3px 0px 0px rgba(0, 0, 0, 0.45) inset',
                bgcolor: '#1340FF',
                color: 'whitesmoke',
                width: 80,
                py: 1,
                '&:hover': {
                  bgcolor: '#1340FF',
                },
              }}
            >
              <Iconify icon={item.icon} width={25} />
            </LoadingButton>
          );
        })}
      </Stack>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        mt: 2.5,
        textAlign: 'center',
        typography: 'caption',
        color: '#8E8E93',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
      }}
    >
      By signing up, I agree to
      <Link
        component="button"
        underline="always"
        color="text.primary"
        onClick={handleOpenTerms}
        type="button"
        sx={{ 
          verticalAlign: 'baseline',
          fontSize: '13px',
          lineHeight: 1,
          p: 0,
          color: '#231F20',
        }}
      >
        Terms of Service
      </Link>
      and
      <Link
        component="button"
        underline="always"
        color="text.primary"
        onClick={handleOpenPrivacy}
        type="button"
        sx={{ 
          verticalAlign: 'baseline',
          fontSize: '13px',
          lineHeight: 1,
          p: 0,
          color: '#231F20',
        }}
      >
        Privacy Policy.
      </Link>
    </Typography>
  );

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box
          sx={{
            p: 3,
            bgcolor: '#F4F4F4',
            borderRadius: 2,
            width: { xs: '100%', sm: 394 },  
            maxWidth: { xs: '100%', sm: 394 },
            mx: 'auto',
          }}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontSecondaryFamily,
              fontWeight: 400,
              fontSize: '40px',
            }}
          >
            Login 👾
          </Typography>

          <Stack direction="row" spacing={0.5} my={2}>
            <Typography variant="body2">New user?</Typography>

            <Link
              component={RouterLink}
              href={paths.auth.jwt.register}
              variant="body2"
              color="#1340FF"
              fontWeight={600}
            >
              Create an account
            </Link>
          </Stack>

          <Box
            sx={{
              mt: 3,
            }}
          >
            {renderForm}
          </Box>
          {renderTerms}
        </Box>
      </FormProvider>
      <PdfModal
        open={openTermsModal}
        onClose={handleCloseTerms}
        pdfFile="https://storage.googleapis.com/cult_production/pdf/tnc%20copy.pdf"
        title="Terms and Conditions"
      />

      <PdfModal
        open={openPrivacyModal}
        onClose={handleClosePrivacy}
        pdfFile="https://storage.googleapis.com/cult_production/pdf/privacy-policy%20copy.pdf"
        title="Privacy Policy"
      />
    </>
  );
};

export default Login;
