import Head from 'next/head'
import Layout from '../components/Layout'

export default function About() {
  return (
    <>
      <Head>
        <title>About - Arjun Mahanti</title>
        <meta name="description" content="A multidisciplinary designer building delightful solutions to complex problems." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      
      <Layout>
        <section className="mt-48">
          <img src="/img/about/about@2x.png" loading="lazy" />
          <div className="col-8 row">
            <span className="title">About</span>
            <span className="subtitle">
              I'm a Principal Product Designer at Block currently designing{' '}
              <a href="https://proto.xyz/" target="_blank" rel="noopener noreferrer">Proto</a>{' '}
              and special projects across the company.<br /><br />
              I also have a small studio where I build iOS apps that are rooted in simple, elegant interactions. I focus on building purpose-built tools that feel natural, simple, and delightful to use.<br /><br />
              My work is grounded in clarity and high craft, pairing rigor in detail with a willingness to explore unbounded possibilities. I believe in design as a process of uncovering the essential: iterating through exploration, testing through prototypes, and shaping experiences that feel obvious once they exist.<br /><br />
              <a href="https://twitter.com/arjunmahanti" target="_blank" rel="noopener noreferrer">Twitter</a><br /><br />
              <a href="https://instagram.com/mahanti" target="_blank" rel="noopener noreferrer">Instagram</a><br /><br />
              <a href="mailto:arjun.mahanti@gmail.com">Email</a>
            </span>
          </div>
        </section>
      </Layout>
    </>
  )
}
