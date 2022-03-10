import Link from 'next/link';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/dist/client/router";
import { app } from "../plugins/firebaseConfig"
/* utils */
import { absoluteUrl, apiInstance, checkIsLogin } from '../middleware/utils';
import Cookies from 'js-cookie';
/* components */
import Layout from '../components/layout/LayoutDefault';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { useEffect, useState } from 'react'

library.add(fas);
import {
  UserOutlined,
  LockOutlined
} from '@ant-design/icons';

import {
  Carousel,
  Row,
  Col,
  Typography,
  Image,
  Button,
  Input,
  Card,
  Form,
  notification
} from 'antd';

const { Text, Title } = Typography;

const { TextArea } = Input;


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const route = useRouter();
  const singIn = async (email, password) => {
  const auth = getAuth();
  await signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    let user = userCredential.user;
    console.log(user);
    route.push("/");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
};

  return (
    <Layout title="Chat bot | Login Page"  className="h-screen">
      <div className="mx-auto w-full max-w-md min-h-screen max-h-screen pt-20">
        <div className=" pb-8 m-auto">
          <center><img
            className="h-auto w-auto"
            src={'assets/images/chat-bot.png'}
          /></center>
        </div>
        <Form
          class="px-8 pt-2 pb-8 mb-4 pd-12"
          name="basic"
          layout="vertical"
          requiredMark={true}
        >
          <div className="text-white flex items-center justify-between mt-2 mr-2 ml-2">
            <p className=""></p>
            <p className="">
              ยังไม่บัญชีผู้ใช้ ?
              <a
                href="register"
                className="text-white no-underline hover:text-white hover:text-gray-800"
              >
                สมัครสมาชิก
              </a>
            </p>
          </div>
          <Form.Item className="mb-8"
            name="username"
            className="block text-gray-700 text-sm font-bold mb-6 w-full"
            rules={[{ required: true, message: 'กรุณากรอก ชื่อผู้ใช้!' }]}
          >
            <Input
              className=""
              id="#"
              type="text"
              size="large"
              placeholder="Email"
              prefix={<UserOutlined />}
              value={email}
              onChange={(e) => { 
                setEmail(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item className="mb-8"
            name="password"
            className="block text-gray-700 text-sm font-bold mb-2 w-full"
            rules={[{ required: true, message: 'กรุณากรอก รหัสผ่าน!' }]}
          >
            <Input.Password
              className=""
              id="#"
              type="password"
              size="large"
              placeholder="Password"
              prefix={<LockOutlined />}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }} 
            />
          </Form.Item>
          <Form.Item className="text-center">
            <Button
              // type="primary"
              style={{
                backgroundColor: '#f3f7f2',
                borderColor: '#059669',
                height: 50,
                marginBottom: '0px !important',
              }}
              htmlType="submit"
              className="bg-white text-blue-500 font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-3"
              onClick={() => singIn(email, password)}
            >
              <div class="text-blue-600 font-bold">
                LOGIN
                </div>
            </Button>
            <div class="pt-4">
              <a href="/forget_password" className="text-white hover:text-gray-800 pl-72 pt-6">
                ลืมรหัสผ่าน?
              </a>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
}

export default Login;