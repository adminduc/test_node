import { BrowserRouter, Route, Routes } from "react-router-dom"
import LayoutClient from "../layouts/client"
import NotFoundPage from "../pages/NotFound"
import SigninPage from "../pages/client/signin"
import SignupPage from "../pages/client/signup"
import HomePage from "../pages/client/home/HomePage"
import ProductPage from "../pages/client/products"
import ProductDetailPage from "../pages/client/productdetail"
import ProductSale from "../pages/client/productsale"
import ContactPage from "../pages/client/contacts"
import LayoutAdmin from "../layouts/admin"

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='' element={<LayoutClient />}>
                    <Route index element={<HomePage />} />
                    <Route path='products'>
                        <Route index element={<ProductPage />} />
                        <Route path=':id' element={<ProductDetailPage />} />
                    </Route>
                    <Route path='products/sales'>
                        <Route index element={<ProductSale />} />
                    </Route>
                    <Route path='contacts' element={<ContactPage />} />
                </Route>
                <Route path='admin' element={<LayoutAdmin />}>
                    {/* <Route index element={<Management />} />
                    <Route path='products'>
                        <Route index element={<ManagementProduct />} />
                        <Route path=':id/update' element={<ManagementProductUpdate />} />
                    </Route>
                    <Route path='categories'>
                        <Route index element={<ManageCategory />} />
                        <Route path=':id/update' element={<ManageCategoryUpdate />} />
                    </Route>
                    <Route path='hashtags'>
                        <Route index element={<ManageHashtag />} />
                        <Route path=':id/update' element={<ManageHashtagUpdate />} />
                    </Route>
                    <Route path='abouts'>
                        <Route index element={<ManageAbout />} />
                        <Route path=':id/update' element={<ManageAboutUpdate />} />
                    </Route>
                    <Route path='order/bill'>
                        <Route index element={<ManageBill />} />
                        <Route path=':id/update' element={<ManageBillUpdate />} />
                    </Route>
                    <Route path='comments'>
                        <Route index element={<ManageComment />} />
                    </Route>
                    <Route path='contacts'>
                        <Route index element={<ManageContact />} />
                    </Route>
                    <Route path='accounts'>
                        <Route index element={<ManageUser />} />
                    </Route> */}
                </Route>
                <Route path='signin' element={<SigninPage />}></Route>
                <Route path='signup' element={<SignupPage />}></Route>
                <Route path='*' element={<NotFoundPage />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router