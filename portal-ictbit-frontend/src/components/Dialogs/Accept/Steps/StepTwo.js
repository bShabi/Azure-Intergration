import { makeStyles } from '@material-ui/styles';
import { TextField, Box, Divider, Grid, Container } from '@material-ui/core';
import { useContext, useState, useEffect } from 'react';
import SelectFormik from '../SelectFormik';
import requestManagerApi from '../../../../api/request-manager-api';
import Checkbox from '@material-ui/core/Checkbox';
import SchedulingConstants from '../../../../constants/scheduling-constants';

const DENIED_CHECKBOX_COLOR = 'rgb(244, 67, 54)';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: 20,
    textAlign: 'center',
    color: 'red',
  },
  rootSelect: {
    width: '100%',
    position: 'relative',
    overflow: 'auto',
    maxHeight: 200,
  },
  textFieldReadOnly: {
    width: 350,
  },
  fieldLabel: {
    width: 450,
  },
}));

export default function StepTwo({
  errors,
  handleBlur,
  handleChange,
  isSubmitting,
  touched,
  values,
  formValues,
  setValues,
  isClickErrors,
  toggleCheckBoxComment,
  Data,
  handleFormsValueChange,
  isUserMode,
  isFieldEnableToEdit,
  isNeedToDisplayCheckBox,
  isCheckBoxChecked,
  isCommentFieldDisplay,
  isDenied,
}) {
  const classes = useStyles();
  const [providerCloud, setProviderCloud] = useState();
  const [cloudPremission, setCloudPremission] = useState();
  const [providerEnvirment, setProviderEnvirment] = useState();
  const [schedulingCloud, setSchedulingCloud] = useState();
  const [budgetOption, setBudgetOption] = useState();

  // const isDenied = Data.requests_status_tbl.RequestsStatusName === 'denied';

  //#region init option
  const setCloudPremissionOption = async () => {
    let cloudPremission_init = [];
    let cloudPremissionFromServer =
      await requestManagerApi.getCloudPremission();

    cloudPremissionFromServer.forEach((element) => {
      cloudPremission_init.push({
        id: element._id,
        optionValue: element.CloudPermissionName,
      });
    });

    setCloudPremission(cloudPremission_init);
  };

  const setCloudProivderOption = async () => {
    let cloudProivder_init = [];
    let cloudProivderFromServer = await requestManagerApi.getCloudProivder();

    cloudProivderFromServer.forEach((element) => {
      cloudProivder_init.push({
        id: element._id,
        optionValue: element.Cloud,
      });
    });
    setProviderCloud(cloudProivder_init);
  };

  const setCloudEnvirmentOption = async () => {
    let cloudEnvirment_init = [];
    let environmentCloudFromServer =
      await requestManagerApi.getCloudEnvirment();

    environmentCloudFromServer?.forEach((element) => {
      cloudEnvirment_init.push({
        id: element._id,
        optionValue: element.CloudEnvironmentAreaName,
      });
      setProviderEnvirment(cloudEnvirment_init);
    });
  };

  const setCloudSchedulingOption = async () => {
    let schedulingCloud_init = [];
    let cloudSchedulingFromServer =
      await requestManagerApi.getCloudScheduling();

    cloudSchedulingFromServer?.forEach((element) => {
      schedulingCloud_init.push({
        id: element._id,
        optionValue: element.SchedulingOption,
      });
    });

    setSchedulingCloud(schedulingCloud_init);
  };

  //#endregion
  /* This is init options to formik*/

  const initAllOptions = async () => {
    if (
      providerCloud == null &&
      cloudPremission == null &&
      providerEnvirment == null &&
      schedulingCloud == null
    ) {
      await setCloudPremissionOption();
      await setCloudProivderOption();
      await setCloudSchedulingOption();
      await setCloudEnvirmentOption();
    }
  };
  // /*
  //   Display Read Only field always on Manager mode or on UserMode when status is not denied

  //   Display SelectFormik field on UserMode and status is denied
  //  */
  // const isFieldEnableToEdit = () => {
  //   return !isUserMode || !isDenied;
  // };

  // /*
  //   Display checkbox only on UserMode and when status is not denied and also check is deniedNote is not null or empty  */
  // const isNeedToDisplayCheckBox = (deniedNote) => {
  //   return !isDenied && isUserMode && !!deniedNote;
  //   //!isDenied && isUserMode && !!values.providerCloud_deniedNote;
  // };
  // /*
  //   Display checkBox as checked when field has any error or on usermode and there is any text in denined note
  // */
  // const isCheckBoxChecked = (hasAnyError, deniedNote) => {
  //   return hasAnyError || (isUserMode && !!deniedNote);
  // };

  // /*
  //   Display comment field only when field have any error or denied node is not null or empty
  // */
  // const isCommentFieldDisplay = (hasAnyError, deniedNote) => {
  //   return !!deniedNote || hasAnyError;
  // };
  useEffect(() => {
    initAllOptions();
  }, []);

  return (
    <>
      <Divider />

      <div
        style={{
          textAlign: 'right',
          fontSize: 20,
          paddingBottom: 35,
          paddingTop: 10,
        }}>
        <b style={{ color: '#4457da' }}>פרטים טכניים</b>
        <br></br>
      </div>
      <Container>
        <Grid container spacing={2}>
          <Grid>
            <Grid>
              <Box>
                <strong style={{ fontSize: 16 }}>שם ספקית הענן:</strong>
              </Box>
            </Grid>

            {isFieldEnableToEdit() ? (
              <TextField
                className={classes.textFieldReadOnly}
                disabled={isFieldEnableToEdit()}
                name='providerCloud'
                options={providerCloud}
                value={Data?.cloud_name?.Cloud}
              />
            ) : (
              <SelectFormik
                className={classes.textFieldReadOnly}
                name='providerCloud'
                options={providerCloud}
                value={values.providerCloud}
              />
            )}
            <Checkbox
              style={{
                display: isNeedToDisplayCheckBox(
                  values.providerCloud_deniedNote
                )
                  ? 'none'
                  : '',
                color: DENIED_CHECKBOX_COLOR,
              }}
              disabled={isUserMode}
              checked={isCheckBoxChecked(
                isClickErrors.CloudName,
                values.providerCloud_deniedNote
              )}
              onClick={() => toggleCheckBoxComment('CloudName')}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Grid>
          {/* Number 1 */}

          {isCommentFieldDisplay(
            isClickErrors.CloudName,
            values.providerCloud_deniedNote
          ) && (
            <>
              <Grid>
                <Grid
                  sx={{
                    mb: `12px`,
                  }}
                  item
                  xs={12}
                  sm={12}
                  md={12}>
                  <Box>
                    <strong style={{ fontSize: 16 }}>הערה:</strong>
                  </Box>
                </Grid>
                <TextField
                  rows={3}
                  multiline
                  className={classes.textFieldReadOnly}
                  disabled={isUserMode}
                  onChange={handleChange}
                  name='providerCloud_deniedNote'
                  value={values.providerCloud_deniedNote}
                  variant='outlined'
                />
              </Grid>
            </>
          )}

          <Grid
            sx={{
              mb: `12px`,
            }}
            item
            xs={12}
            sm={12}
            md={12}>
            <Grid>
              <Box>
                <strong style={{ fontSize: 16 }}>שם הפרויקט בענן:</strong>
              </Box>
            </Grid>
            <TextField
              className={classes.textFieldReadOnly}
              error={Boolean(touched.nameInCloud && errors.nameInCloud)}
              disabled={isFieldEnableToEdit}
              helperText={touched.nameInCloud && errors.nameInCloud}
              name='nameInCloud'
              placeholder={`B-“star_name”-“number”-”01…02…”`}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.nameInCloud}
              variant='outlined'
            />
            <Checkbox
              style={{
                display: isNeedToDisplayCheckBox(values.nameInCloud_deniedNote)
                  ? 'none'
                  : '',
                color: DENIED_CHECKBOX_COLOR,
              }}
              disabled={isUserMode}
              checked={isCheckBoxChecked(
                isClickErrors.nameInCloud,
                values.nameInCloud_deniedNote
              )}
              onClick={() => {
                console.log(isClickErrors);
                toggleCheckBoxComment('nameInCloud');
              }}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Grid>
          {/* Number 2 */}
          {isCommentFieldDisplay(
            isClickErrors.nameInCloud,
            values.nameInCloud_deniedNote
          ) && (
            <>
              <Grid
                sx={{
                  mb: `12px`,
                }}
                item
                xs={12}
                sm={12}
                md={12}>
                <Box>
                  <strong style={{ fontSize: 16 }}>הערה:</strong>
                </Box>
              </Grid>
              <Grid
                sx={{
                  mb: 3,
                }}
                item
                xs={12}
                sm={12}
                md={12}>
                <TextField
                  rows={3}
                  multiline
                  className={classes.textFieldReadOnly}
                  disabled={isUserMode}
                  onChange={handleChange}
                  name='nameInCloud_deniedNote'
                  value={values.nameInCloud_deniedNote}
                  variant='outlined'
                />
              </Grid>
            </>
          )}

          <Grid
            sx={{
              mb: `12px`,
            }}
            item
            xs={12}
            sm={12}
            md={12}>
            <Grid>
              <Box>
                <strong style={{ fontSize: 16 }}> Environment:</strong>
              </Box>
            </Grid>
            {isFieldEnableToEdit() ? (
              <TextField
                className={classes.textFieldReadOnly}
                disabled={isFieldEnableToEdit()}
                name='environmentCloud'
                options={providerEnvirment}
                value={
                  Data.cloud_environment_area_name?.CloudEnvironmentAreaName
                }
              />
            ) : (
              <SelectFormik
                name='environmentCloud'
                options={providerEnvirment}
                value={values.environmentCloud}
              />
            )}
            <Checkbox
              style={{
                display: !isDenied && isUserMode ? 'none' : '',
                color: DENIED_CHECKBOX_COLOR,
              }}
              disabled={isUserMode}
              checked={isCheckBoxChecked(
                isClickErrors.environmentCloud,
                values.environment_deniedNote
              )}
              onClick={() => toggleCheckBoxComment('environmentCloud')}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Grid>
          {/* Number 4 */}

          {isCommentFieldDisplay(
            isClickErrors.environmentCloud,
            values.environment_deniedNote
          ) && (
            <>
              <Grid
                sx={{
                  mb: `12px`,
                }}
                item
                xs={12}
                sm={12}
                md={12}>
                <Box>
                  <strong style={{ fontSize: 16 }}>הערה:</strong>
                </Box>
              </Grid>

              <TextField
                rows={3}
                multiline
                className={classes.textFieldReadOnly}
                disabled={isUserMode}
                onChange={handleChange}
                name='environment_deniedNote'
                value={values.environment_deniedNote}
                variant='outlined'
              />
            </>
          )}
        </Grid>

        <Grid
          sx={{
            mb: `12px`,
          }}
          item
          xs={12}
          sm={12}
          md={12}>
          <Grid>
            <Box>
              <strong style={{ fontSize: 16 }}> ביצוע Scheduling:</strong>
            </Box>
            {isFieldEnableToEdit() ? (
              <TextField
                className={classes.textFieldReadOnly}
                disabled={isFieldEnableToEdit()}
                name='schedulingCloud'
                options={schedulingCloud}
                value={Data?.scheduling?.SchedulingOption}
              />
            ) : (
              <SelectFormik
                name='schedulingCloud'
                options={schedulingCloud}
                value={values.schedulingCloud}
              />
            )}
            <Checkbox
              style={{
                display: !isDenied && isUserMode ? 'none' : '',
                color: DENIED_CHECKBOX_COLOR,
              }}
              disabled={isUserMode}
              checked={isCheckBoxChecked(
                isClickErrors.schedulingCloud,
                values.scheduling_deniedNote
              )}
              onClick={() => toggleCheckBoxComment('schedulingCloud')}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Grid>
          {/* Number 5 */}

          {isCommentFieldDisplay(
            isClickErrors.schedulingCloud,
            values.scheduling_deniedNote
          ) && (
            <>
              <Grid>
                <Box>
                  <strong style={{ fontSize: 16 }}>הערה:</strong>
                </Box>
              </Grid>
              <Grid
                sx={{
                  mb: 3,
                }}
                item
                xs={12}
                sm={12}
                md={12}>
                <TextField
                  rows={3}
                  multiline
                  className={classes.textFieldReadOnly}
                  disabled={isUserMode}
                  onChange={handleChange}
                  name='scheduling_deniedNote'
                  value={values.scheduling_deniedNote}
                  variant='outlined'
                />
              </Grid>
            </>
          )}
          {Data.scheduling?.SchedulingOption === 'none' && (
            <>
              <Grid item xs={12} sm={12} md={12} textAlign={{ sm: 'right' }}>
                <Box>
                  <strong style={{ fontSize: 16 }}>
                    פירוט סיבת Scheduling:
                  </strong>
                </Box>
              </Grid>
              <Grid
                sx={{
                  mb: `12px`,
                }}
                item
                xs={12}
                sm={12}
                md={12}>
                <TextField
                  multiline
                  rows={3}
                  className={classes.textFieldReadOnly}
                  disabled={isFieldEnableToEdit()}
                  error={Boolean(
                    touched.reasonOfUnUseofScheduling &&
                      errors.reasonOfUnUseofScheduling
                  )}
                  classes={classes.textFieldReadOnly}
                  name='reasonOfUnUseofScheduling'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.reasonOfUnUseofScheduling}
                  variant='outlined'
                />
                <Checkbox
                  style={{
                    display: !isDenied && isUserMode ? 'none' : '',
                    color: DENIED_CHECKBOX_COLOR,
                  }}
                  disabled={isUserMode}
                  checked={
                    isClickErrors.reasonOfUnUseofScheduling ||
                    (isUserMode &&
                      !!values.reasonOfUnUseofScheduling_deniedNote)
                  }
                  onClick={() =>
                    toggleCheckBoxComment('reasonOfUnUseofScheduling')
                  }
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </Grid>
              {/* Number 7 */}

              {isCommentFieldDisplay(
                isClickErrors.reasonOfUnUseofScheduling,
                values.reasonOfUnUseofScheduling_deniedNote
              ) && (
                <>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    justifyContent='flex-end'
                    textAlign={{ sm: 'right' }}>
                    <Box
                      pr={3}
                      sx={{ pt: 3, pb: { xs: 1, md: 0 } }}
                      alignSelf='center'>
                      <strong style={{ fontSize: 16 }}>הערה:</strong>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: 3,
                    }}
                    item
                    xs={12}
                    sm={12}
                    md={12}>
                    <TextField
                      rows={3}
                      multiline
                      className={classes.textFieldReadOnly}
                      disabled={isUserMode}
                      onChange={handleChange}
                      name='reasonOfUnUseofScheduling_deniedNote'
                      value={values.reasonOfUnUseofScheduling_deniedNote}
                      variant='outlined'
                    />
                  </Grid>
                </>
              )}
            </>
          )}
        </Grid>
      </Container>
    </>
  );
}
