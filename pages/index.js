import Link from 'next/link';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/dist/client/router';
import { app } from '../plugins/firebaseConfig';

/* components */
import Layout from '../components/layout/LayoutDefault';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import React, { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { db } from '../plugins/firebaseConfig';
library.add(fas);
import { UserOutlined, LockOutlined } from '@ant-design/icons';

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
  notification,
} from 'antd';
import { async } from '@firebase/util';
import { set } from 'nprogress';

const { Text, Title } = Typography;

const { TextArea } = Input;

function Login({ setRole, setDistrict, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const route = useRouter();
  const singIn = async (email, password) => {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password)
      .then(async userCredential => {
        let user = userCredential.user;
        console.log(user.uid)
        setUser(user.uid);
        await onValue(ref(db, `/permission/${user.uid}`), snapshot => {
          const res = snapshot.val();
          setRole(res.role);
          setDistrict(res.district);
        });
        await route.push('/dashboard');
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <Layout title="Chat bot | Login Page" className="h-screen">
      <div className="mx-auto w-full max-w-md min-h-screen max-h-screen pt-20">
        <div className=" pb-8 m-auto">
          <center>
            {/* <img className="h-auto w-auto" src={'assets/images/chat-bot.png'} /> */}
            <img className="h-72 w-auto" src={'assets/images/bgcm.png'} />
          </center>
        </div>
        <div className=" pb-8 m-auto">
          <center>
            <div className="text-2xl text-white font-bold uppercase tracking-wide">
              ????????????????????????????????????????????????????????????????????????????????????????????????
            </div>
          </center>
        </div>
        <Form
          className="px-8 pt-2 pb-8 mb-4 pd-12"
          name="basic"
          layout="vertical"
          requiredMark={true}
        >
          <Form.Item
            name="username"
            className="block text-gray-700 mb-10 text-sm font-bold  w-full"
            rules={[{ required: true, message: '??????????????????????????? ??????????????????????????????!' }]}
          >
            <Input
              className=""
              id="email"
              type="text"
              size="large"
              placeholder="Email"
              prefix={<UserOutlined />}
              value={email}
              onChange={e => {
                setEmail(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            className="block mb-8 text-gray-700 text-sm font-bold  w-full"
            rules={[{ required: true, message: '??????????????????????????? ????????????????????????!' }]}
          >
            <Input.Password
              className=""
              id="password"
              type="password"
              size="large"
              placeholder="Password"
              prefix={<LockOutlined />}
              value={password}
              onChange={e => {
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
              <div className="text-blue-600 font-bold">LOGIN</div>
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
}

export default Login;
