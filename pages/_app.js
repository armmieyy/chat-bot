import Head from 'next/head';
import Router from 'next/router';
// import '../styles/globals.css'
import '../styles/default.css';
import 'tailwindcss/tailwind.css';
import 'antd/dist/antd.css';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [role, setRole] = useState();
  const [district, setDistrict] = useState();
  const [user, setUser] = useState();
  return (
    <>
      <Head>
        {/* Import CSS for nprogress */}
        <link rel="stylesheet" type="text/css" href="/nprogress.css" />
        <script src="https://d.line-scdn.net/liff/1.0/sdk.js"></script>
      </Head>
      <Component
        {...pageProps}
        setRole={setRole}
        setDistrict={setDistrict}
        role={role}
        district={district}
        setUser={setUser}
        user={user}
      />
    </>
  );
}

export default MyApp;
