import logo from './logo.svg';
import './App.css';
import Authentication from './pages/Authentication';
import { CommonProvider } from './contexts/CommonContext';
import { Routes, Route } from 'react-router-dom';
import FullPageLoader from './components/FullPageLoader';
import AlertBox from './components/AlertBox';
import HomePage from './pages/HomePage';
import BottomNavBar from './components/BottomNavBar';
import Card from './pages/Card';
import Profile from './pages/Profile';
import AppsPage from './pages/AppsPage';
import BuyPremium from './pages/BuyPremium';
import Analytics from './pages/Analytics';
import Enquiries from './pages/Enquiries';
import Appointments from './pages/Appointments';
import RequireAuth from './components/RequireAuth';
import { AuthContextProvider } from './contexts/AuthContext';
import {CookiesProvider} from "react-cookie";
import UpdatePersonalDetails from './pages/UpdatePersonalDetails';
import UpdateCompanyDetails from './pages/UpdateCompanyDetails';
import UpdateGallery from './pages/UpdateGallery';
import UpdateSocialMedia from './pages/UpdateSocialMedia';
import UpdateProducts from './pages/UpdateProducts';
import UpdatePayments from './pages/UpdatePayments';
import MyCard from './pages/MyCard';
import Themes from './pages/Themes';
import ChangePassword from './pages/ChangePassword';
import CategoryList from './pages/CategoryList';
import EventList from './pages/EventList';
import PostersList from './pages/PostersList';
import PosterPreview from './pages/PosterPreview';

function App() {
  return (
    <CookiesProvider>
    <CommonProvider>
      <AuthContextProvider>
      <Routes>
        <Route element={<FullPageLoader />} >
          <Route element={<AlertBox />} >
            <Route path="/auth" element={<Authentication />}/>

            <Route element={<RequireAuth />} >
              <Route path="/" element={<HomePage />}/>
              <Route path="/mycard/:id" element={<MyCard />}/>
              <Route path="/profile" element={<Profile />}/>
              <Route path="/apps" element={<AppsPage />}/>
              <Route path="/themes" element={<Themes />}/>
              <Route path="/changePassword" element={<ChangePassword />}/>

              <Route path="/buy-premium" element={<BuyPremium />}/>
              <Route path="/analytics" element={<Analytics />}/>
              <Route path="/enquiries" element={<Enquiries />}/>
              <Route path="/appointments" element={<Appointments />}/>

              <Route path="/updatePersonalDetails" element={<UpdatePersonalDetails />}/>
              <Route path="/updateCompanyDetails" element={<UpdateCompanyDetails />}/>
              <Route path="/updateGallery" element={<UpdateGallery />}/>
              <Route path="/updateSocialMedia" element={<UpdateSocialMedia />}/>
              <Route path="/UpdateProducts" element={<UpdateProducts />}/>
              <Route path="/UpdatePayments" element={<UpdatePayments />}/>  

              <Route path="/posterCategories" element={<CategoryList />}/> 
              <Route path="/eventList/:id" element={<EventList />}/>
              <Route path="/postersList/:id" element={<PostersList />}/>
              <Route path="/posterPreview" element={<PosterPreview />} />

            </Route>

            <Route path="/card/:id" element={<Card />}/>            
          </Route>
        </Route>
      </Routes>
      </AuthContextProvider>
    </CommonProvider>
    </CookiesProvider>
  );
}

export default App;
