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
  return (
    <>
      <Head>
        {/* Import CSS for nprogress */}
        <link rel="stylesheet" type="text/css" href="/nprogress.css" />
      </Head>
      <Component
        {...pageProps}
        setRole={setRole}
        setDistrict={setDistrict}
        role={role}
        district={district}
      />
    </>
  );
}

export default MyApp;
