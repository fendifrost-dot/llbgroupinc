import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { callFunction, isBackendConfigured } from "@/integrations/supabase/client";

interface LeadMagnetFormProps {
  /** Recorded on the lead row so Fendi can see which surface converted. */
  source: string;
  heading?: string;
  body?: string;
}

/**
 * "Read Chapter 1 free" — Handoff §4.7. The edge function is the only thing
 * that can write to leads, and it returns a short-lived signed URL for the
 * sample PDF.
 */
export function LeadMagnetForm({
  source,
  heading = "Read Chapter One",
  body = "Enter your email and we will send you the opening chapter of Living Life Balanced — 7 Principles to Restore Faith, Purpose, and Wellness.",
}: LeadMagnetFormProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isBackendConfigured) {
      toast.error("This is not available yet. Please check back shortly.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await callFunction<{ captured: boolean; url: string | null }>(
        "lead-magnet",
        { email, source },
      );
      if (result.url) {
        setDownloadUrl(result.url);
        toast.success("Your chapter is ready below.");
      } else {
        // Lead captured, PDF not uploaded yet.
        toast.success("Thank you. We will send your chapter shortly.");
      }
      setEmail("");
    } catch (error) {
      console.error("lead magnet failed", error);
      toast.error("We could not process that. Please check the address and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 bg-card border border-border rounded-sm">
      <h3 className="font-serif text-xl font-medium text-foreground mb-3">{heading}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">{body}</p>

      {downloadUrl ? (
        <Button variant="hero" asChild>
          <a href={downloadUrl} target="_blank" rel="noreferrer">
            Download Chapter One
          </a>
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <label htmlFor={`lead-email-${source}`} className="sr-only">
            Email address
          </label>
          <Input
            id={`lead-email-${source}`}
            type="email"
            required
            autoComplete="email"
            placeholder="your@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="bg-background border-border"
          />
          <Button type="submit" variant="hero" disabled={submitting} className="shrink-0">
            {submitting ? "Sending…" : "Send It"}
          </Button>
        </form>
      )}
    </div>
  );
}
