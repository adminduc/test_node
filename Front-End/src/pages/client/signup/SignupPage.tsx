import { useRef, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { message } from "antd"
import IUser from '../../../types/user';
import ReCAPTCHA from 'react-google-recaptcha';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Signup } from '../../../services/auth';
const SignupPage = () => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const navigate = useNavigate();

  const onFinish = async (value: IUser) => {
    if (isVerified == true) {
      const key = 'loading'
      if (value) {
        try {
          const loading = await message.loading({ content: 'loading!', key, duration: 2 })
          if (loading) {
            const response: any = await Signup(value);
            if (response) {
              message.success(response.message, 3);
              navigate('/')
            }
          }

        } catch (error: any) {
          message.error(error.response.data.message, 5);
        }
      }
    }
  };

  const handleRecaptcha = (value: string | null) => {
    if (value) {
      setIsVerified(true);
    }
  };

  return (
    <section>
      <Form className="mt-[30px] w-[400px] mx-auto" name="form_item_path" layout="vertical" onFinish={onFinish} autoComplete="off">
        <p tabIndex={0} role="heading" aria-label="Login to your account" className="text-2xl font-extrabold leading-6 text-gray-800 mb-8">
          signup to your account
        </p>
        <p className="text-sm mt-4 font-medium leading-none text-gray-500">
          Do you already have an account?{" "}
          <span tabIndex={0} role="link" aria-label="Sign up here" className="text-sm font-medium leading-none underline text-gray-800 cursor-pointer">
            {" "}
            <Link to="/signin">Sign in here</Link>
          </span>
        </p>
        <Form.Item className='text-black font-bold'
          rules={[
            {
              message: 'vui lòng nhập name!',
              required: true,
              min: 3
            },
          ]}
          name="name"
          label="name"
        >
          <Input className='font-mono border border-indigo-600 h-10' placeholder="nhập name" />
        </Form.Item>
        <Form.Item className='text-black font-bold'
          name="email"
          label="Email"
          rules={[
            {
              message: 'vui lòng nhập email!',
              required: true,
              type: 'email'
            },
          ]}
        >
          <Input className='font-mono border border-indigo-600 h-10' placeholder="nhập email" />
        </Form.Item>
        <Form.Item className='text-black font-bold'
          name="password"
          label="mật khẩu"
          rules={[
            {
              message: 'vui lòng nhập password!',
              required: true,
              min: 6
            },
          ]}
        >
          <Input.Password
            type='password' className='font-mono border border-indigo-600 h-10' placeholder="nhập password"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>
        <Form.Item className='text-black font-bold'
          name="confirmpassword"
          label="nhập lại mật khẩu"
          rules={[
            {
              message: 'vui lòng nhập confirm password!',
              required: true,
              min: 6
            },
          ]}
        >
          <Input.Password
            type='password' className='font-mono border border-indigo-600 h-10' placeholder="nhập password"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>
        <Form.Item>
          <ReCAPTCHA className=''
            ref={recaptchaRef}
            sitekey="6Ld_Ek8mAAAAAKtnDYdUCNiClx9m52L_aafio6we"
            onChange={handleRecaptcha}
          />
          {isVerified ? (
            <p>Xác thực thành công!</p>
          ) : (
            <p className='text-[red]'>Vui lòng xác thực bằng Recaptcha trước khi tiếp tục.</p>
          )}
        </Form.Item>
        <Button
          htmlType="submit"
          className="w-full h-[52px] text-center py-3 rounded bg-[#4a71c4] text-white hover:bg-green-dark focus:outline-none my-1"
        >
          Sign up
        </Button>
      </Form>
    </section>

  );
};
export default SignupPage;
