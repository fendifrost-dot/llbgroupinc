import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";

/**
 * Footer links to /privacy on every page, so this route has to exist.
 * The content below describes what this site actually does today. It is a
 * factual description, not a lawyer-reviewed policy, and the review notice
 * stays visible until counsel signs it off.
 */
const Privacy = () => (
  <Layout>
    <PageHeader
      overline="Legal"
      title="Privacy Policy"
      description="How LLB Group, Inc. handles information collected through this website."
    />

    <section className="py-16 lg:py-24">
      <div className="section-container">
        <div className="max-w-3xl space-y-10">
          <div className="border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Pending legal review.</strong>{" "}
              This page describes current practice accurately, but it has not yet
              been reviewed by counsel. It must be reviewed before the site
              accepts payments.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl tracking-[0.04em]">Who we are</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              LLB Group, Inc., 69 W. Washington Street, Suite 1240, Chicago,
              IL 60602. Questions about this policy can be sent through the
              contact form on this site.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl tracking-[0.04em]">What we collect</h2>
            <ul className="mt-4 space-y-3 text-muted-foreground leading-relaxed list-disc pl-5">
              <li>
                <strong className="text-foreground">Your email address</strong>{" "}
                when you request the free opening chapter or ask to be told when
                a program opens.
              </li>
              <li>
                <strong className="text-foreground">Enquiry details</strong> you
                type into the contact form: your name, your message, and the type
                of enquiry.
              </li>
              <li>
                <strong className="text-foreground">Account details</strong> if
                you enrol in a program: your email address and your progress
                through the material.
              </li>
              <li>
                <strong className="text-foreground">Payment details</strong> are
                handled by our payment processor. Card numbers are never sent to
                or stored on this site.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl tracking-[0.04em]">How we use it</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              To send you what you asked for, to give you access to programs you
              have bought, to answer enquiries, and to tell you about LLB
              programs and events. Every marketing email carries an unsubscribe
              link, and unsubscribing does not affect access to anything you have
              purchased.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl tracking-[0.04em]">Who else sees it</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We do not sell your information. It is shared only with the
              services that run this site: our hosting and database provider, our
              payment processor, and our email provider. Each handles it only to
              provide that service.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl tracking-[0.04em]">Your choices</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              You can ask us for a copy of what we hold about you, ask us to
              correct it, or ask us to delete it. Deleting your account also ends
              access to any program bought under it. Use the contact form to make
              a request.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl tracking-[0.04em]">Changes</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              If this policy changes materially, the change will be posted here
              before it takes effect.
            </p>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Privacy;
