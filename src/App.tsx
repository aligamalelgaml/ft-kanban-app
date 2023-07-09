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
import { setCurrentBoard, selectBoards, selectCurrentBoard } from './features/board/boardsSlice';
import BoardMoreDropdown from './features/board/BoardMoreDropdown';
import BoardDialog from './features/board/BoardDialog';
import AddCard from './features/card/AddCard';
import MobileDropdownMenu from './features/board/BoardMobileMenu';
import DashboardIcon from '@mui/icons-material/Dashboard';

/* #region APP BAR / DRAWER STYLING / CUSTOM SWITCH STYLING  */
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
  maxHeight: 'calc(100vh - 64px)'
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

export const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: "#635FC7",
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: "#635FC7",
    boxSizing: 'border-box',
  },
}));

/* #endregion */

function App() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const colorMode = useContext(ColorModeContext);
  const [open, setOpen] = useState(false); // Drawer state
  const [boardDialogeOpen, setBoardDialogeOpen] = useState(false) // Create board dialoge state.
  const mobileScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const boards = useAppSelector(selectBoards);
  const currentBoard = useAppSelector(selectCurrentBoard);



  const handleAddBoard = () => {
    setBoardDialogeOpen(true);
  }

  const handleBoardDialogeClose = () => {
    setBoardDialogeOpen(false);
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  return (
    <>
      <BoardDialog open={boardDialogeOpen} onClose={handleBoardDialogeClose} />

      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        <AppBar position="fixed" elevation={0} open={open}>
          <Toolbar sx={{ backgroundColor: theme.palette.background.paper, color: "text.primary", justifyContent: "space-between" }}>

            <div style={{ display: "flex", alignItems: "center" }}>
              {!open &&
                <>
                  <img alt="kanban logo" src={require('./assets/kanbanLogo.png')} style={{ marginRight: mobileScreen ? "12px" : "" }} />
                  {!mobileScreen &&
                    <>
                      <Typography variant='h4' marginLeft={"15px"} fontWeight={"800"} >kanban</Typography>
                      <Divider orientation="vertical" flexItem sx={{ mx: "20px" }} />
                    </>}
                </>
              }

              <Typography variant="h6" fontWeight={800} noWrap component="div">
                {currentBoard.name}
              </Typography>

              {mobileScreen &&
                <>
                  {currentBoard.id === "" && <Typography ml={2}>Select a Board</Typography>}
                  <MobileDropdownMenu />
                </>}
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <AddCard />
              <BoardMoreDropdown />
            </div>


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
              {boards.map((board: any) =>
                <ListItem sx={{ width: "85%" }} key={board.id} disablePadding>
                  <ListItemButton onClick={() => dispatch(setCurrentBoard(board))} selected={board.id === currentBoard.id}
                    sx={{
                      whiteSpace: "nowrap",
                      width: "85%",
                      borderRadius: "0px 20px 20px 0px",
                      pointerEvents: board.id === currentBoard.id ? "none" : "auto",
                      '&:hover': { // colors on hover
                        backgroundColor: 'secondary.main',
                        '& .MuiListItemText-primary, & .MuiListItemIcon-root': {
                          color: 'primary.main',
                        },
                      },
                      '&.Mui-selected': { // colors when selected
                        backgroundColor: 'primary.main',
                        '& .MuiListItemText-primary, & .MuiListItemIcon-root': {
                          color: '#FFFFFF',
                        }, '&:hover': { // colors on hover & selected
                          backgroundColor: 'secondary.main',
                          '& .MuiListItemText-primary, & .MuiListItemIcon-root': {
                            color: 'primary.main',
                          },
                        },
                      },
                    }}
                  >
                    <ListItemIcon style={{ minWidth: '35px' }}>
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{ fontSize: '15px', fontWeight: "700" }} primary={board.name} />
                  </ListItemButton>
                </ListItem>
              )}

              <ListItem sx={{ width: "85%" }} disablePadding>
                <ListItemButton onClick={() => handleAddBoard()}
                  sx={{
                    whiteSpace: "nowrap",
                    color: "primary.main",
                    width: "85%",
                    borderRadius: "0px 20px 20px 0px",
                    '& .MuiListItemIcon-root': {
                      color: "primary.main"
                    },
                    '&:hover': { // colors on hover
                      backgroundColor: 'secondary.main',
                      '& .MuiListItemText-primary, & .MuiListItemIcon-root': {
                        color: 'primary.main',
                      },
                    },
                    '&.Mui-selected': { // colors when selected
                      backgroundColor: 'primary.main',
                      '& .MuiListItemText-primary, & .MuiListItemIcon-root': {
                        color: '#FFFFFF',
                      }, '&:hover': { // colors on hover & selected
                        backgroundColor: 'secondary.main',
                        '& .MuiListItemText-primary, & .MuiListItemIcon-root': {
                          color: 'primary.main',
                        },
                      },
                    },
                  }}
                >
                  <ListItemIcon style={{ minWidth: '35px' }}>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primaryTypographyProps={{ fontSize: '15px', fontWeight: "700" }} primary={"+ Create New Board"} />
                </ListItemButton>
              </ListItem>
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
                p: "15 20 15 20",
              }}
            >
              <Stack direction={"row"} alignItems={"center"} padding={1}>
                <LightModeIcon sx={{ color: "text.secondary" }} />
                <AntSwitch checked={theme.palette.mode === 'dark'} onChange={colorMode.toggleColorMode} sx={{ marginLeft: '8px', marginRight: '8px' }} />
                <DarkModeIcon sx={{ color: "text.secondary" }} />
              </Stack>
            </Box>

            <Button onClick={handleDrawerClose} variant='text' sx={{
              textTransform: 'none', color: "text.secondary", width: '85%', mt: "20px", justifyContent: 'flex-start', paddingLeft: '2.1vw', // Add this line for left padding
              borderRadius: "0px 20px 20px 0px", "&:hover": { bgcolor: "secondary.hover" }
            }} startIcon={<VisibilityOffIcon />}>
              Hide Sidebar
            </Button>

          </div>
        </Drawer>

        <Main open={open}>
          <DrawerHeader />

          <Boards />

        </Main>

        {!mobileScreen &&
          <Button
            aria-label="Add"
            sx={{
              backgroundColor: "primary.main",
              position: 'fixed',
              padding: "10px 20px",
              borderRadius: "0px 40px 40px 0px",
              bottom: (theme) => theme.spacing(1),
              left: (theme) => theme.spacing(-1),
              zIndex: (theme) => theme.zIndex.appBar + 1,
              "&:hover": {
                backgroundColor: "primary.hover"
              },
              ...(open && { display: 'none' }),
            }}
            onClick={handleDrawerOpen}
          >
            <VisibilityIcon sx={{ color: "#FFFFFF" }} />
          </Button>
        }
      </Box>
    </>
  );
}

//#region START OF EXPORTED THEMED APP

export const ColorModeContext = createContext({ toggleColorMode: () => { } });

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
      more: mode === 'light' ? '#FFFFFF' : '#20212C',
      contrasted: mode === 'light' ? "#E4EBFA" : "rgba(43, 44, 55, 0.25)",
    },
    text: {
      primary: mode === 'light' ? "#000112" : '#FFFFFF',
      secondary: "#828FA3",
    },
  },
  typography: {
    fontFamily: 'Plus Jakarta Sans',
  },
  transitions: {
    easing: {
      // Define your desired easing functions
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    duration: {
      // Define the duration for the transitions
      standard: 300, // in milliseconds
    },
  }, components: {
    // Apply transitions to all MUI components
    MuiButton: {
      styleOverrides: {
        root: {
          transition: 'opacity 0.3s', // Apply the transition to the desired CSS property
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          transition: 'opacity 0.3s', // Apply the transition to the desired CSS property
        },
      },
    },
  },
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
