import { ChevronUp } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function PopularQA() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I purchase a course?",
      answer: "Simply browse our course catalog, select the course you're interested in, and click the 'Purchase' button. You can pay using various payment methods including credit/debit cards and PayPal."
    },
    {
      question: "Do I get lifetime access to purchased courses?",
      answer: "Yes! Once you purchase a course, you'll have unlimited lifetime access to all course materials, including future updates."
    },
    {
      question: "How do the course communities work?",
      answer: "Each course has its own dedicated community where you can interact with fellow learners and instructors. You can ask questions, share your progress, and participate in discussions related to the course content."
    },
    {
      question: "Are the quizzes mandatory?",
      answer: "While quizzes are not mandatory, they are recommended to help reinforce your learning and ensure you've understood the course material properly."
    },
    {
      question: "Can I download the video content?",
      answer: "Course videos are available for online streaming. While downloads aren't available, you can access the content anytime with an internet connection."
    }
  ];
  return (
    <div>
      {/* FAQ Section with accordion */}
      <div className="py-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-5 md:mb-16 text-accent">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq: any, index: number) => (


              <motion.div
              
              key={faq.index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              
                className="border border-accent rounded-lg overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between bg-accent hover:bg-purple-50 transition-colors duration-300"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <span className="font-semibold text-gray-900 ">{faq.question}</span>
                  {activeFaq === index ? (
                    <ChevronUp className="transition-all duration-150 w-5 h-5 text-primary" />
                  ) : (
                    <ChevronUp className="transition-all duration-150 w-5 h-5 text-primary  rotate-180" />
                  )}
                </button>
                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ${activeFaq === index ? 'max-h-48 py-4' : 'max-h-0'
                    }`}
                >
                  <p className="text-accent">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}