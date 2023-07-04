import { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { useTheme, ThemeProvider, createTheme, styled } from '@mui/material/styles';
import "@fontsource/plus-jakarta-sans"; // Defaults to weight 400
import { CssBaseline, PaletteMode, Box, Switch, Button, Stack, ButtonGroup } from '@mui/material';
import { grey } from '@mui/material/colors';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Hidden, Toolbar, Drawer, List, ListItem, ListItemText, ListItemButton, ListItemIcon, Fab } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TableChartIcon from '@mui/icons-material/TableChart';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Boards } from './features/board/Boards';
import { useAppSelector, useAppDispatch } from './app/hooks';
import { addBoard, selectBoards, fetchBoards } from './features/board/boardsSlice';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

//#region: START OF DRAWER/APP-BAR HYBRID COMP

const drawerWidth = 300;

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

//#endregion: END OF DRAWER/APP-BAR HYBRID COMP

function App() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const colorMode = useContext(ColorModeContext);
  const mobileScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [currentBoard, setCurrentBoard] = useState("");
  const boards = useAppSelector(selectBoards);
  const dispatch = useAppDispatch();

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
                <img alt="kanban logo" src={require('./assets/kanbanLogo.png')} />
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
            <DrawerHeader sx={{ display: "flex", justifyContent: "center", padding: "0" }}>
              <img alt="kanban logo" src={require('./assets/kanbanLogo.png')} />
              <Typography variant='h4' marginLeft={"15px"} fontWeight={"800"} >kanban</Typography>
            </DrawerHeader>

            <Box sx={{ padding: "20px" }}>
              <Typography textTransform={'uppercase'} fontSize={12} letterSpacing={2.4} lineHeight={1} fontWeight={700} color={"text.secondary"}>
                All Boards ({boards.length})
              </Typography>
            </Box>

            <List>

              {/* sx={{
                    fontSize: "15px",
                    fontWeight: "700",
                    whiteSpace: "nowrap",
                    justifyContent: "flex-start",
                    color: board.id === currentBoard ? "#FFFFFF" : "text.secondary",
                    backgroundColor: board.id === currentBoard ? "#635FC7" : "background.paper",
                    textTransform: "none",
                    width: "90%",
                    borderRadius: "0px 20px 20px 0px",
                    ":hover": {
                      color: "primary.main",
                      backgroundColor: "secondary.main"
                    },
                  }} */}

              {boards.map((board) =>
                <ListItem sx={{ width: "80%" }} key={board.id} disablePadding>
                  <ListItemButton onClick={() => setCurrentBoard(board.id)} selected={board.id === currentBoard}
                    sx={{
                      fontSize: "15px",
                      fontWeight: "700",
                      whiteSpace: "nowrap",
                      width: "80%",
                      borderRadius: "0px 20px 20px 0px",
                      '&:hover': {
                        backgroundColor: 'secondary.main', // background color on hover
                        '& .MuiListItemText-primary, & .MuiListItemIcon-root': {
                          color: 'primary.main', // text color on hover
                        },
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main', // background color when selected
                        '& .MuiListItemText-primary, & .MuiListItemIcon-root': {
                          color: '#FFFFFF', // text color when selected
                        }, '&:hover': {
                          backgroundColor: 'secondary.main', // background color on hover
                          '& .MuiListItemText-primary, & .MuiListItemIcon-root': {
                            color: 'primary.main', // text color on hover
                          },
                        },
                      },
                    }}
                  >
                    <ListItemIcon>
                      <TableChartIcon sx={{ minWidth: "30px" }} />
                    </ListItemIcon>
                    <ListItemText primary={board.name} />
                  </ListItemButton>
                </ListItem>
              )}
            </List>

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

          <Boards />

        </Main>

        {!mobileScreen &&
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

//#region START OF EXPORTED THEMED APP

const ColorModeContext = createContext({ toggleColorMode: () => { } });

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      main: '#635FC7',
      hover: '#A8A4FF',
    },
    secondary: {
      main: mode === 'light' ? 'rgba(99, 95, 199, 0.1)' : '#FFFFFF',
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
      primary: mode === 'light' ? "#000112" : '#FFFFFF',
      secondary: "#828FA3",
    },
  },
  typography: {
    fontFamily: 'Plus Jakarta Sans',
  },
  // components: {
  //   MuiListItemButton: {
  //     styleOverrides: {
  //       root: {
  //         "&.Mui-selected": {
  //           backgroundColor: "#2e8b57"
  //         },
  //         borderRadius: "0px 20px 20px 0px",
  //         width: "80%",
  //       },
  //     },
  //   },
  //   MuiListItem: {
  //     styleOverrides: {
  //       root: {
  //         ":hover": {
  //           backgroundColor: "#635FC7",
  //           color: "#635FC7",
  //         },
  //         borderRadius: "0px 20px 20px 0px",
  //         width: "80%",
  //       },
  //     },
  //   },
  //   MuiListItemText: {
  //     styleOverrides: {
  //       root: {
  //         color: "#828FA3",
  //         ":hover": {
  //           color: "#635FC7",
  //         }
  //       },
  //     },
  //   }
  // },
});


export default function ThemedApp() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
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

//#endregion END OF EXPORTED THEMED APP
