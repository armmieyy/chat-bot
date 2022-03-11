import Head from 'next/head';
import Router from 'next/router';
// import '../styles/globals.css'
import '../styles/default.css'
import 'tailwindcss/tailwind.css'
import 'antd/dist/antd.css';


function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Import CSS for nprogress */}
        <link rel="stylesheet" type="text/css" href="/nprogress.css" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}


export default MyApp;

