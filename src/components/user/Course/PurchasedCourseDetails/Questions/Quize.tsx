import React, { useState } from 'react';
import { motion } from 'framer-motion';


interface QuizeData {
    question:string,
    options:string[],
    correctAnswer :number;
}
interface QuizChallengeProps {
    quizData: QuizeData | null;
  }

const QuizChallenge: React.FC<QuizChallengeProps> = ({ quizData }) => {
  const [selectedOption, setSelectedOption] = useState<number |null>(null);
  const [showResult, setShowResult] = useState(false);

  const uizData:QuizeData = {
    question: "What is the difference between 'let' and 'const'?",
    options: [
      "'let' is magical; 'const' is cursed",
      "'let' can change, 'const' cannot.",
      "No difference—they're twins!",
      "'const' throws tantrums if you change it."
    ],
    correctAnswer: 1
  };

  const handleOptionClick = (index:number) => {
    setSelectedOption(index);
    setShowResult(true);
  };

  const isCorrect = selectedOption === quizData?.correctAnswer;

  return quizData && (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Challenge</h2>
        
        <div 
          className="prose max-w-none mb-6"
          dangerouslySetInnerHTML={{ __html: quizData.question }}
        />

        <div className="space-y-3">
          {quizData.options.map((option, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <button
                onClick={() => handleOptionClick(index)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-lg transition-all duration-200 ${
                  showResult && index === quizData.correctAnswer
                    ? 'bg-green-100 border-2 border-green-500'
                    : showResult && index === selectedOption && index !== quizData.correctAnswer
                    ? 'bg-red-100 border-2 border-red-500'
                    : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
                } ${
                  selectedOption === index ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {option}
              </button>

              {showResult && index === selectedOption && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {isCorrect ? (
                    <span className="text-green-600 text-xl">✓</span>
                  ) : (
                    <span className="text-red-600 text-xl">✕</span>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-lg ${
              isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {isCorrect ? (
              <p className="font-medium">Correct! Well done! 🎉</p>
            ) : (
              <p className="font-medium">
                Incorrect. The correct answer is: {quizData.options[quizData.correctAnswer]}
              </p>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default QuizChallenge;