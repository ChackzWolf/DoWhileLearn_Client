import { useState } from "react";
import { Plus, Trash2, Code, ListChecks, Save, PlusCircle } from "lucide-react";
import { useFormikContext } from "formik";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";


// Types
type MultipleChoiceQuestion = {
  id: number;
  type: "QUIZ";
  question: string;
  options: string[];
  difficulty:string;
  correctAnswer: string;
};

type CodingQuestion = {
  id: number;
  type: "CODING";
  question: string;
  startingCode?: string;
  difficulty:string;
  solution:string;
  noOfParameters: number;
  parameters: { value: string; dataType: string }[];
  expectedOutput: TestOutput;
  testCases: TestCase[];
};

type TestCase = {
  parameters: { value: string; dataType: string }[];
  expectedValue: TestOutput;
};

type TestOutput = {
  value: string;
  dataType: string;
};

type Question = MultipleChoiceQuestion | CodingQuestion;

const QuizEditor: React.FC<{
  moduleIndex: number;
  lessonIndex: number;
  initialQuiz?: Question[] | undefined;
  onQuizChange: (
    moduleIndex: number,
    lessonIndex: number,
    quiz: any[],
    setFieldValue: (field: string, value: unknown) => void,
    validateForm: (values?: any) => Promise<{ [key: string]: string }>
  ) => void;
}> = ({ moduleIndex, lessonIndex, initialQuiz = [], onQuizChange }) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuiz);
  const [currentType, setCurrentType] = useState("QUIZ");
  const [noOfQuizes, setNumberOfQuizes] = useState(0);
  const [noOfCodes, setNoOfCodes] = useState(0)
  const formik = useFormikContext();
  const { setFieldValue,validateForm } = formik;

  const addQuestion = (e: React.MouseEvent, type: string) => {
    e.preventDefault();
    console.log(type, "type")
    if(type === 'QUIZ'){
      const count = noOfQuizes +1;
      setNumberOfQuizes(count);
    }else{
      const count = noOfCodes+1;
      setNoOfCodes(count);
    }
    const newQuestion: Question =
      type === "QUIZ"
        ? {
            id: Date.now(),
            type: "QUIZ",
            question: "",
            options: ["", ""],
            correctAnswer: "",
            difficulty:"Easy",
          }
        : {
            id: Date.now(),
            type: "CODING",
            question: "",
            startingCode: "",
            solution:"",
            difficulty:'Easy',
            noOfParameters: 1,
            parameters: [{ value: "", dataType: "string" }],
            expectedOutput: {
              value: "",
              dataType: "string",
            },
            testCases: [
              {
                parameters: [{ value: "", dataType: "string" }],
                expectedValue: {
                  value: "",
                  dataType: "string",
                },
              },
            ],
          };

    setQuestions([...questions, newQuestion]);
  };

  const deleteQuestion = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    setQuestions(questions.filter((q:any) => {
      q.id !== id
    console.log(q.type, 'to delete')
    if(q.type === 'QUIZ'){
      const count = noOfQuizes -1;
      setNumberOfQuizes(count)
    }else{
      const count = noOfCodes - 1;
      setNoOfCodes(count);
    }}));
  };

  const addOption = (e: React.MouseEvent, questionId: number) => {
    e.preventDefault();
    setQuestions(
      questions.map((q) =>
        q.id === questionId && q.type === "QUIZ"
          ? { ...q, options: [...q.options, ""] }
          : q
      )
    );
  };

  const updateQuestion = (id: number, field: string, value: any) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== id) return q;

        // If updating noOfParameters for a coding question
        if (q.type === "CODING" && field === "noOfParameters") {
          const numParams = Math.max(1, Math.min(4, Number(value)));
          const newParams = Array(numParams).fill({ value: "", dataType: "string" });
          
          return {
            ...q,
            noOfParameters: numParams,
            parameters: newParams,
            testCases: q.testCases.map(tc => ({
              ...tc,
              parameters: newParams.map(() => ({ value: "", dataType: "string" }))
            }))
          };
        }

        return { ...q, [field]: value };
      })
    );
  };

  const updateOption = (
    questionId: number,
    optionIndex: number,
    value: string
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId && q.type === "QUIZ"
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  const updateParameter = (
    questionId: number,
    paramIndex: number,
    field: string,
    value: string
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId || q.type !== "CODING") return q;
        return {
          ...q,
          parameters: q.parameters.map((param, idx) =>
            idx === paramIndex ? { ...param, [field]: value } : param
          ),
        };
      })
    );
  };

  const updateTestCase = (
    questionId: number,
    testCaseIndex: number,
    paramIndex: number,
    field: string,
    value: string,
    isExpected: boolean = false
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId || q.type !== "CODING") return q;
        return {
          ...q,
          testCases: q.testCases.map((tc, tcIdx) => {
            if (tcIdx !== testCaseIndex) return tc;
            if (isExpected) {
              return {
                ...tc,
                expectedValue: {
                  ...tc.expectedValue,
                  [field]: value,
                },
              };
            }
            return {
              ...tc,
              parameters: tc.parameters.map((param, pIdx) =>
                pIdx === paramIndex ? { ...param, [field]: value } : param
              ),
            };
          }),
        };
      })
    );
  };

  const addTestCase = (e: React.MouseEvent, questionId: number) => {
    e.preventDefault();
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId || q.type !== "CODING") return q;
        const newTestCase = {
          parameters: Array(q.noOfParameters).fill({ value: "", dataType: "string" }),
          expectedValue: { value: "", dataType: "string" },
        };
        return {
          ...q,
          testCases: [...q.testCases, newTestCase],
        };
      })
    );
  };

  const handleSaveQuiz = (e: React.MouseEvent) => {
    e.preventDefault();
    onQuizChange(moduleIndex, lessonIndex, questions, setFieldValue, validateForm);
    
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-purple-100">
          <h1 className="text-2xl font-bold text-purple-800 mb-6">
            Create Quiz & Coding Exercises
          </h1>

          <div className="flex gap-4 mb-8">
            <button
              type="button"
              onClick={() => setCurrentType("QUIZ")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                currentType === "QUIZ"
                  ? "bg-purple-600 text-white"
                  : "bg-purple-100 text-purple-600"
              }`}
            >
              <ListChecks size={20} />
              Multiple Choice
            </button>
            <button
              type="button"
              onClick={() => setCurrentType("CODING")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                currentType === "CODING"
                  ? "bg-purple-600 text-white"
                  : "bg-purple-100 text-purple-600"
              }`}
            >
              <Code size={20} />
              Coding Challenge
            </button>
            <div>
                <h1 className="text-xs text-purple-400">Number of Quizes: {noOfQuizes}</h1>
                <h1 className="text-xs text-purple-400">Number of Coding Challenges: {noOfCodes}</h1>
            </div>
          </div>



          <button
            type="button"
            onClick={(e) => addQuestion(e, currentType)}
            className="w-full bg-purple-100 hover:bg-purple-200 text-purple-600 font-medium p-4 rounded-lg mb-8 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add {currentType === "QUIZ" ? "Multiple Choice Question" : "Coding Challenge"}
          </button>

          <div className="space-y-8">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className="bg-white border border-purple-200 rounded-lg p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-purple-800">
                    Question {index + 1} ({q.type})
                  </h3>
                  <button
                    type="button"
                    onClick={(e) => deleteQuestion(e, q.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="mb-4">
                    <ReactQuill
                      value={q.question}
                      onChange={(e) =>
                        updateQuestion(q.id, "question", e)
                      }
                      placeholder="Enter your question here..."
                      theme="snow"
                    />
                </div>

                {/* <textarea
                  value={q.question}
                  onChange={(e) =>
                    updateQuestion(q.id, "question", e.target.value)
                  }
                  placeholder="Enter your question here..."
                  className="w-full p-3 border border-purple-200 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                /> */}
{/* 
                      <div className="flex flex-col space-y-2 my-10">
                        <label className="block text-sm font-medium text-purple-700 m-2">
                          Difficulty Level
                        </label>
                              <select
                                value={(q as CodingQuestion).difficulty||"Easy"}
                                onChange={(e) =>
                                  updateQuestion(q.id, "difficulty", e.target.value)
                                }
                                className=" p-3 border border-purple-200 rounded-lg font-mono text-sm"
                              >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                 
                              </select>
                      </div> */}

                {q.type === "QUIZ" ? (
                  <div className="space-y-4">
                    {q.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center gap-4"
                      >
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={q.correctAnswer === optionIndex.toString()}
                          onChange={() =>
                            updateQuestion(q.id, "correctAnswer", optionIndex.toString())
                          }
                          className="w-4 h-4 text-purple-600"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            updateOption(q.id, optionIndex, e.target.value)
                          }
                          placeholder={`Option ${optionIndex + 1}`}
                          className="flex-1 p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={(e) => addOption(e, q.id)}
                      className="text-purple-600 hover:text-purple-800 flex items-center gap-2"
                    >
                      <PlusCircle size={20} />
                      Add Option
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-700 mb-2">
                        Starting Code
                      </label>
                      <textarea
                        value={q.startingCode}
                        onChange={(e) =>
                          updateQuestion(q.id, "startingCode", e.target.value)
                        }
                        placeholder="Provide starting code (optional)..."
                        className="w-full p-3 border border-purple-200 rounded-lg font-mono text-sm"
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-purple-700 mb-2">
                        Solution Code
                      </label>
                      <textarea
                        value={q.solution}
                        onChange={(e) =>
                          updateQuestion(q.id, "solution", e.target.value)
                        }
                        placeholder="Provide starting code (optional)..."
                        className="w-full p-3 border border-purple-200 rounded-lg font-mono text-sm"
                        rows={4}
                      />
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="flex gap-4">

                      
                      <div className="flex flex-col space-y-2">
                        <label className="block text-sm font-medium text-purple-700 mb-2">
                          Number of Parameters
                        </label>
                        <input
                          type="number"
                          value={(q as CodingQuestion).noOfParameters}
                          onChange={(e) =>
                            updateQuestion(q.id, "noOfParameters", e.target.value)
                          }
                          min="1"
                          max="4"
                          className="w-full p-3 border border-purple-200 rounded-lg font-mono text-sm"
                        />
                      </div>

                      <div className="flex flex-col space-y-2">
                      <label className="block text-sm font-medium text-purple-700 mb-2">
                          Difficulty Level
                        </label>
                      <select
                                value={(q as CodingQuestion).difficulty||"Easy"}
                                onChange={(e) =>
                                  updateQuestion(q.id, "difficulty", e.target.value)
                                }
                                className="w-full p-3 border border-purple-200 rounded-lg font-mono text-sm"
                              >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                 
                              </select>
                      </div>
                      </div>
                      <div className="flex gap-6">
                        <div className="w-full">
                          <label className="block text-sm font-medium text-purple-700 mb-2">
                            Input Parameters
                          </label>
                          {Array.from({ length: (q as CodingQuestion).noOfParameters }).map((_, paramIndex) => (
                            <div key={paramIndex} className="flex items-center gap-4 mb-3">
                              <input
                                value={(q as CodingQuestion).parameters[paramIndex]?.value || ""}
                                onChange={(e) =>
                                  updateParameter(q.id, paramIndex, "value", e.target.value)
                                }
                                placeholder={`Parameter ${paramIndex + 1} Value`}
                                className="w-full p-3 border border-purple-200 rounded-lg font-mono text-sm"
                              />
                              <select
                                value={(q as CodingQuestion).parameters[paramIndex]?.dataType || "string"}
                                onChange={(e) =>
                                  updateParameter(q.id, paramIndex, "dataType", e.target.value)
                                }
                                className="p-3 border border-purple-200 rounded-lg"
                              >
                                <option value="string">String</option>
                                <option value="number">Number</option>
                                <option value="boolean">Boolean</option>
                                <option value="object">Object</option>
                                <option value="object">Number[]</option>
                              <option value="object">string[]</option>
                              <option value="boolean">Boolean[]</option>
                                <option value="array">Array</option>
                              </select>
                            </div>
                          ))}
                        </div>

                        <div className="w-full">
                          <label className="block text-sm font-medium text-purple-700 mb-2">
                            Expected Output
                          </label>
                          <div className="flex items-center gap-4">
                            <input
                              value={(q as CodingQuestion).expectedOutput.value}
                              onChange={(e) =>
                                updateQuestion(q.id, "expectedOutput", {
                                  ...q.expectedOutput,
                                  value: e.target.value,
                                })
                              }
                              placeholder="Enter expected output..."
                              className="w-full p-3 border border-purple-200 rounded-lg font-mono text-sm"
                            />
                            <select
                              value={(q as CodingQuestion).expectedOutput.dataType}
                              onChange={(e) =>
                                updateQuestion(q.id, "expectedOutput", {
                                  ...q.expectedOutput,
                                  dataType: e.target.value,
                                })
                              }
                              className="p-3 border border-purple-200 rounded-lg"
                            >
                              <option value="string">String</option>
                              <option value="number">Number</option>
                              <option value="boolean">Boolean</option>
                              <option value="object">Object</option>
                              <option value="object">Number[]</option>
                              <option value="object">string[]</option>
                              <option value="boolean">Boolean[]</option>
                              <option value="array">Array</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-purple-700 mb-2">
                        Test Cases
                      </label>
                      {(q as CodingQuestion).testCases.map((testCase, testIndex) => (
                        <div key={testIndex} className="mb-6 p-4 border border-purple-200 rounded-lg">
                          <label className="block text-sm font-medium text-purple-700 mb-2">
                            Test Case {testIndex + 1}
                          </label>
                          
                          {Array.from({ length: (q as CodingQuestion).noOfParameters }).map((_, paramIndex) => (
                            <div key={paramIndex} className="flex gap-4 mb-2">
                              <input
                                type="text"
                                value={testCase.parameters[paramIndex]?.value || ""}
                                onChange={(e) =>
                                  updateTestCase(
                                    q.id,
                                    testIndex,
                                    paramIndex,
                                    "value",
                                    e.target.value
                                  )
                                }
                                placeholder={`Parameter ${paramIndex + 1} Value`}
                                className="w-full p-2 border border-purple-200 rounded-lg font-mono text-sm"
                              />
                              <select
                                value={testCase.parameters[paramIndex]?.dataType || "string"}
                                onChange={(e) =>
                                  updateTestCase(
                                    q.id,
                                    testIndex,
                                    paramIndex,
                                    "dataType",
                                    e.target.value
                                  )
                                }
                                className="p-2 border border-purple-200 rounded-lg"
                              >
                                <option value="string">String</option>
                                <option value="number">Number</option>
                                <option value="boolean">Boolean</option>
                                <option value="object">Object</option>
                                <option value="object">Number[]</option>
                                <option value="object">string[]</option>
                                <option value="boolean">Boolean[]</option>
                                <option value="array">Array</option>
                              </select>
                            </div>
                          ))}

                          <div className="flex gap-4 mb-2">
                            <input
                              type="text"
                              value={testCase.expectedValue?.value || ""}
                              onChange={(e) =>
                                updateTestCase(
                                  q.id,
                                  testIndex,
                                  0,
                                  "value",
                                  e.target.value,
                                  true
                                )
                              }
                              placeholder="Expected Value"
                              className="w-full p-2 border border-purple-200 rounded-lg font-mono text-sm"
                            />
                            <select
                              value={testCase.expectedValue?.dataType || "string"}
                              onChange={(e) =>
                                updateTestCase(
                                  q.id,
                                  testIndex,
                                  0,
                                  "dataType",
                                  e.target.value,
                                  true
                                )
                              }
                              className="p-2 border border-purple-200 rounded-lg"
                            >
                              <option value="string">String</option>
                              <option value="number">Number</option>
                              <option value="boolean">Boolean</option>
                              <option value="object">Object</option>
                              <option value="object">Number[]</option>
                              <option value="object">string[]</option>
                              <option value="boolean">Boolean[]</option>
                              <option value="array">Array</option>
                            </select>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={(e) => addTestCase(e, q.id)}
                        className="text-purple-600 hover:text-purple-800 flex items-center gap-2"
                      >
                        <PlusCircle size={20} />
                        Add Test Case
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {questions.length > 0 && (
            <button
              type="button"
              className="mt-8 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2"
              onClick={handleSaveQuiz}
            >
              <Save size={20} />
              Save Questions
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizEditor;