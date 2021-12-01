import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    direction: 'rtl',

    root: {
        width: '100%',
        backgroundColor: 'white'
    },
    backButton: {
        marginRight: 2,
    },
    instructions: {
        marginTop: 1,
        marginBottom: 1,
    },
}));

function getSteps() {
    return ['פרטים אישיים', 'פרטים טכניים', ' תקציב'];
}

function getStepContent(stepIndex) {
    switch (stepIndex) {
        case 0:
            return 'פרטים אישים';
        case 1:
            return 'פרטים טכנים';
        case 2:
            return 'תקציב';
        default:
            return 'Unknown stepIndex';
    }
}

export default function HorizontalLabelPositionBelowStepper({ activeStep }) {

    const classes = useStyles();
    const steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(2);
    };

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div>

                <div dir="rtl">
                    <Typography className={classes.instructions}>

                        {/* Step children */}
                        {/* {getStepContent(activeStep)} */}
                    </Typography>

                </div>

            </div>
        </div>
    );
}
