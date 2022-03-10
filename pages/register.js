import Link from 'next/link';
import { useRouter } from 'next/router';

/* utils */
import { absoluteUrl, apiInstance } from '../middleware/utils';

/* components */
import Layout from '../components/layout/LayoutDefaultRigster';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from '@fortawesome/fontawesome-svg-core'
import validator from 'validator'

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
  notification
} from 'antd';
import { useEffect, useState } from 'react'
import FormItem from 'antd/lib/form/FormItem';

const { Text, Title } = Typography;
const { TextArea } = Input;


export default function Register(props) {

  return (
    <Layout title="Chat Bot | Register Page" >
      <p className="ml-6 pt-6">
        <a href="/" className="text-black no-underline hover:text-blue-700">
          <FontAwesomeIcon
            icon={['fas', 'long-arrow-alt-left']}
            className="mr-1"
          />
          กลับหน้าหลัก
        </a>
      </p>
      <div className="mx-auto w-full max-w-lg py-2">
        <div className="text-left mt-8">
          <p class="text-center text-4xl">สมัครสมาชิก</p>
        </div>
        <Form
          name="basic"
          class="bg-white shadow-lg rounded px-12 pt-12 pb-8 mb-4 -m-10 mt-10"
          layout="vertical"
          requiredMark={true}
        >
          <Form.Item
            name="email"
            className="w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            style={{ textAlign: "left !important" }}
            rules={[
              {
                required: true,
                message: 'กรุณากรอกอีเมลล์!'
              },
              {
                async validator(rule, value) {
                  const data = {
                    "email": value,
                  }
                },
              },
            ]}
          >
            <Input className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" size="large" placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            className="w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน!' }]}
          >
            <Input
              type="password"
              className="w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              size="large"
              placeholder="รหัสผ่าน"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit"
            style={{
              backgroundColor: '#0f0f0f',
              borderColor: '#f0f7f0',
              height: 45,
              width: 110,
              marginBottom: '0px !important',
              color: "white !important"

            }}
>
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
}

