import Head from 'next/head'
import Layout from '../../components/Layout'

export default function BlockPage() {
  return (
    <>
      <Head>
        <title>Proto - Arjun Mahanti</title>
        <meta name="description" content="Principal Product Designer at Proto, Block" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      
      <Layout>
        <section className="mb-24">
          <div className="col-8 row">
            <span className="title">Proto</span>
            <span className="subtitle">
              I returned to Block to join Proto, a new business unit dedicated to accelerating the transition to a more open and equitable global economy.<br /><br />
              At Proto, I am the product design lead for our mining products. I helped shape the initial product vision for our software suite, played a key role in defining the brand, including designing the logo mark, and worked closely with the hardware and industrial design teams to translate customer needs into elegant solutions.
            </span>
          </div>
        </section>
        <section>
          <div className="col-8 gap-12">
            <img src="/img/work/proto/01@2x.png" loading="lazy" data-zoomable />
            <p className="caption">Proto Rig is a major shift in Bitcoin mining. Redesigned from the ground up, Rig is a purpose-built miner with a focus on efficiency, reliability, and scalability. It addresses rackspace density, maximizes existing electrical infrastructure, and makes upgrades easy and efficient.</p>
          </div>
        </section>
        <section>
          <div className="col-8 gap-12">
            <img src="/img/work/proto/02@2x.png" loading="lazy" data-zoomable />
            <p className="caption">I designed the Proto logomark, building on the original logotype created by <a href="https://x.com/rsa" target="_blank" rel="noopener noreferrer">Robert Andersen</a>.</p>
          </div>
        </section>
        <section>
          <div className="col-8 gap-12">
            <img src="/img/work/proto/03@2x.png" loading="lazy" data-zoomable />
            <p className="caption">The mark was inspired by the connecting dash in the team's original name, "Proto." Its geometry references a flattened block, connecting Proto to our parent company and to mining blocks.</p>
          </div>
        </section>
        <section>
          <div className="col-8 gap-12">
            <img src="/img/work/proto/04@2x.png" loading="lazy" data-zoomable />
            <p className="caption">I taught myself design by redrawing early versions of the Square website and Point of Sale product. Seeing the Proto logo alongside the rest of the Block portfolio was a true full circle moment.</p>
          </div>
        </section>
        <section>
          <div className="col-8 gap-12">
            <img src="/img/work/proto/05@2x.png" loading="lazy" data-zoomable />
            <p className="caption">As part of the brand design process, I extended the Proto logomark to develop a custom typeface. This became the foundation of Proto Type, a full typeface built by OhNo. Shown here are some of my favorite numeral glyphs from the original typeface.</p>
          </div>
        </section>
        <section>
          <div className="col-8 gap-12">
            <div className="mt-16 mb-8">
              <h2 className="title">Proto Fleet</h2>
              <p className="subtitle">Mining software has historically lagged behind, with fragmented tools, complex interfaces, and limited efficiency. Proto Fleet was created to address these gaps by unifying key operator needs such as power scaling, miner diagnostics, maintenance, and fleet performance into a single open source platform that runs on-premises, in the cloud, or in a hybrid environment.</p>
            </div>
            <img src="/img/work/proto/06@2x.png" className="image-border" loading="lazy" data-zoomable />
            <p className="caption">Proto Fleet allows mining operators to manage their entire fleet just as easily as they can focus on individual ASIC performance.</p>
          </div>
        </section>
        <section>
          <div className="col-8 gap-12">
            <img src="/img/work/proto/07@2x.png" className="image-border" loading="lazy" data-zoomable />
            <p className="caption">Mining fleets can range from a single rig to thousands. I designed a flexible, scalable, and compact system that lets operators take action on their fleet in moments.</p>
          </div>
        </section>
        <section>
          <div className="col-8 gap-12">
            <img src="/img/work/proto/08@2x.png" loading="lazy" data-zoomable />
            <p className="caption">A small snippet from an onboarding flow that guides customers on how to install Proto Fleet locally.</p>
          </div>
        </section>
        <section>
          <div className="col-8 gap-12">
            <img src="/img/work/proto/09@2x.png" loading="lazy" data-zoomable />
            <p className="caption">A visual exploration on a pairing process for Proto Rig.</p>
          </div>
        </section>
      </Layout>
    </>
  )
}
