import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'

export default function Products() {
  return (
    <>
      <Head>
        <title>Products - Arjun Mahanti</title>
        <meta name="description" content="A collection of iOS apps that I've designed and built over the years." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      
      <Layout>
        <section className="mb-24">
          <div className="col-8 row">
            <span className="title">Products</span>
            <span className="subtitle">A collection of iOS apps that I've designed and built over the years.</span>
          </div>
        </section>
        <section>
          <div className="col-8 gap-12 row">
            <Link href="/products/approach" className="image-link row">
              <img src="/img/products/approach.jpg" loading="lazy" />
              <span className="title color-approach">Approach</span>
              <span className="subtitle color-approach">Golf products designed for fun, built for performance.</span>
            </Link>
            <Link href="/products/sudo" className="image-link row">
              <img src="/img/products/sudoku.jpg" loading="lazy" />
              <span className="title color-sudo">Sudo</span>
              <span className="subtitle color-sudo">Beautiful Sudoku – with a colorful twist.</span>
            </Link>
            <Link href="/products/zoon" className="image-link row">
              <img src="/img/products/zoon/01@2x.png" className="image-border" loading="lazy" />
              <span className="title color-zoon">zoon</span>
              <span className="subtitle color-zoon">A simple music player for iOS.</span>
            </Link>
            <Link href="/products/circuit" className="image-link row">
              <img src="/img/products/circuit.jpg" loading="lazy" />
              <span className="title color-circuit">Circuit</span>
              <span className="subtitle color-circuit">A stupidly-simple, extremely efficient, HIIT timer.</span>
            </Link>
            <Link href="/products/jot" className="image-link row">
              <img src="/img/products/jot.jpg" loading="lazy" />
              <span className="title color-jot">jot</span>
              <span className="subtitle color-jot">The fastest app for notes and sketches.</span>
            </Link>
            <Link href="/products/terraforms" className="image-link row">
              <img src="/img/products/terraforms.jpg" loading="lazy" />
              <span className="title color-terraforms">Terraform Explorer</span>
              <span className="subtitle color-terraforms">An experimental app to explore Terraforms by Mathcastles.</span>
            </Link>
          </div>
        </section>
      </Layout>
    </>
  )
}
