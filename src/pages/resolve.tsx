import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Lightbulb, Recycle, BookOpen } from "lucide-react";
import fiveRsImage from "@/assets/5Rs.jpg"; // ✅ Make sure this path is correct

// ---------- Data ----------
const tips = [
  "♻ Reuse glass jars as storage containers instead of buying plastic ones.",
  "♻ Turn old T-shirts into cleaning cloths instead of throwing them away.",
  "♻ Carry a reusable water bottle to reduce single-use plastic.",
  "♻ Use both sides of paper before recycling it.",
  "♻ Compost food scraps instead of mixing them with recyclables.",
  "♻ Donate old electronics (phones, laptops) to refurbishing centers.",
  "♻ Separate e-waste like batteries and chargers — never toss them in normal bins.",
  "♻ Avoid black plastic containers (many recycling plants can’t process them).",
  "♻ Buy recycled products (like notebooks, pens, bags) to close the recycling loop.",
  "♻ Keep recyclables dry — moisture makes paper and cardboard non-recyclable.",
];

const facts = [
  "🇮🇳 India generates 3.4M tonnes of plastic waste annually, only ~30% recycled.",
  "📄 Paper recycling rate in India is ~27%, lower than global avg (59%).",
  "🔌 90% of e-waste in India is handled by the informal sector.",
  "🍾 Glass recycling is high in India (~45–50%) due to reuse of bottles.",
  "🏡 75% of households follow source segregation regularly.",
  "🥤 PET bottles have ~70–80% recycling rate thanks to informal collection.",
];

const myths = [
  { myth: "All plastics are recyclable.", fact: "Only PET (♳) & HDPE (♴) are widely recycled." },
  { myth: "If an item has the recycling symbol, it will be recycled.", fact: "Depends on local recycling facilities." },
  { myth: "You don’t need to clean containers before recycling.", fact: "Food residue contaminates whole batches." },
  { myth: "Glass can be recycled endlessly.", fact: "Broken/colored glass reduces quality and is often discarded." },
  { myth: "E-waste in regular bins is fine.", fact: "E-waste contains toxic heavy metals — needs special centers." },
  { myth: "Recycling alone solves waste problems.", fact: "Reduce & Reuse are even more important." },
];

const categories = [
  {
    title: "✅ General Recycling",
    dos: ["Rinse bottles, jars, and containers before recycling.","Flatten cardboard boxes to save space.","Separate paper, plastic, metal, glass, and e-waste.","Remove caps, lids, and straws from bottles.","Use recycling bins with clear labels.","Reuse bags, jars, and boxes whenever possible.","Check local recycling rules (they vary by city)."],
    donts: ["Don’t recycle greasy pizza boxes or food-stained paper.","Don’t mix food waste with recyclables.","Don’t recycle broken glass (handle as general waste).","Don’t put e-waste in normal bins.","Don’t bag recyclables in plastic bags.","Don’t recycle items with leftover chemicals.","Don’t assume all plastics are recyclable."],
  },
  {
    title: "📰 Paper & Cardboard",
    dos: ["Recycle newspapers, magazines, office paper, and books.","Flatten cardboard boxes before binning.","Keep paper products dry and clean."],
    donts: ["Don’t recycle food-stained paper.","Don’t recycle laminated or wax-coated paper.","Don’t shred paper too small."],
  },
  {
    title: "🧴 Plastic",
    dos: ["Recycle PET (♳) and HDPE (♴) containers.","Rinse plastic containers.","Remove caps, lids, straws before recycling."],
    donts: ["Don’t recycle thin bags, wrappers, cling film.","Don’t recycle toys, hangers, or PVC pipes.","Don’t burn plastics (toxic fumes)."],
  },
  {
    title: "🍾 Glass",
    dos: ["Recycle bottles, jars, and glass containers.","Rinse thoroughly.","Separate by color if required."],
    donts: ["Don’t recycle broken glass or ceramics.","Don’t recycle mirrors, bulbs, or window panes.","Don’t leave caps or corks attached."],
  },
  {
    title: "🥫 Metal",
    dos: ["Recycle aluminum & tin cans.","Rinse cans before recycling."],
    donts: ["Don’t recycle paint/chemical tins or gas cylinders.","Don’t recycle rusted items.","Don’t mix e-waste metals with cans."],
  },
  {
    title: "💻 E-Waste",
    dos: ["Recycle old phones, chargers, batteries at authorized centers.","Remove personal data before disposal.","Store safely, separate from wet waste."],
    donts: ["Don’t throw e-waste in household bins.","Don’t burn or break batteries.","Don’t store e-waste too long (risk of leaks/fire)."],
  },
];

