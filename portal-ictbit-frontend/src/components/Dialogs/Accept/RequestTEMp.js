import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  Grid,
  List,
  ListItem,
  ListItemText,
  Modal,
  Tab,
  Tabs,
  TextField,
  useTheme,
} from '@material-ui/core';
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone';
import { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DatePicker from '@material-ui/lab/DatePicker';
import { useDropzone } from 'react-dropzone';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { experimentalStyled } from '@material-ui/core/styles';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
import AddTwoToneIcon from '@material-ui/icons/AddTwoTone';
import CloudUploadTwoToneIcon from '@material-ui/icons/CloudUploadTwoTone';
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone';
import CheckTwoToneIcon from '@material-ui/icons/CheckTwoTone';
// import ReactQuill from "react-quill";
import dynamic from 'next/dynamic';
import Checkbox from '@material-ui/core/Checkbox';

const BoxUploadWrapper = experimentalStyled(Box)(
  ({ theme }) => `
    border-radius: ${theme.general.borderRadius};
    padding: ${theme.spacing(3)};
    background: ${theme.colors.alpha.black[5]};
    border: 1px dashed ${theme.colors.alpha.black[30]};
    outline: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: ${theme.transitions.create(['border', 'background'])};

    &:hover {
      background: ${theme.colors.alpha.white[100]};
      border-color: ${theme.colors.primary.main};
    }
`
);
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const EditorWrapper = experimentalStyled(Box)(
  ({ theme }) => `

    .ql-editor {
      min-height: 100px;
    }

    .ql-toolbar.ql-snow {
      border-top-left-radius: ${theme.general.borderRadius};
      border-top-right-radius: ${theme.general.borderRadius};
    }

    .ql-toolbar.ql-snow,
    .ql-container.ql-snow {
      border-color: ${theme.colors.alpha.black[30]};
    }

    .ql-container.ql-snow {
      border-bottom-left-radius: ${theme.general.borderRadius};
      border-bottom-right-radius: ${theme.general.borderRadius};
    }

    &:hover {
      .ql-toolbar.ql-snow,
      .ql-container.ql-snow {
        border-color: ${theme.colors.alpha.black[50]};
      }
    }
`
);

const AvatarWrapper = experimentalStyled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.primary.lighter};
    color: ${theme.colors.primary.main};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarSuccess = experimentalStyled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.success.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarDanger = experimentalStyled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.error.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const projectTags = [
  { title: 'Development' },
  { title: 'Design Project' },
  { title: 'Marketing Research' },
  { title: 'Software' },
];

