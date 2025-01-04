import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../App.css'
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar } from '@mui/material';

 // Theme setup
 const defaultTheme = createTheme();

export default function Authentication() {

    const [username, setUsername] = React.useState()
    const [password, setPassword] = React.useState()
    const [name, setName] = React.useState()
    const [error, setError] = React.useState();
    const [message, setMessage] = React.useState()

    const [formState, setFormState] = React.useState(0);

    const [open, setOpen] = React.useState(false)

    const {handleLogin, handleRegister} = React.useContext(AuthContext)

    let handleAuth = async (event) => {
      event.preventDefault();
      try {
        if (formState === 0) {
          let result = await handleLogin(username, password)
        }

        if (formState === 1) {
          let result = await handleRegister(name, username, password);
          console.log(result);
          setMessage("Registration successful");
          setUsername("")
          setOpen(true);
          setError("")
          setFormState(0)
          setPassword("")
          
        }
      } catch(err) {
        console.log(err);
        const message = err.response ? err.response.data.message : "An error occurred";
        setError(message); // Set the error message
        setMessage(""); // Clear any previous success messages
        setOpen(true); // Show the Snackbar with the error message
        
      }
    }
  

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Grid container component="main" sx={{ height: '100vh' }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://static.vecteezy.com/system/resources/previews/011/432/528/non_2x/enter-login-and-password-registration-page-on-screen-sign-in-to-your-account-creative-metaphor-login-page-mobile-app-with-user-page-flat-illustration-vector.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light'
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <div>
                <Button variant={formState === 0 ? "contained" : ""} onClick={() => {setFormState(0)}}>Sign in</Button>
                <Button variant={formState === 1 ? "contained" : ""} onClick={() => {setFormState(1)}}>Sign up</Button>
            </div>
           
            
            <Box component="form" noValidate  sx={{ mt: 1 }} onSubmit={handleAuth} >
           {formState===1 ? <TextField
                margin="normal"
                required
                fullWidth
                id="fullname"
                label="fullname"
                name="fullname"
                autoComplete="fullname"
                autoFocus
                onChange={(e) => setName(e.target.value)}
              />: <></>} 
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="username"
                name="username"
                autoComplete="username"
                autoFocus
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {formState === 0 ? "Sign In" : "Register" }
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
      open={open}
      autoHideDuration={4000}
      message={error ? error : message}
      onClose={() => setOpen(false)}
      />
    </ThemeProvider>
  );
}
