"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type QuizQuestion = {
  questionText: string;
  options: [string, string, string, string];
  correctAnswerIndex: number;
  timeLimit: number;
  points: number;
};

interface QuestionFormItemProps {
  qIndex: number;
  question: QuizQuestion;
  isOpen: boolean;
  setOpen: (index: number | null) => void;
  handleQuestionChange: (
    index: number,
    field: keyof QuizQuestion,
    value: any
  ) => void;
  handleOptionChange: (qIndex: number, oIndex: number, value: string) => void;
}

const QuestionFormItem = ({
  qIndex,
  question,
  isOpen,
  setOpen,
  handleQuestionChange,
  handleOptionChange,
}: QuestionFormItemProps) => {
  const isComplete =
    question.questionText.trim() !== "" &&
    question.options.every((opt) => opt.trim() !== "");

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(isOpen ? null : qIndex)}
        className="w-full flex justify-between items-center py-4 px-2 text-left"
      >
        <div className="flex items-center">
          <span
            className={`w-3 h-3 rounded-full mr-3 ${
              isComplete ? "bg-green-500" : "bg-gray-600"
            }`}
          ></span>
          <h3 className="text-lg md:text-xl font-semibold text-white">
            Question {qIndex + 1}
          </h3>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <FiChevronDown className="text-primary text-2xl" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <Input
                label="Question Text"
                value={question.questionText}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "questionText", e.target.value)
                }
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((opt, oIndex) => (
                  <Input
                    key={oIndex}
                    label={`Option ${String.fromCharCode(65 + oIndex)}`}
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(qIndex, oIndex, e.target.value)
                    }
                    required
                  />
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">
                    Correct Answer
                  </label>
                  <select
                    value={question.correctAnswerIndex}
                    onChange={(e) =>
                      handleQuestionChange(
                        qIndex,
                        "correctAnswerIndex",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full bg-surface border border-border rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value={0}>A</option>
                    <option value={1}>B</option>
                    <option value={2}>C</option>
                    <option value={3}>D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">
                    Points (Base Points)
                  </label>
                  <select
                    value={question.points}
                    onChange={(e) =>
                      handleQuestionChange(
                        qIndex,
                        "points",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full bg-surface border border-border rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value={50}>50</option>
                    <option value={75}>75</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">
                    Timer (seconds)
                  </label>
                  <select
                    value={question.timeLimit}
                    onChange={(e) =>
                      handleQuestionChange(
                        qIndex,
                        "timeLimit",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full bg-surface border border-border rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                {qIndex > 0 && (
                  <Button
                    type="button"
                    onClick={() => setOpen(qIndex - 1)}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    Previous
                  </Button>
                )}
                <div className="flex-grow"></div>
                {qIndex < 9 && (
                  <Button
                    type="button"
                    onClick={() => setOpen(qIndex + 1)}
                    className="bg-primary hover:bg-primary-hover"
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestionFormItem;
