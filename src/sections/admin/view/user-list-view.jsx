import * as yup from 'yup';
import isEqual from 'lodash/isEqual';
import { Toaster } from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useCallback } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import {
  Box,
  Menu,
  Step,
  Stack,
  Dialog,
  Select,
  Stepper,
  MenuItem,
  TextField,
  StepLabel,
  Typography,
  InputLabel,
  DialogTitle,
  StepContent,
  FormControl,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
// eslint-disable-next-line import/no-cycle

import PropTypes from 'prop-types';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { _roles, USER_STATUS_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

// eslint-disable-next-line import/no-cycle
import UserTableRow from '../user-table-row';
import UserTableToolbar from '../user-table-toolbar';
import AdminCreateManager from '../admin-create-form';
import UserTableFiltersResult from '../user-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 180 },
  { id: 'phoneNumber', label: 'Phone Number', width: 220 },
  { id: 'designation', label: 'Designation', width: 180 },
  { id: 'country', label: 'Country', width: 100 },
  { id: 'mode', label: 'Mode', width: 100 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

export const MODULE_ITEMS = [
  {
    name: 'Manage Creator',
    value: 'creator',
  },
  {
    name: 'Manage Campaign',
    value: 'campaign',
  },
  {
    name: 'Manage Brand',
    value: 'brand',
  },
  {
    name: 'Manage Metric',
    value: 'metric',
  },
  {
    name: 'Manage Invoice',
    value: 'invoice',
  },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function UserListView({ admins }) {
  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const handleClickOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };
  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(admins);

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered?.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await axiosInstance.delete(`${endpoints.admin.delete}/${id}`);
        const deleteRows = tableData.filter((row) => row.id !== id);
        setTableData(deleteRows);
        enqueueSnackbar('Successfully deleted admin');
      } catch (error) {
        enqueueSnackbar('Error delete admin', { variant: 'error' });
      }
    },
    [enqueueSnackbar, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    permission: yup.array().of(
      yup.object().shape({
        module: yup.string().required(),
        permissions: yup.array().required(),
      })
    ),
  });

  const {
    control,
    handleSubmit,

    formState: { errors },
  } = useForm({
    defaultValues: {
      permission: [
        {
          module: '',
          permissions: [],
        },
      ],
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'permission',
  });

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post(endpoints.users.newAdmin, data);
      enqueueSnackbar('Link has been sent to admin!');
      handleCloseDialog();
      handleClose();
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const inviteAdminDialog = (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit(onSubmit),
      }}
    >
      <DialogTitle>Invite Admin</DialogTitle>

      <DialogContent>
        {/* <DialogContentText>Please enter the email you wish to use the system.</DialogContentText> */}
        <Stepper activeStep={activeStep} orientation="vertical">
          <Step>
            <StepLabel>Permission</StepLabel>
            <StepContent>
              {fields.map((elem, index) => (
                <Box key={index} display="flex" gap={2} my={2} alignItems="center">
                  <Controller
                    name={`permission.${index}.module`}
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={
                          errors.permission &&
                          errors.permission[index] &&
                          errors.permission[index].module
                        }
                      >
                        <InputLabel id="module">Module</InputLabel>
                        <Select labelId="module" label="Module" {...field}>
                          {MODULE_ITEMS.map((item, a) => (
                            <MenuItem value={item.value} key={a}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />

                  <Controller
                    name={`permission.${index}.permissions`}
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={
                          errors.permission &&
                          errors.permission[index] &&
                          errors.permission[index].permissions
                        }
                      >
                        <InputLabel id="permission">Permission</InputLabel>
                        <Select
                          labelId="permission"
                          label="Permission"
                          {...field}
                          required
                          multiple
                        >
                          <MenuItem value="create">Create</MenuItem>
                          <MenuItem value="read">Read</MenuItem>
                          <MenuItem value="update">Update</MenuItem>
                          <MenuItem value="delete">Delete</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                  <IconButton color="error" onClick={() => remove(index)}>
                    <Iconify icon="mdi:trash" />
                  </IconButton>
                </Box>
              ))}

              {fields.length < 5 && (
                <Button
                  fullWidth
                  variant="outlined"
                  // onClick={() => permissionLength < 5 && setPermissionLength((prev) => prev + 1)}
                  onClick={() => append({ module: '', permissions: [] })}
                  sx={{
                    my: 2,
                  }}
                >
                  +
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                // onClick={() => permissionLength < 5 && setPermissionLength((prev) => prev + 1)}
                onClick={handleNext}
                sx={{
                  my: 2,
                }}
              >
                Next
              </Button>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Email</StepLabel>
            <StepContent>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="outlined"
                    error={errors.email}
                  />
                )}
              />
              <Button
                variant="outlined"
                color="warning"
                onClick={handleBack}
                sx={{
                  my: 2,
                }}
              >
                Back
              </Button>
            </StepContent>
          </Step>
        </Stepper>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleCloseDialog();
            handleClose();
          }}
        >
          Cancel
        </Button>
        <Button type="submit">Invite</Button>
      </DialogActions>
    </Dialog>
  );

  useEffect(() => {
    setTableData(admins && admins.filter((admin) => admin?.id !== user?.id));
  }, [admins, user]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List Admins"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Admin' },
            { name: 'List' },
          ]}
          action={
            <>
              <IconButton
                sx={{
                  bgcolor: 'whitesmoke',
                }}
                onClick={handleClick}
              >
                <Iconify icon="mingcute:add-line" />
              </IconButton>
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
                    handleClickOpenDialog();
                  }}
                >
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Iconify icon="mdi:invite" />
                    <Typography variant="button">Invite admin</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem onClick={handleClickOpenCreateDialog}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Iconify icon="material-symbols:add" />
                    <Typography variant="button">Create admin</Typography>
                  </Stack>
                </MenuItem>
              </Menu>
            </>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        {inviteAdminDialog}

        <AdminCreateManager open={openCreateDialog} onClose={handleCloseCreateDialog} />

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'active' && 'success') ||
                      (tab.value === 'pending' && 'warning') ||
                      (tab.value === 'banned' && 'error') ||
                      'default'
                    }
                  >
                    {['active', 'pending', 'banned', 'rejected'].includes(tab.value)
                      ? tableData.filter((item) => item.status === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <UserTableToolbar filters={filters} onFilters={handleFilters} roleOptions={_roles} />

          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    ?.slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
      <Toaster />
    </>
  );
}

UserListView.propTypes = {
  admins: PropTypes.array,
};

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, role } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) => user?.name?.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.role));
  }

  return inputData;
}
