import './App.css'
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import { AppRoutes } from './routes/app-routes';
import { Home } from './page/Home';
import { MenuList } from './page/MenuList';
import { HomeLayout } from './layout/HomeLayout';
import { ClientList } from './page/ClientList';
import { AboutMe } from './page/AboutMe';
import { GlobalProvider } from './context/GlobalProvider';
import { MinersList } from './page/MinerList';
import ScreenOverlay from './page/ScreenOverlay';

function App() {
  
  return (
    <Router>
      <GlobalProvider>
        <Routes >
          <Route element={<HomeLayout />}>
            <Route path={AppRoutes.home.route()} element={<Home />} />
            <Route path={AppRoutes.menuList.route()} element={<MenuList />} />
            <Route path={AppRoutes.clientList.route()} element={<ClientList />} />
            <Route path={AppRoutes.aboutMe.route()} element={<AboutMe />} />
            <Route path={AppRoutes.clientMiners.route()} element={<MinersList />} />
          </Route>
          <Route path={AppRoutes.overlayOpen.route()} element={<ScreenOverlay/>}/>
        </Routes>
      </GlobalProvider>
    </Router>
  );
}

export default App
