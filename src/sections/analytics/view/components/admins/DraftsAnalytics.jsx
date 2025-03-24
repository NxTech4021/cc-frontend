// components/admins/SendAgreementsAnalytics.jsx

import React, { useState, useEffect } from "react";
import axiosInstance, { endpoints } from "src/utils/axios";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { Card, Table, TableRow, TableHead, TableBody, TableCell, CardContent, TableContainer, Typography, CircularProgress, Box } from "@mui/material";

// Extend dayjs to use duration plugin
dayjs.extend(duration);

export default function DraftAnalytics() {
  const [submissions, setSubmissions] = useState([]); // Ensure it's initialized as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const response = await axiosInstance.get(endpoints.submission.all);
        setSubmissions(response.data.submissions || []); // Ensure submissions is an array
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch submissions");
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, []);

  // Filter only submissions with type "First Draft"
  const fistDraftSubmissions = submissions.filter(submission => submission.type === "FIRST_DRAFT" && submission.status === "APPROVED");
 
  // Filter only submissions with type "Final Draft"
  const finalDraftSubmissions = submissions.filter(submission => submission.type === "FINAL_DRAFT" && submission.status === "APPROVED");
 
  console.log("Agreement", fistDraftSubmissions)
  // Check if there are any completed submissions for "Completed Date" column to show
  //    const showCompletedDateColumn = agreementSubmissions.some(submission => submission.completedAt);

  return (
    <>
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h3" gutterBottom style={{ fontFamily: 'Instrument Serif', fontWeight: 550 }}>
         First Draft
        </Typography>

        {/* Loading and Error Handling */}
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}

        {/* Display table only if there are agreement submissions */}
        {fistDraftSubmissions.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Creator</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Turnaround Time</TableCell>
                  <TableCell>Approved By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fistDraftSubmissions.map((submission) => {
                  // Convert submission date to formatted string using dayjs
                  const submissionDate = dayjs(submission.createdAt);
                  const completedDate = submission.completedAt ? dayjs(submission.completedAt) : null;

                  // Calculate the turnaround time using dayjs duration
                  const turnaroundTimeInSeconds = submission.turnaroundTime;
                  let formattedTurnaroundTime = "";

                  if (turnaroundTimeInSeconds) {
                    const durationObj = dayjs.duration(turnaroundTimeInSeconds, "seconds");
                    if (durationObj.asMinutes() < 1) {
                      formattedTurnaroundTime = `${durationObj.asSeconds()} seconds`;
                    } else {
                      formattedTurnaroundTime = `${durationObj.minutes()} min ${durationObj.seconds()} sec`;
                    }
                  }

                  return (
                    <TableRow key={submission.id}>
                      <TableCell>{submission.user?.name}</TableCell>
                      <TableCell>
                        {submission.status === "APPROVED" ? (
                          <>
                            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                            Approved
                          </>
                        ) : (
                          <>
                            <HourglassEmptyIcon color="warning" sx={{ mr: 1 }} />
                            Pending Approval
                          </>
                        )}
                      </TableCell>
                      <TableCell>{formattedTurnaroundTime}</TableCell>
                      <TableCell>{submission.approvedByAdmin.name}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          textAlign="center"
          mt={5}
        >
          <Box
            style={{
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              backgroundColor: '#f5f5f5',
              borderRadius: '50%',
              marginBottom: '16px',
            }}
          >
            😿
          </Box>
          <Typography variant="h3" style={{ fontFamily: 'Instrument Serif', fontWeight: 550 }}>
            No data to show
          </Typography>
          <Typography variant="subtitle2" color="#636366">
            Turn Around data can be visible for newer submissions
          </Typography>
        </Box>
        )}

        {/* If there are no agreement submissions, show this message */}
        {/* {fistDraftSubmissions.length === 0 && !loading && (
          // <Typography variant="body2" color="textSecondary">
          //   Turnaround time can only be calculated for completed submissions of type "AGREEMENT_FORM".
          // </Typography>
        )} */}
      </CardContent>
    </Card>


    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h3" gutterBottom style={{ fontFamily: 'Instrument Serif', fontWeight: 550 }}>
          Final Draft
        </Typography>

        {/* Loading and Error Handling */}
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}

        {/* Display table only if there are agreement submissions */}
        {fistDraftSubmissions.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Creator</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Turnaround Time</TableCell>
                  <TableCell>Approved By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fistDraftSubmissions.map((submission) => {
                  // Convert submission date to formatted string using dayjs
                  const submissionDate = dayjs(submission.createdAt);
                  const completedDate = submission.completedAt ? dayjs(submission.completedAt) : null;

                  // Calculate the turnaround time using dayjs duration
                  const turnaroundTimeInSeconds = submission.turnaroundTime;
                  let formattedTurnaroundTime = "";

                  if (turnaroundTimeInSeconds) {
                    const durationObj = dayjs.duration(turnaroundTimeInSeconds, "seconds");
                    if (durationObj.asMinutes() < 1) {
                      formattedTurnaroundTime = `${durationObj.asSeconds()} seconds`;
                    } else {
                      formattedTurnaroundTime = `${durationObj.minutes()} min ${durationObj.seconds()} sec`;
                    }
                  }

                  return (
                    <TableRow key={submission.id}>
                      <TableCell>{submission.user?.name}</TableCell>
                      <TableCell>
                        {submission.status === "APPROVED" ? (
                          <>
                            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                            Approved
                          </>
                        ) : (
                          <>
                            <HourglassEmptyIcon color="warning" sx={{ mr: 1 }} />
                            Pending Approval
                          </>
                        )}
                      </TableCell>
                      <TableCell>{formattedTurnaroundTime}</TableCell>
                      <TableCell>{submission.approvedByAdmin.name}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          textAlign="center"
          mt={5}
        >
          <Box
            style={{
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              backgroundColor: '#f5f5f5',
              borderRadius: '50%',
              marginBottom: '16px',
            }}
          >
            😿
          </Box>
          <Typography variant="h3" style={{ fontFamily: 'Instrument Serif', fontWeight: 550 }}>
            No data to show
          </Typography>
          <Typography variant="subtitle2" color="#636366">
            Turn Around data can be visible for newer submissions
          </Typography>
        </Box>
        )}

      </CardContent>
    </Card>
    </>
    
  );
}
