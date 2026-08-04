import type { Metadata } from "next";
import { BirthdayVideoMaker } from "@/components/BirthdayVideoMaker";

export const metadata: Metadata = {
  title: "Celebration Video Maker",
  description: "Create personalized Game Show Challenge Rooms celebration videos.",
  robots: { index: false, follow: false },
};

export default function BirthdayMakerPage() {
  return <BirthdayVideoMaker />;
}
