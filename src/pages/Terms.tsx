import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";

/**
 * Footer links to /terms on every page, so this route has to exist.
 * Factual description of how the programs are sold and delivered. Not
 * lawyer-reviewed; the notice stays until counsel signs it off.
 */
const Terms = () => (
  <Layout>
    <PageHeader
      overline="Legal"
      title="Terms of Service"
      description="The terms that apply when you use this website or enrol in an LLB program."
    />

    <section className="py-16 lg:py-24">
      <div className="section-container">
        <div className="max-w-3xl space-y-10">
          <div className="border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Pending legal review.</strong>{" "}
              These terms describe current practice accurately, but they have not
              yet been reviewed by counsel. They must be reviewed before the site
              accepts payments.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl tracking-[0.04em]">Who provides these programs</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              LLB Group, Inc., 69 W. Washington Street, Suite 1240, Chicago,
              IL 60602.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl tracking-[0.04em]">What you are buying</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Enrolment is a one-time payment for access to a self-paced program:
              video and audio lessons and a downloadable workbook. There is no
              subscription and nothing renews. Access is for you personally and
              is not transferable.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl tracking-[0.04em]">What the material is, and is not</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              LLB programs are educational and personal-development material.
              They are not medical, mental-health, legal or financial advice, and
              they are not a substitute for care from a licensed professional. If
              you are in crisis, contact a licensed provider or your local
              emergency service.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We do not promise any particular outcome. What you get out of a
              program depends on the work you put into it.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl tracking-[0.04em]">Your copy of the material</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              The lessons, workbooks and written material remain the property of
              LLB Group, Inc. You may use and print them for your own practice.
              You may not resell them, share your access, or republish the
              material.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl tracking-[0.04em]">Refunds</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Refund terms are being finalised and will be published here before
              the site accepts payments. Until then, refund requests are handled
              case by case through the contact form.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl tracking-[0.04em]">Your account</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Keep your sign-in details to yourself. We may suspend access that
              is shared, resold, or used to copy the material.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl tracking-[0.04em]">Changes</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              These terms may change. Material changes will be posted here before
              they take effect, and they will not change the terms of a program
              you have already bought.
            </p>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Terms;
