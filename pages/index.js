import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import Carousel from '../components/Carousel'

export default function Home() {
  return (
    <>
      <Head>
        <title>Arjun Mahanti</title>
        <meta name="description" content="A multidisciplinary designer building delightful solutions to complex problems." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      
      <Layout>
        <Carousel />
        
        <section className="section-two-column mb-24">
          <div className="section-header row">
            <Link href="/work" className="section-header-link">
              <span className="title">Work</span>
              <span className="subtitle">Select professional work.</span>
            </Link>
          </div>
          <div className="section-content">
            <Link href="/work/block" className="image-link row">
              <span className="title color-block">Block</span>
              <span className="subtitle color-block">Principal Product Designer, Proto<br />2023 — Present</span>
            </Link>
            <a href="https://mahanti.co/mango_studios/" className="image-link row">
              <span className="title color-mango">Mango Studios</span>
              <span className="subtitle color-mango">Founder<br />2022 — Present</span>
            </a>
            <Link href="/work/angellist" className="image-link row">
              <span className="title color-al">AngelList</span>
              <span className="subtitle color-al">Senior Product Designer<br />2022 — 2023</span>
            </Link>
            <Link href="/work/square" className="image-link row">
              <span className="title color-sq">Square</span>
              <span className="subtitle color-sq">Senior Product Designer, Restaurants<br />2017 — 2022</span>
            </Link>
            <Link href="/work/ando" className="image-link row">
              <span className="title color-ando">Ando</span>
              <span className="subtitle color-ando">Lead Designer<br />2016 — 2017</span>
            </Link>
            <Link href="/work/sidecar" className="image-link row">
              <span className="title color-sidecar">Sidecar</span>
              <span className="subtitle color-sidecar">Founding Designer<br />2012 — 2016</span>
            </Link>
          </div>
        </section>
        
        <hr className="divider" />
        
        <section className="section-two-column mb-24">
          <div className="section-header row">
            <Link href="/products" className="section-header-link">
              <span className="title">Products</span>
              <span className="subtitle">iOS apps I've designed and built over the years.</span>
            </Link>
          </div>
          <div className="section-content">
            <Link href="/products/approach" className="image-link row">
              <span className="title color-approach">Approach</span>
              <span className="subtitle color-approach">Golf products designed for fun, built for performance.</span>
            </Link>
            <Link href="/products/zoon" className="image-link row">
              <span className="title color-zoon">zoon</span>
              <span className="subtitle color-zoon">A simple music player for iOS.</span>
            </Link>
            <Link href="/products/sudo" className="image-link row">
              <span className="title color-sudo">Sudo</span>
              <span className="subtitle color-sudo">Beautiful Sudoku – with a colorful twist.</span>
            </Link>
            <Link href="/products/circuit" className="image-link row">
              <span className="title color-circuit">Circuit</span>
              <span className="subtitle color-circuit">A stupidly-simple, extremely efficient, HIIT timer.</span>
            </Link>
            <Link href="/products/jot" className="image-link row">
              <span className="title color-jot">jot</span>
              <span className="subtitle color-jot">The fastest app for notes and sketches.</span>
            </Link>
            <Link href="/products/terraforms" className="image-link row">
              <span className="title color-terraforms">Terraforms</span>
              <span className="subtitle color-terraforms">An experimental app to explore Terraforms by Mathcastles.</span>
            </Link>
          </div>
        </section>
        
        <hr className="divider" />
        
        <section className="section-two-column">
          <div className="section-header row">
            <Link href="/photos" className="section-header-link">
              <span className="title">Photography</span>
              <span className="subtitle">Select film and digital photography.</span>
            </Link>
          </div>
          <div className="section-content">
            <Link href="/photos/harvest" className="image-link row">
              <span className="title color-tint">Harvest</span>
              <span className="subtitle color-tint">In 2021, I joined winemaker Pascal Carole to document his premier harvest in the Loire Valley.</span>
            </Link>
            <Link href="/photos/diamondmine" className="image-link row">
              <span className="title color-tint">Diamond Mine</span>
              <span className="subtitle color-tint">Behind the scenes of Ruby Nights recording at the Diamond Mine studio in Queens, NY.</span>
            </Link>
          </div>
        </section>
      </Layout>
    </>
  )
}
