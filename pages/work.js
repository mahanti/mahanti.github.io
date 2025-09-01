import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'

export default function Work() {
  return (
    <>
      <Head>
        <title>Work - Arjun Mahanti</title>
        <meta name="description" content="Selected projects and collaborations" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      
      <Layout>
        <section className="mb-24">
          <div className="col-8 row">
            <span className="title">Work</span>
            <span className="subtitle">Selected projects and collaborations</span>
          </div>
        </section>
        <section>
          <div className="col-8 gap-12 row">
            <Link href="/work/block" className="image-link row">
              <img src="/img/work/proto.jpg" className="optimized-image image-border" loading="lazy" />
              <span className="title color-block">Block</span>
              <span className="subtitle color-block">Principal Product Designer, Proto<br />2023 — Present</span>
            </Link>
            <Link href="/work/angellist" className="image-link row">
              <img src="/img/work/angellist.jpg" loading="lazy" />
              <span className="title color-al">AngelList</span>
              <span className="subtitle color-al">Principal Designer<br />2022 — 2023</span>
            </Link>
            <Link href="/work/square" className="image-link row">
              <img src="/img/work/block.jpg" loading="lazy" />
              <span className="title color-sq">Square</span>
              <span className="subtitle color-sq">Senior Product Designer<br />2017 — 2022</span>
            </Link>
            <Link href="/work/ando" className="image-link row">
              <img src="/img/work/ando.jpg" loading="lazy" />
              <span className="title color-ando">Ando</span>
              <span className="subtitle color-ando">Lead Designer<br />2016 — 2017</span>
            </Link>
            <Link href="/work/sidecar" className="image-link row">
              <img src="/img/work/sidecar.jpg" loading="lazy" />
              <span className="title color-sidecar">Sidecar</span>
              <span className="subtitle color-sidecar">Founding Designer<br />2012 — 2016</span>
            </Link>
          </div>
        </section>
      </Layout>
    </>
  )
}
