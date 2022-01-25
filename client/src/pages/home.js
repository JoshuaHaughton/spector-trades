import Head from 'next/head';
import { HomeNavbar } from 'src/components/home/navbar';
import Hero from 'src/components/home/hero';
import Features from 'src/components/home/features';
import CTA from 'src/components/home/cta';
import HomeStats from 'src/components/home/stats';
import Footer from 'src/components/home/footer';

const Home = () => (
  <>
    <Head>
      <title>
        Home | Spector Trades
      </title>
    </Head>

    <HomeNavbar />
    <Hero />
    <Features />
    <HomeStats />
    <CTA />
    <Footer />


  </>
);

export default Home;
