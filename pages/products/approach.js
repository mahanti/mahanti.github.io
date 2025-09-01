import Head from 'next/head'
import Layout from '../../components/Layout'

export default function ApproachPage() {
  return (
    <>
      <Head>
        <title>Approach - Arjun Mahanti</title>
        <meta name="description" content="Designed for fun, built for performance, Approach is the best app for golfers." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      
      <Layout>
        <section id="header-approach" className="page-header color-approach">
          <div className="row nav-row">
            <div className="text-section row">
              <span className="title white">Approach</span>
              <span className="subtitle white">Designed for fun, built for performance, Approach is the best app for golfers from the 1st hole to the 19th.</span>
            </div>
            <div className="button-section">
              <a className="button-link secondary" href="https://approachgolf.co" target="_blank" rel="noopener noreferrer">View website</a>
              <a className="button-link primary color-approach" href="#">Coming soon</a>
            </div>
          </div>
        </section>
        <section>
          <div className="row">
            <span className="title">Approach Golf Co.</span>
            <span className="subtitle">
              I started golfing in highschool and was immediately hooked to the game. After a few years off the course, I brushed off my old clubs and got back into it. While clubs, tools, and styles had all evolved since high school, the apps "designed" for golf were ugly and clunky, to say the least.
              <br /><br />
              Built fully in SwiftUI, this app was mostly designed and built in code — opening the door to intuitive and fluid interactions that take advantage of iOS.
            </span>
          </div>
        </section>
        <section>
          <div className="col-8">
            <img src="/img/products/approach/01@2x.jpg" data-zoomable />
            <p className="caption">The core experience of Approach centers around elegant scorecards, round overviews, and a native rangefinder built directly into the app.</p>
          </div>
        </section>
        <section>
          <div className="col-8">
            <img src="/img/products/approach/02@2x.jpg" data-zoomable />
            <p className="caption">The Approach logo, a stylized "A," is a nod to two different flight paths, or approaches, converging on a single shot.</p>
          </div>
        </section>
        <section>
          <div className="col-8">
            <img src="/img/products/approach/03@2x.jpg" data-zoomable />
            <p className="caption">Round overviews highlight user-uploaded photos, key performance metrics, and a simple dot matrix that visualizes your score to par across the round.</p>
          </div>
        </section>
        <section>
          <div className="col-8">
            <img src="/img/products/approach/08@2x.jpg" data-zoomable />
            <p className="caption">Custom data visualizations capture the essence of your round. From high-level stats like driving accuracy to granular details such as hazards per hole, golfers gain a clear sense of their performance throughout.</p>
          </div>
        </section>
        <section>
          <div className="col-8">
            <img src="/img/products/approach/06@2x.jpg" data-zoomable />
            <p className="caption">Approach leverages core iOS capabilities like flyover previews of courses during round setup, blending practicality with craft.</p>
          </div>
        </section>
      </Layout>
    </>
  )
}
