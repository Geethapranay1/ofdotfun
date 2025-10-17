"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SocialLinks {
  twitter: string;
  telegram: string;
  website: string;
}

interface SocialLinksInputProps {
  value: SocialLinks;
  onChange: (value: SocialLinks) => void;
}

export function SocialLinksInput({ value, onChange }: SocialLinksInputProps) {
  const handleChange = (field: keyof SocialLinks, newValue: string) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="grid grid-cols-3 divide-x">
      <div>
        <Input
          id="twitter"
          type="url"
          placeholder="https://twitter.com/yourtoken"
          value={value.twitter}
          onChange={(e) => handleChange("twitter", e.target.value)}
        />
      </div>
      <div>
        <Input
          id="telegram"
          type="url"
          placeholder="https://t.me/yourtoken"
          value={value.telegram}
          onChange={(e) => handleChange("telegram", e.target.value)}
        />
      </div>
      <div>
        <Input
          id="website"
          type="url"
          placeholder="https://yourtoken.com"
          value={value.website}
          onChange={(e) => handleChange("website", e.target.value)}
        />
      </div>
    </div>
  );
}
