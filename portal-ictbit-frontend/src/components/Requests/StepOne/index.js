import { Grid, Box, TextField } from '@material-ui/core';

export default function index() {
    return (
        <div dir="rtl">
            <Grid container spacing={0}>
                <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                >
                    <Box
                        pr={3}
                        sx={{ pt: 1, pb: { xs: 1, md: 0 } }}
                        alignSelf="center"
                    >
                        <b>Project title:</b>
                    </Box>
                </Grid>
                <Grid
                    sx={{
                        mb: 2
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                >
                    <TextField

                        fullWidth
                        name="title"
                        placeholder='Project title here...'

                        variant="outlined"
                    />
                </Grid>
            </Grid>

        </div>
    )
}
