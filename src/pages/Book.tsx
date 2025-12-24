import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

const inquiryTypes = [
  "Consulting Engagement",
  "Speaking Inquiry",
  "Education Program",
  "Partnership Opportunity",
  "Media Inquiry",
  "Other",
];

const Book = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    title: "",
    inquiryType: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your inquiry. We'll be in touch within 2 business days.");
    setFormData({
      name: "",
      email: "",
      organization: "",
      title: "",
      inquiryType: "",
      message: "",
    });
  };

  return (
    <Layout>
      <PageHeader
        overline="Contact"
        title="Engage LLB Group"
        description="Schedule a consultation or submit an inquiry. Our team typically responds within 2 business days."
      />

      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-foreground mb-2">
                      Name *
                    </label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="bg-card border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-foreground mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="bg-card border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-foreground mb-2">
                      Organization
                    </label>
                    <Input
                      value={formData.organization}
                      onChange={(e) =>
                        setFormData({ ...formData, organization: e.target.value })
                      }
                      className="bg-card border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-foreground mb-2">
                      Title
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="bg-card border-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">
                    Inquiry Type *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {inquiryTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, inquiryType: type })
                        }
                        className={`px-4 py-2 text-sm border rounded-sm transition-colors ${
                          formData.inquiryType === type
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border text-muted-foreground hover:border-foreground/30"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">
                    Message *
                  </label>
                  <Textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Please describe your objectives and how we can help..."
                    className="bg-card border-border resize-none"
                  />
                </div>

                <Button type="submit" variant="hero" className="w-full sm:w-auto">
                  Submit Inquiry
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-12">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
                  Headquarters
                </p>
                <address className="not-italic text-foreground leading-relaxed">
                  LLB Group, Inc.<br />
                  69 W. Washington Street<br />
                  Suite 1240<br />
                  Chicago, IL 60602
                </address>
              </div>

              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
                  General Inquiries
                </p>
                <p className="text-foreground">info@llbgroup.com</p>
              </div>

              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
                  Media & Press
                </p>
                <p className="text-foreground">press@llbgroup.com</p>
              </div>

              <div className="p-6 bg-card border border-border rounded-sm">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  For urgent matters or to schedule a call directly, please 
                  indicate your preferred availability in your message and a 
                  member of our team will reach out to confirm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Book;
