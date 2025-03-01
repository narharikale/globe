import { ClueCard } from "@/components/organism/ClueCard";
import { OptionButton } from "@/components/organism/OptionButton";
import { ResultCard } from "@/components/organism/ResultCard";
import { ScoreDisplay } from "@/components/organism/ScoreDisplay";
import { ShareButton } from "@/components/organism/ShareButton";
import { motion } from "framer-motion";
import Image from "next/image";
import ClientWrapper from "@/components/ClientWrapper";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <ClientWrapper />
      </div>
    </div>
  );
}