// ---------- Component ----------
const Resolve = () => {
  const [tip, setTip] = useState("");
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    setTip(tips[Math.floor(Math.random() * tips.length)]);
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % facts.length);
    }, 4000); // auto-slide every 4s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 space-y-12 bg-gradient-to-b from-green-50 to-white">
      {/* Heading */}
      <motion.h1
        className="text-4xl font-extrabold text-green-800 text-center drop-shadow-md"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        whileHover={{ scale: 1.05, textShadow: "0px 0px 8px #34d399" }}
      >
        🌍 Resolve & Recycle
      </motion.h1>

      <motion.p
        className="text-green-700 font-semibold text-center max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Learn eco-friendly practices, follow the 5 R’s, and discover how to recycle different materials.
      </motion.p>

      {/* 5R's Image */}
      <motion.img
        src={fiveRsImage}
        alt="5Rs of Recycling"
        className="mx-auto max-w-md rounded-xl shadow-lg border border-green-300"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, -10, 0],
        }}
        transition={{
          opacity: { duration: 0.6 },
          scale: { duration: 0.6 },
          y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
        }}
        whileHover={{ scale: 1.08, rotate: 1 }}
      />

      {/* Category Accordion */}
      <Accordion type="single" collapsible className="w-full">
        {categories.map((cat, idx) => (
          <AccordionItem key={idx} value={`cat-${idx}`}>
            <AccordionTrigger className="text-xl font-bold text-green-700">
              {cat.title}
            </AccordionTrigger>
            <AccordionContent>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-green-300 shadow hover:shadow-xl transition-all">
                  <CardHeader>
                    <CardTitle className="text-green-600 font-bold">Do’s ✅</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 font-medium">
                      {cat.dos.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-red-300 shadow hover:shadow-xl transition-all">
                  <CardHeader>
                    <CardTitle className="text-red-600 font-bold">Don’ts ❌</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 font-medium">
                      {cat.donts.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Tip of the Day */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.6, type: "spring" }}
        whileHover={{ scale: 1.05 }}
      >
        <Card className="bg-green-50 border-green-400 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 font-bold">
              <Lightbulb /> Recycling Tip of the Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.p
              key={tip}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-gray-700 font-medium"
            >
              {tip}
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Did You Know Facts */}
      <Card className="bg-blue-50 border-blue-400 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 font-bold">
            <BookOpen /> Did You Know?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.p
            key={factIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gray-700 font-medium text-center"
          >
            {facts[factIndex]}
          </motion.p>
        </CardContent>
      </Card>

      {/* Myth vs Fact */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        }}
      >
        <Card className="bg-yellow-50 border-yellow-400 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700 font-bold">
              <Recycle /> Recycling Myths vs Facts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {myths.map((m, i) => (
              <motion.div
                key={i}
                className="p-4 border rounded-lg shadow-sm bg-white"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.03, boxShadow: "0px 4px 12px rgba(0,0,0,0.1)" }}
              >
                <p className="text-red-600 font-semibold">Myth: {m.myth}</p>
                <p className="text-green-700 font-bold">Fact: {m.fact}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Resolve;
