import { Menu } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
export default function HeaderLayoutClient() {
    const [show, setshow] = useState(false);
    return (
        <div className="bg-white">
            <nav className="2xl:container 2xl:mx-auto sm:py-6">
                <div className="flex justify-between ">
                    <Link to="/" className="text-2xl text-gray-700 dark:text-gray-400 font-bold">SNEAKER</Link>
                    <div className="hidden sm:flex flex-row items-center space-x-6">
                        <ul className="hidden lg:w-auto lg:space-x-12 lg:items-center lg:flex ">
                            <li className="pb-3">
                                <Link to='/' className="text-sm text-gray-700 hover:text-blue-400 font-bold dark:text-gray-400">Home</Link>
                            </li>
                            <li className="pb-3">
                                <Link to='/products' className="text-sm text-gray-700 hover:text-blue-400 font-bold dark:text-gray-400">Products</Link>
                            </li>
                            <li className="pb-3">
                                <Link to='/products/sales' className="text-sm text-[red] font-bold">News Sale</Link>
                            </li>
                            <li className="pb-3">
                                <Link to='/contacts' className="text-sm text-gray-700 font-bold hover:text-blue-400 dark:text-gray-400">Contacts-Us</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="hidden sm:flex flex-row space-x-4">
                        {/* hthi giỏ hàng */}
                        {/* <div>
                            <Link to="/cart" className="w-[50px] flex items-center dark:text-gray-400">
                                {cartItems.length === 0 ?
                                    <Badge text={0}>
                                        <ShoppingCartOutlined style={{ fontSize: '30px' }} className="text-gray-600" />
                                    </Badge>
                                    :
                                    <Badge count={cartItems.length}>
                                        <ShoppingCartOutlined style={{ fontSize: '30px' }} className="text-gray-600" />
                                    </Badge>
                                }
                            </Link>
                        </div> */}
                        <div className="flex justify-center">
                            <Link to="/signup" className="mx-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md">Signup</Link>
                            <Link to="/signin" className="mx-4 px-4 py-2 bg-green-500 hover:bg-green-700 text-white font-semibold rounded-md">Signin</Link>
                        </div>
                    </div>
                    {/* Burger Icon */}
                    <div id="bgIcon" onClick={() => setshow(!show)} className={`focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800  justify-center items-center sm:hidden cursor-pointer`}>
                        <svg className={`${show ? 'hidden' : ''}`} width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path className=" transform duration-150" d="M4 6H20" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 12H20" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path className=" transform duration-150" d="M4 18H20" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <svg className={`${show ? 'block' : 'hidden'}`} width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 6L18 18" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                {/* Mobile and small-screen devices (toggle Menu) */}
                <div id="MobileNavigation" className={`${show ? 'block' : 'hidden'} sm:hidden mt-4 mx-auto`}>
                    <div className="block sm:hidden md:block">
                        <Menu>
                            <Menu.Item key="home">
                                <Link to="/">Home</Link>
                            </Menu.Item>
                            <Menu.Item key="products">
                                <Link to="/products">Products</Link>
                            </Menu.Item>
                            <Menu.Item key="products/sales">
                                <Link to="/products/sales">News Sale</Link>
                            </Menu.Item>
                            <Menu.Item key="contacts">
                                <Link to="/contacts">Contact-Us</Link>
                            </Menu.Item>
                        </Menu>
                    </div>
                    <div className="flex">
                        <Link to="/signup" className="mx-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md">Signup</Link>
                        <Link to="/signin" className="mx-4 px-4 py-2 bg-green-500 hover:bg-green-700 text-white font-semibold rounded-md">Signin</Link>
                    </div>
                    <div className="pt-4 pb-2">
                        {/* hthi giỏ hàng */}
                        {/* <Link to="/cart" className="text-sm font-medium text-gray-700 hover:text-blue-400 flex items-center">
                            <div className="relative flex-shrink-0">
                                {cartItems.length === 0 ?
                                    <Badge text={0}>
                                        <ShoppingCartOutlined style={{ fontSize: '30px' }} className="text-gray-600" />
                                    </Badge>
                                    :
                                    <Badge count={cartItems.length}>
                                        <ShoppingCartOutlined className="h-5 w-5 ml-[20px]" style={{ fontSize: '30px' }} />
                                    </Badge>
                                }
                            </div>
                        </Link> */}
                    </div>
                </div>
            </nav>
        </div>

    );
}
