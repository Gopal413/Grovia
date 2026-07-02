import { Box } from "@mui/material"
import { BrowserRouter,Routes,Route } from "react-router-dom";

import MainAuthCard from "./Pages/Common/MainAuthCard";
import Login from "./Pages/Common/Login"
import Register from "./Pages/Common/Register"
import VerifyOtp from "./Pages/Common/VerifyOtp"
import ForgotPassword from "./Pages/Common/ForgetPassword";
import ResetPassword from "./Pages/Common/ResetPassword";
import ForgotVerifyOtp from "./Pages/Common/ForgetVerifyOtp";
import Home from "./Pages/Customer/Layout/Home";

import DashboardLayout from "./Pages/Admin/Layout/Dashboard";
import LandingPage from "./Pages/Common/LandingPage";
import LandingPageLayout from "./Pages/Common/LandingPageLayout";

import UserDetails from "./Pages/Admin/UsersOperations/UserDetails";
import Products from "./Pages/Admin/Products/AdminProducts";
import UpdateProducts from "./Pages/Admin/Products/UpdateProducts";
import AdminProducts from "./Pages/Admin/Products/AdminProducts";
import ProtectedRoutes from "./Routes/ProtectedRoutes";
import CustomerDashboard from "./Pages/Customer/Layout/CustomerDashboard";
import Overview from "./Pages/Admin/Home/AdminHome";
import CustomerProducts from "./Pages/Customer/CustomerProducts/CustomerProducts";
import ProductPage from "./Pages/Customer/CustomerProducts/ProductPage";
import CustomerCart from "./Pages/Customer/Cart/CustomerCart";
import OrderList from "./Pages/Customer/CustomerOrder/OrderList";
import CustomerProfile from "./Pages/Customer/Profile/CustomerProfiles";
import CustomerEditProfile from "./Pages/Customer/Profile/CustomerEditProfile";
import CustomerEditAddress from "./Pages/Customer/Profile/CustomerEditAddress";
import EmailVerify from "./Pages/Common/EmailVerify";
import OrderRecordsDashboard from "./Pages/Admin/Orders/OrderDetails";

import Offers from "./Pages/Admin/Offers/Offers"
import ReviewOfProducts from "./Pages/Customer/CustomerOrder/ReviewOfProducts";
import { Reviews } from "@mui/icons-material";
import CustomerReview from "./Pages/Customer/CustomerProducts/CustomerReview";
import Coupon from "./Pages/Customer/Cart/Coupon";
import AdminProductPage from "./Pages/Admin/Products/AdminProductPage";
import OrderRecordsDashboardById from "./Pages/Admin/Orders/OrderDetailsById";
//import DynamicAdminDashboard from "./Pages/Admin/Home/adminCharts";
import CompanyInfo from "./Pages/Admin/MyCompany/CompanyInfo";
import About from "./Pages/Common/About";
import UpdateInfo from "./Pages/Admin/MyCompany/UpdateInfo";
import Coupons from "./Pages/Admin/CouponAdmin/CouponAdmin";
import CouponForm from "./Pages/Admin/CouponAdmin/CouponForm";
import AllCoupon from "./Pages/Admin/CouponAdmin/CouponAdmin";
import Charts from "./Pages/Admin/Home/Charts";
import AdminHome from "./Pages/Admin/Home/AdminHome";


function App() {

  return (
    <Box>
        <BrowserRouter>
        <Routes>
        <Route path ="/" element={<LandingPageLayout/>}>
        <Route index element={<LandingPage/>}/>
        <Route path ="/register" element={<Register/>}/>
        <Route path ="/verify-email" element={<EmailVerify/>}/>
        <Route path ="/verify-otp" element={<VerifyOtp/>}/>
        <Route path ="/login" element={<Login/>}/>
        <Route path ="/about" element={<About/>}/>
        <Route path ="/forget" element={<ForgotPassword/>}/>
        <Route path ="/forget/forgetverifyOtp" element={<ForgotVerifyOtp/>}/>
        <Route path ="/forget/forgetverifyOtp/resetpassword" element={<ResetPassword/>}/>
        <Route path ="/auth" element={<MainAuthCard/>}/>
        </Route>
        

        <Route path ="/admin" element={<ProtectedRoutes role="admin"><DashboardLayout/></ProtectedRoutes>}>
        <Route index element={<Overview/>}/>
        <Route path ="/admin/overview" element={<AdminHome/>}/>
        <Route path ="/admin/customers" element={<UserDetails/>}/>
        <Route path="/admin/orders" element ={<OrderRecordsDashboard/>}/>
        <Route path="/admin/orders/:id" element ={<OrderRecordsDashboardById/>}/>
        <Route path="/admin/products" element={<AdminProducts/>}/>
        <Route path="/admin/productlist/:id" element={<AdminProductPage/>}/>
        <Route path="/admin/products/updateProduct/:id" element={<UpdateProducts/>}/>
        <Route path="/admin/info" element={<CompanyInfo/>}/>
        <Route path="/admin/infoupdate/:id" element={<UpdateInfo/>}/>
        <Route path="/admin/coupons" element={<AllCoupon/>}/>
        <Route path="/admin/handlecoupon/:id" element={<CouponForm/>}/>
        <Route path="/admin/banners" element={<Offers/>}/>
        {/* <Route path="/admin/Analytics" element={<AdminDashboard/>}/> */}
        {/* <Route path="/admin/settings" element={<Charts/>}/> */}
        </Route>

        <Route path ="/customer" element={<ProtectedRoutes role="customer"><CustomerDashboard/></ProtectedRoutes>}>
        <Route index element={<Home/>}/>
         <Route path ="/customer/home" element={<Home/>}/>
        <Route path="/customer/users" element={<UserDetails/>}/>
        <Route path="/customer/profile" element={<CustomerProfile/>}/>
        <Route path ="/customer/about" element={<About/>}/>
        <Route path="/customer/products" element={<CustomerProducts/>}/>
        <Route path="/customer/productpage/:id" element={<ProductPage/>}/>
        <Route path="/customer/cart" element={<CustomerCart/>}/>
        <Route path="/customer/coupon" element={<Coupon/>}/>
        <Route path ="/customer/editprofile" element={<CustomerEditProfile/>}/>
        <Route path ="/customer/editaddress" element={<CustomerEditAddress/>}/>
        <Route path ="/customer/editaddress/:id" element={<CustomerEditAddress/>}/>
        <Route path ="/customer/orderlist" element={<OrderList/>}/>
        <Route path ="/customer/reviews/:id" element={<ReviewOfProducts/>}/>
        </Route>
        {/* <Route path="/review" element={<CustomerReview/>} /> */}
      </Routes>
            
      </BrowserRouter>
    </Box>
  )
}

export default App