export default function index({ handleCloseDialog, open, setOpen, Data }) {
  const theme = useTheme();
  console.log('DataFromClicked', Data);

  const [value, setValue] = useState('one');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    handleCloseDialog(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const {
    acceptedFiles,
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept: 'image/jpeg, image/png',
  });

  const files = acceptedFiles.map((file, index) => (
    <ListItem disableGutters component='div' key={index}>
      <ListItemText primary={file.name} />
      <b>{file.size} bytes</b>
      <Divider />
    </ListItem>
  ));

  const [isClickEror, setIsClickEror] = useState(
    {
      CloudName: false,
      providerPermssion: false,
    }

    // etc.
  );

  const [isDescriptionCommentOpen, setIsDescriptionCommentOpen] =
    useState(false);
  const [isTagsCommentOpen, setIsTagsCommentOpen] = useState(false);
  const [isUploadFilesCommentOpen, setIsUploadFilesCommentOpen] =
    useState(false);
  const [isDueDateCommentOpen, setIsDueDateCommentOpen] = useState(false);

  const toggleProjectTitleComment = (paramter) => {
    for (const [key, value] of Object.entries(isClickEror)) {
      if (`${key}` === paramter) {
        var keys = `${key}`;
        setIsClickEror((prevState) => ({
          ...prevState,
          [keys]: !value,
        }));

        console.log(`${key}: ${value}`);
      }
    }
    // isClickEror.filter = (obj, predicate) => {
    //   if (obj[paramter] == paramter) {
    //     console.log(obj);
    //   }
    // };

    // setIsClickEror((prevState) => ({ prevState: !prevState[paramter] }));
  };
  const toggleDescriptionComment = () => {
    setIsDescriptionCommentOpen((prevState) => !prevState);
  };
  const toggleUploadFileComment = () => {
    setIsUploadFilesCommentOpen((prevState) => !prevState);
  };
  const toggleDueDateComment = () => {
    setIsDueDateCommentOpen((prevState) => !prevState);
  };
  const toggleTagsComment = () => {
    setIsTagsCommentOpen((prevState) => !prevState);
  };

  return (
    <Box py={'2rem'} px={'1.5rem'}>
      {/*Modal is there*/}
      <Dialog
        open={open}
        maxWidth={'md'}
        fullWidth
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle sx={{ p: 3 }} disableTypography>
          <Typography variant='h4' gutterBottom>
            {'Create new project'}
          </Typography>
          <Typography variant='subtitle2'>
            {'Use this dialog window to add a new project'}
          </Typography>
        </DialogTitle>

        <Formik
          initialValues={{
            title: '',
            tags: '',
            submit: null,
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().max(255).required('This field is required'),
          })}
          onSubmit={async (
            values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              // await wait(1000);
              console.log(values, 'these are values');

              const formKeys = Object.entries(values);

              const allComments = formKeys.map((key) => {
                if (key[0].includes('checkbox')) {
                  const checkBoxIndex = +key[0].split('_')[1];
                  return {
                    checkBoxIndex,
                    message: key[1],
                  };
                } else {
                  return null;
                }
              });

              const filteredComments = allComments.filter(
                (comment) => comment !== null
              );

              console.log(filteredComments, 'Here are the filtered comments');

              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              handleClose();

              // handleCreateProjectSuccess();
            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}>
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
          }) => (
            <div dir={'rtl'}>
              <form onSubmit={handleSubmit}>
                <DialogContent divider sx={{ p: 3 }}>
                  <Grid container spacing={0}>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={2}
                      justifyContent='flex-end'
                      textAlign={{ sm: 'right' }}>
                      <Box
                        pr={3}
                        sx={{ pt: `${theme.spacing(2)}`, pb: { xs: 1, md: 0 } }}
                        alignSelf='center'>
                        <b>{'Project title'}:</b>
                      </Box>
                    </Grid>
                    <Grid
                      sx={{
                        mb: `${theme.spacing(3)}`,
                      }}
                      item
                      xs={12}
                      sm={9}
                      md={10}
                      style={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        error={Boolean(touched.title && errors.title)}
                        fullWidth
                        helperText={touched.title && errors.title}
                        name='title'
                        placeholder={'Project title here...'}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.title}
                        variant='outlined'
                      />
                      <Checkbox
                        checked={isClickEror.CloudName}
                        onClick={() => toggleProjectTitleComment('CloudName')}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Grid>

                    {isClickEror.CloudName && (
                      <>
                        <Grid
                          item
                          xs={12}
                          sm={3}
                          md={2}
                          justifyContent='flex-end'
                          textAlign={{ sm: 'right' }}>
                          <Box
                            pr={3}
                            sx={{
                              pt: `${theme.spacing(2)}`,
                              pb: { xs: 1, md: 0 },
                            }}
                            alignSelf='center'>
                            <b>{'Project title Comment'}:</b>
                          </Box>
                        </Grid>
                        <Grid
                          sx={{
                            mb: `${theme.spacing(3)}`,
                          }}
                          item
                          xs={12}
                          sm={9}
                          md={10}
                          style={{ display: 'flex', alignItems: 'center' }}>
                          <TextField
                            error={Boolean(
                              touched.checkboxIndex_0 && errors.checkboxIndex_0
                            )}
                            style={{ width: '25rem' }}
                            helperText={
                              touched.checkboxIndex_0 && errors.checkboxIndex_0
                            }
                            name='checkboxIndex_0'
                            placeholder={'Project title Comment here...'}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.checkboxIndex_0}
                            variant='outlined'
                          />
                        </Grid>
                      </>
                    )}

                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={2}
                      textAlign={{ sm: 'right' }}>
                      <Box pr={3} sx={{ pb: { xs: 1, md: 0 } }}>
                        <b>{'Description'}:</b>
                      </Box>
                    </Grid>

                    <Grid
                      style={{ display: 'flex', alignItems: 'center' }}
                      sx={{
                        mb: `${theme.spacing(3)}`,
                      }}
                      item
                      xs={12}
                      sm={9}
                      md={10}>
                      <EditorWrapper style={{ width: '100%' }}>
                        <ReactQuill />
                      </EditorWrapper>
                      <Checkbox
                        checked={isClickEror.providerPermssion}
                        onClick={() =>
                          toggleProjectTitleComment('providerPermssion')
                        }
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Grid>

                    {isClickEror.providerPermssion && (
                      <>
                        <Grid
                          item
                          xs={12}
                          sm={3}
                          md={2}
                          justifyContent='flex-end'
                          textAlign={{ sm: 'right' }}>
                          <Box
                            pr={3}
                            sx={{
                              pt: `${theme.spacing(2)}`,
                              pb: { xs: 1, md: 0 },
                            }}
                            alignSelf='center'>
                            <b>{' providerPermssion '}:</b>
                          </Box>
                        </Grid>
                        <Grid
                          sx={{
                            mb: `${theme.spacing(3)}`,
                          }}
                          item
                          xs={12}
                          sm={9}
                          md={10}
                          style={{ display: 'flex', alignItems: 'center' }}>
                          <TextField
                            error={Boolean(
                              touched.checkboxIndex_1 && errors.checkboxIndex_1
                            )}
                            style={{ width: '25rem' }}
                            helperText={
                              touched.checkboxIndex_0 && errors.checkboxIndex_1
                            }
                            name='checkboxIndex_1'
                            placeholder={'Project Description Comment here...'}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.checkboxIndex_1}
                            variant='outlined'
                          />
                        </Grid>
                      </>
                    )}

                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={2}
                      justifyContent='flex-end'
                      textAlign={{ sm: 'right' }}>
                      <Box
                        pr={3}
                        sx={{ pt: `${theme.spacing(2)}`, pb: { xs: 1, md: 0 } }}
                        alignSelf='center'>
                        <b>{'Tags'}:</b>
                      </Box>
                    </Grid>
                    <Grid
                      sx={{
                        mb: `${theme.spacing(3)}`,
                      }}
                      item
                      xs={12}
                      sm={9}
                      md={10}
                      style={{ display: 'flex', alignItems: 'center' }}>
                      <Autocomplete
                        multiple
                        sx={{ m: 0 }}
                        limitTags={2}
                        options={projectTags}
                        getOptionLabel={(option) => option.title}
                        style={{ width: '100%' }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            variant='outlined'
                            placeholder={'Select project tags...'}
                          />
                        )}
                      />
                      <Checkbox
                        checked={isTagsCommentOpen}
                        onChange={toggleTagsComment}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Grid>

                    {isTagsCommentOpen && (
                      <>
                        <Grid
                          item
                          xs={12}
                          sm={3}
                          md={2}
                          justifyContent='flex-end'
                          textAlign={{ sm: 'right' }}>
                          <Box
                            pr={3}
                            sx={{
                              pt: `${theme.spacing(2)}`,
                              pb: { xs: 1, md: 0 },
                            }}
                            alignSelf='center'>
                            <b>{'Project Tags Comment'}:</b>
                          </Box>
                        </Grid>
                        <Grid
                          sx={{
                            mb: `${theme.spacing(3)}`,
                          }}
                          item
                          xs={12}
                          sm={9}
                          md={10}
                          style={{ display: 'flex', alignItems: 'center' }}>
                          <TextField
                            error={Boolean(
                              touched.checkboxIndex_2 && errors.checkboxIndex_2
                            )}
                            style={{ width: '25rem' }}
                            helperText={
                              touched.checkboxIndex_2 && errors.checkboxIndex_2
                            }
                            name='checkboxIndex_2'
                            placeholder={'Project Description Comment here...'}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.checkboxIndex_2}
                            variant='outlined'
                          />
                        </Grid>
                      </>
                    )}

                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={2}
                      textAlign={{ sm: 'right' }}>
                      <Box pr={3} sx={{ pb: { xs: 1, md: 0 } }}>
                        <b>{'Upload files'}:</b>
                      </Box>
                    </Grid>
                    <Grid
                      sx={{
                        mb: `${theme.spacing(3)}`,
                      }}
                      item
                      xs={12}
                      sm={9}
                      md={10}
                      style={{ display: 'flex', alignItems: 'center' }}>
                      <BoxUploadWrapper
                        style={{ width: '100%' }}
                        {...getRootProps()}>
                        <input {...getInputProps()} />
                        {isDragAccept && (
                          <>
                            <AvatarSuccess variant='rounded'>
                              <CheckTwoToneIcon />
                            </AvatarSuccess>
                            <Typography sx={{ mt: 2 }}>
                              {'Drop the files to start uploading'}
                            </Typography>
                          </>
                        )}
                        {isDragReject && (
                          <>
                            <AvatarDanger variant='rounded'>
                              <CloseTwoToneIcon />
                            </AvatarDanger>
                            <Typography sx={{ mt: 2 }}>
                              {'You cannot upload these file types'}
                            </Typography>
                          </>
                        )}
                        {!isDragActive && (
                          <>
                            <AvatarWrapper variant='rounded'>
                              <CloudUploadTwoToneIcon />
                            </AvatarWrapper>
                            <Typography sx={{ mt: 2 }}>
                              {'Drag & drop files here'}
                            </Typography>
                          </>
                        )}
                      </BoxUploadWrapper>
                      {files.length > 0 && (
                        <>
                          <Alert sx={{ py: 0, mt: 2 }} severity='success'>
                            {'You have uploaded'} <b>{files.length}</b>{' '}
                            {'files'}!
                          </Alert>
                          <Divider sx={{ mt: 2 }} />
                          <List disablePadding component='div'>
                            {files}
                          </List>
                        </>
                      )}
                      <Checkbox
                        checked={isUploadFilesCommentOpen}
                        onChange={toggleUploadFileComment}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Grid>

                    {isUploadFilesCommentOpen && (
                      <>
                        <Grid
                          item
                          xs={12}
                          sm={3}
                          md={2}
                          justifyContent='flex-end'
                          textAlign={{ sm: 'right' }}>
                          <Box
                            pr={3}
                            sx={{
                              pt: `${theme.spacing(2)}`,
                              pb: { xs: 1, md: 0 },
                            }}
                            alignSelf='center'>
                            <b>{'Upload files Comment'}:</b>
                          </Box>
                        </Grid>
                        <Grid
                          sx={{
                            mb: `${theme.spacing(3)}`,
                          }}
                          item
                          xs={12}
                          sm={9}
                          md={10}
                          style={{ display: 'flex', alignItems: 'center' }}>
                          <TextField
                            error={Boolean(
                              touched.checkboxIndex_3 && errors.checkboxIndex_3
                            )}
                            style={{ width: '25rem' }}
                            helperText={
                              touched.checkboxIndex_3 && errors.checkboxIndex_3
                            }
                            name='checkboxIndex_3'
                            placeholder={'Upload files Comment here...'}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.checkboxIndex_3}
                            variant='outlined'
                          />
                        </Grid>
                      </>
                    )}

                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={2}
                      justifyContent='flex-end'
                      textAlign={{ sm: 'right' }}>
                      <Box
                        pr={3}
                        sx={{ pt: `${theme.spacing(2)}`, pb: { xs: 1, md: 0 } }}
                        alignSelf='center'>
                        <b>{'Due Date'}:</b>
                      </Box>
                    </Grid>
                    <Grid
                      sx={{
                        mb: `${theme.spacing(3)}`,
                      }}
                      item
                      xs={12}
                      sm={9}
                      md={10}
                      style={{ display: 'flex', alignItems: 'center' }}>
                      <DatePicker
                        value={value}
                        onChange={(newValue) => {
                          setValue(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            placeholder={'Select due date...'}
                            {...params}
                          />
                        )}
                      />
                      <Checkbox
                        checked={isDueDateCommentOpen}
                        onChange={toggleDueDateComment}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Grid>

                    {isDueDateCommentOpen && (
                      <>
                        <Grid
                          item
                          xs={12}
                          sm={3}
                          md={2}
                          justifyContent='flex-end'
                          textAlign={{ sm: 'right' }}>
                          <Box
                            pr={3}
                            sx={{
                              pt: `${theme.spacing(2)}`,
                              pb: { xs: 1, md: 0 },
                            }}
                            alignSelf='center'>
                            <b>{'Due date Comments'}:</b>
                          </Box>
                        </Grid>
                        <Grid
                          sx={{
                            mb: `${theme.spacing(3)}`,
                          }}
                          item
                          xs={12}
                          sm={9}
                          md={10}
                          style={{ display: 'flex', alignItems: 'center' }}>
                          <TextField
                            error={Boolean(
                              touched.checkboxIndex_4 && errors.checkboxIndex_4
                            )}
                            style={{ width: '25rem' }}
                            helperText={
                              touched.checkboxIndex_4 && errors.checkboxIndex_4
                            }
                            name='checkboxIndex_4'
                            placeholder={'Due date Comment here...'}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.checkboxIndex_4}
                            variant='outlined'
                          />
                        </Grid>
                      </>
                    )}

                    <Grid
                      sx={{
                        mb: `${theme.spacing(3)}`,
                      }}
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Button
                        sx={{ mr: 2 }}
                        type='submit'
                        startIcon={
                          isSubmitting ? <CircularProgress size='1rem' /> : null
                        }
                        disabled={Boolean(errors.submit) || isSubmitting}
                        variant='contained'
                        size='large'
                        style={{ margin: '0 .5rem' }}>
                        {'Create project'}
                      </Button>
                      <Button
                        color='secondary'
                        size='large'
                        variant='outlined'
                        onClick={handleClose}
                        style={{ margin: '0 .5rem' }}>
                        {'Cancel'}
                      </Button>

                      <Button
                        color='secondary'
                        size='large'
                        variant='outlined'
                        onClick={handleClose}
                        style={{ margin: '0 .5rem' }}>
                        {'Cancel'}
                      </Button>

                      <Button
                        color='secondary'
                        size='large'
                        variant='outlined'
                        onClick={handleClose}
                        style={{ margin: '0 .5rem' }}>
                        {'Cancel'}
                      </Button>
                    </Grid>
                  </Grid>
                </DialogContent>
              </form>
            </div>
          )}
        </Formik>
      </Dialog>
    </Box>
  );
}
