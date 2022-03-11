import Link from 'next/link';

import { useRouter } from 'next/router';


/* components */
import Layout from '../components/layout/LayoutDefault';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(fas);

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
import { useEffect, useState } from 'react';
const { Text, Title } = Typography;

const { TextArea } = Input;

export default function Register(props) {
  

  return (
    <Layout
      title="Chat bot | Forget Password"
      className="h-screen"
    >
      <div className="mx-auto w-full max-w-lg py-2">
        <div className="bg-white shadow-lg rounded px-12 pt-12 pb-8 mb-4 -m-10 mt-10">
          <Form
            name="basic"
            layout="vertical"
            onFinish={onSubmitHandler}
            requiredMark={true}
          >
            <div className="flex items-center justify-between mb-8 mr-2 ml-2">
              <p className="">
                <a
                  href="/"
                  className="text-black no-underline hover:text-green-500"
                >
                  <FontAwesomeIcon
                    icon={['fas', 'long-arrow-alt-left']}
                    className="mr-1"
                  />
                  กลับหน้าหลัก
                </a>
              </p>
              <p className="">
                ยังไม่บัญชีผู้ใช้ ?
                <a
                  href="register"
                  className="text-black no-underline hover:text-green-500"
                >
                  สมัครสมาชิก
                </a>
              </p>
            </div>
            <div className="text-left mt-8">
              <p className="text-xl font-bold">ลืมรหัสผ่าน</p>
              <p className="text-gray-400 text-opacity-100">
                กรุณาระบุอีเมลล์เพื่อส่งคำขอรีเซ็ตรหัสผ่าน
              </p>
            </div>
            <Form.Item
              name="email"
              label="อีเมลล์"
              className="block text-gray-700 text-sm font-bold mb-2 w-full"
              style={{ textAlign: "left !important" }}
              rules={[
                {
                  required: true,
                  message: 'กรุณากรอกอีเมลล์!'
                },
              ]}
            >
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" size="large" placeholder="Email"
              />
            </Form.Item>
            <Form.Item className="text-center">
              <Button
                style={{
                  backgroundColor: '#3E83F7',
                  borderColor: '#059669',
                  height: 40,
                  marginBottom: '0px !important',
                }}
                htmlType="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                <Text className="text-custom-white">ส่งคำขอรีเซ็ทรหัสผ่าน</Text>
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Layout>
  );
}

