import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from './../styles/Home.module.css';
import Header from '../components/Header';
import MainDoor from '../components/MainDoor';
import PageChange from '../components/PageChange/PageChange';

const Test: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* 헤더 */}
      <Header />
      {/* 메뉴 */}
      <section>
        <MainDoor />
      </section>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
      <p>asdfqwer</p>
      <PageChange path={"asdf"} />,
      <p className="text-s">The quick brown fox ...</p>
    </div>
  )
}

export default Test
