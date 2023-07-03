import * as React from 'react';
import { useTheme, ThemeProvider, createTheme, styled } from '@mui/material/styles';
import "@fontsource/plus-jakarta-sans"; // Defaults to weight 400
import { CssBaseline, PaletteMode, Box, Switch, Button, Stack } from '@mui/material';
import { grey } from '@mui/material/colors';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Hidden, Toolbar, Drawer, List, ListItem, ListItemText, Fab } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import useMediaQuery from '@mui/material/useMediaQuery';


// START OF DRAWER/APP-BAR HYBRID COMP

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

// END OF DRAWER/APP-BAR HYBRID COMP

const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      main: '#635FC7',
      hover: '#A8A4FF',
    },
    secondary: {
      main: 'rgba(99, 95, 199, 0.1)',
      hover: 'rgba(99, 95, 199, 0.25)',
    },
    destructive: {
      main: '#EA5555',
      hover: '#FF9898',
    },
    divider: 'rgba(110, 128, 152, 0.2)',
    background: {
      default: mode === 'light' ? '#F4F7FD' : '#121721',
      paper: mode === 'light' ? '#FFFFFF' : '#2B2C37',
    },
    text: {
      primary: mode === 'light' ? grey[900] : '#fff',
      secondary: mode === 'light' ? grey[800] : grey[500],
    },
  },
  typography: {
    fontFamily: 'Plus Jakarta Sans',
  }
});

function App() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const colorMode = React.useContext(ColorModeContext);
  const mobileScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" elevation={0} open={open}>
          <Toolbar sx={{ backgroundColor: theme.palette.background.paper, color: "text.primary" }}>

            {!open &&
              <>
                <img src={require('./assets/kanbanLogo.png')} />
                <Typography variant='h4' marginLeft={"15px"} fontWeight={"800"} >kanban</Typography>
                <Divider orientation="vertical" flexItem sx={{ mx: "20px" }} />
              </>
            }


            <Typography variant="h6" fontWeight={800} noWrap component="div">
              Platform Launch
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >

          <div>

          <DrawerHeader sx={{ display: "flex", justifyContent: "center" }}>
            <img src={require('./assets/kanbanLogo.png')} />
            <Typography variant='h4' marginLeft={"15px"} fontWeight={"800"} >kanban</Typography>
          </DrawerHeader>

          </div>



          <div>

            <Box
              sx={{
                display: 'flex',
                width: '80%',
                marginX: 'auto',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                color: 'text.primary',
                borderRadius: 1,
                p: "10 20 10 20",
              }}
            >
              <LightModeIcon />
              <Switch checked={theme.palette.mode === 'dark'} onChange={colorMode.toggleColorMode} sx={{ marginLeft: '8px', marginRight: '8px' }} />
              <DarkModeIcon />
            </Box>

            <Button onClick={handleDrawerClose} variant='text' sx={{ textTransform: 'none', width: '80%', marginX: 'auto', mt: "20px" }} startIcon={<VisibilityOffIcon />}>
              Hide Sidebar
            </Button>

          </div>
        </Drawer>

        <Main open={open}>
          <DrawerHeader />

          <Typography paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
            enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
            imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
            Convallis convallis tellus id interdum velit laoreet id donec ultrices.
            Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
            adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
            nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
            leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
            feugiat vivamus at augue. At augue eget arcu dictum varius duis at
            consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
            sapien faucibus et molestie ac.
          </Typography>
          <Typography paragraph>
            Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
            eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
            neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
            tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
            sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
            tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
            gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
            et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
            tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
            eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
            posuere sollicitudin aliquam ultrices sagittis orci a.
          </Typography>
        </Main>

        { !mobileScreen &&
          <Fab
            color="primary"
            aria-label="Add"
            sx={{
              position: 'fixed',
              padding: "0px 30px",
              borderRadius: "0px 40px 40px 0px",
              bottom: (theme) => theme.spacing(1),
              left: (theme) => theme.spacing(-1),
              zIndex: (theme) => theme.zIndex.appBar + 1,
              ...(open && { display: 'none' }),
            }}
            onClick={handleDrawerOpen}
          >
            <VisibilityIcon />
          </Fab>
        }

      </Box>
    </>
  );
}

export default function ThemedApp() {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () => createTheme(getDesignTokens(mode)),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}