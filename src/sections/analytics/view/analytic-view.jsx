import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axiosInstance, {endpoints} from 'src/utils/axios';
import { Typography, Grid, Container, CircularProgress } from '@mui/material';
import { useAuthContext } from 'src/auth/hooks';

import TotalCreators from './components/creators/totalcreators';

import ShortlistedCreators from './components/creators/shortlisted-creators';
import CampaignParticipation from './components/creators/campaign-participants';
import TotalPitches from './components/creators/total-pitches';


export default function AnalyticsView() {
  const [creators, setCreators] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [creatorsRes, usersRes] = await Promise.all([
          axiosInstance.get(endpoints.creators.getCreators),
          axiosInstance.get(endpoints.users.allusers),
        ]);

        setCreators(creatorsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show loading indicator while data is being fetched
  if (loading) return <CircularProgress />;

  console.log("All usr", users)
  return (
    <>
      <Helmet>
        <title>Analytics</title>
      </Helmet>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Platform Analytics
        </Typography>

        <Grid container spacing={3}>
          {/* Total Creators Analytics */}
          <Grid item xs={12} md={6}>
            <TotalCreators creators={creators} />
          </Grid>

          {/* Shortlisted Creators */}
          <Grid item xs={12} md={6}>
            <ShortlistedCreators creators={creators} />
          </Grid>

          {/* Total Pitches */}
          <Grid item xs={12} md={6}>
            <TotalPitches users={users} />
          </Grid>

          {/* Campaign Participation */}
          <Grid item xs={12} md={6}>
            <CampaignParticipation creators={creators}/>
          </Grid>
        </Grid> 
      </Container>
    </>
  );
}
