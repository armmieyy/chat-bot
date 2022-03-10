import Head from 'next/head';
import Link from 'next/link';
import { Layout, Menu, Button, Row, Col, Breadcrumb } from 'antd';
/* Components */
import HeaderAdmin from '../header/HeaderAdmin';
import MenuAdmin from '../navigation/MenuAdmin';
import MenuSuperAdmin from '../navigation/MenuSuperAdmin';
// import Footer from '../footer/FooterDefault';
const { Header, Footer, Sider, Content } = Layout;
import { useEffect, useState } from 'react'
import { absoluteUrl, checkIsLogin } from '../../middleware/utils';
import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
  DashboardOutlined,
  UnorderedListOutlined,
  UserOutlined
} from '@ant-design/icons';

const { SubMenu } = Menu;

const _routes = [
  {
    path: 'index',
    breadcrumbName: 'home',
  },
  {
    path: 'first',
    breadcrumbName: 'first',
  },
  {
    path: 'second',
    breadcrumbName: 'second',
  },
];

export default function LayoutAdmin({
  children,
  title = 'Government',
  description = 'Next.js with Sequelize | A boilerplate Next.js and Sequelize from dyarfi.github.io',
  keywords = 'Next.js, Sequelize, ORM, JWT, Json Web Tokens, Authentication, Application',
  type = 'object',
  url = '/',
  image = '/nextjs.svg',
  origin = '',
  index
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [active, setActive] = useState(false);
  const [user, setUser] = useState(false);



  useEffect(() => {
    fetchUserLogin()
  }, [])

  
  function itemRender(route, params, routes, paths){
    // const last = routes.indexOf(route) === routes.length - 1;
    return <Link to={"#"}>{route.breadcrumbName}</Link>
  }

  async function fetchUserLogin() {
    const userLogin = await checkIsLogin()
    // console.log(userLogin)
    setUser(userLogin)
  }



  const handleClick = () => {
    setActive(!active);
  };

  return (
    <div className="h-screen">
      <Head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <link rel="icon" href="/favicon.png" />
        <meta name="robots" content="index, follow" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />

        <meta
          property="twitter:image:src"
          content={`${origin}${image}?v=${Math.floor(Date.now() / 100)}`}
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={url} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />

        <meta
          property="og:image"
          content={`${origin}${image}?v=${Math.floor(Date.now() / 100)}`}
        />
        <meta property="og:site_name" content={url} />
        <meta property="og:type" content={type} />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={url} />
        <meta property="og:description" content={description} />

        {/* <meta name="viewport" content="initial-scale=1.0, width=device-width" /> */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
          integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
          crossorigin="anonymous"
        /> */}
      </Head>
      {/* <Header />
      <div className="h-14"></div>
      {children}
      <Footer /> */}
      <Layout>

        <Row>

          <Col span={3} style={{ backgroundColor: "#ffffff" }}>
            {user.type_user == 1 &&
              <MenuSuperAdmin index={index} />
            }
            {user.type_user == 2 &&
              <MenuAdmin />
            }
            {/* <a
              onClick={toggleCollapsed}
              className="lg:inline-flex lg:w-auto w-full px-2 py-2 rounded h-8 text-white bg-green-600 font-bold items-center justify-center hover:bg-green-600 hover:text-white"
              icon={<MailOutlined />}
            >
              {/* {collapsed ? MenuUnfoldOutlined : MenuFoldOutlined} 
              สมัครใช้งาน
            </a> */}

          </Col>
          <Col span={21}>
            <HeaderAdmin />

            <Row >
              <Col span={24} className="p-4 pb-0">
                <Row>
                  <Col span={12} className="">
                    <Row className="p-1.5 items-center">
                      <UserOutlined className="text-4xl" />
                      <h1 className="ml-4 mt-4 text-4xl">management activities</h1>
                    </Row>
                  </Col>
                  <Col span={12} className="">
                    <Breadcrumb  routes={_routes} />
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Layout >

                  <Content style={{ padding: "1rem" }}>
                    <div className="w-full" style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                      {children}
                    </div>
                  </Content>
                  {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
                </Layout>
              </Col>
            </Row>
          </Col>
        </Row>



        {/* <Sider style={{ minHeight: '100vh', color: 'white' }}> */}
        {/* <div style={{ width: 256 }}> */}
        {/* <Button type="primary"
          // onClick={toggleCollapsed}
          style={{ marginBottom: 16 }}>
          {/* {collapsed ? MenuUnfoldOutlined : MenuFoldOutlined} 
          AA
        </Button> */}

        {/* </div> */}
        {/* </Sider> */}

      </Layout>


    </div>
  );
}
