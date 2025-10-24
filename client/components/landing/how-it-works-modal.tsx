import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";

interface HowItWorksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  {
    id: 1,
    title: "Create Your Token",
    description:
      "Launch your token with our simple, no-code interface. Set your tokenomics and launch in minutes.",
  },
  {
    id: 2,
    title: "Build Your Community",
    description:
      "Engage with your supporters and build a strong community around your vision.",
  },
  {
    id: 3,
    title: "Raise Capital",
    description:
      "Accept investments from verified backers who believe in your project and vision.",
  },
  {
    id: 4,
    title: "Scale & Grow",
    description:
      "Use our tools and community support to scale your project and achieve your goals.",
  },
];

export function HowItWorksModal({ open, onOpenChange }: HowItWorksModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-transparent uppercase rounded-[32px] backdrop-blur-sm border border-primary/10 p-2">
        <div className="p-6 rounded-3xl border bg-card">
          <div className="relative">
            <div className="flex justify-center py-8">
              <div className="relative">
                <Image
                  className="scale-200"
                  src="/logogreen.png"
                  alt="Only Founders"
                  height={200}
                  width={200}
                />
              </div>
            </div>

            <div className="px-4 pb-6 space-y-6">
              {steps.map((step) => (
                <div key={step.id} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {step.id}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">{step.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 pt-0">
              <Link
                onClick={() => {
                  onOpenChange(false);
                }}
                href="/create"
              >
                <Button
                  className="w-full border-0 rounded-none py-6 text-base"
                  size="lg"
                >
                  Got it
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
