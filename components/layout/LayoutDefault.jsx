import Head from 'next/head';
import styles from '../../styles/index.module.css'
/* Components */
// import Header from '../header/HeaderDefault';
// import Footer from '../footer/FooterDefault';


export default function Layout({
  children,
  title = 'Government',
  description = 'Next.js with Sequelize | A boilerplate Next.js and Sequelize from dyarfi.github.io',
  keywords = 'Next.js, Sequelize, ORM, JWT, Json Web Tokens, Authentication, Application',
  type = 'object',
  url = '/',
  image = '/nextjs.svg',
  origin = '',
}) {
  return (
    <div className={styles.backgroundbody}>
      <div className='min-h-screen max-h-screen' >
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
        {/* <Header /> */}
        {/* <div className="h-14"></div> */}
        {children}
        {/* <Footer /> */}


      </div>
    </div>
  );
}
