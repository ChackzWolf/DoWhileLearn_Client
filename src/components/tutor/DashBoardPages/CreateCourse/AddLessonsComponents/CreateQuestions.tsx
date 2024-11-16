import { useState } from "react";
import { Plus, Trash2, Code, ListChecks, Save, PlusCircle } from "lucide-react";
import { useFormikContext } from "formik";
import { MdOutput } from "react-icons/md";

// Types remain the same...
type MultipleChoiceQuestion = {
  id: number;
  type: "QUIZ";
  question: string;
  options: string[];
  correctAnswer: string;
};

type CodingQuestion = {
  id: number;
  type: "CODING";
  question: string;
  startingCode: string;
  expectedOutput: TestOutput; // Updated to use a structured type for expected output
  testCases: TestCase[]; // Array of test cases
};

type TestCase = {
  input: Input; // Structured input for test cases
  output: TestOutput; // Structured output for test cases
};

type Input = {
  parameters: { value: string; dataType: string }[]; // Array of parameter objects
};

type TestOutput = {
  value: string; // Expected output value
  dataType: string; // Data type of the expected output
};

type Question = MultipleChoiceQuestion | CodingQuestion;

const QuizEditor: React.FC<{
  moduleIndex: number;
  lessonIndex: number;
  initialQuiz?: any[];
  onQuizChange: (
    moduleIndex: number,
    lessonIndex: number,
    quiz: any[],
    setFieldValue: (field: string, value: unknown) => void
  ) => void;
}> = ({ moduleIndex, lessonIndex, initialQuiz = [], onQuizChange }) => {
  const [questions, setQuestions] = useState<any[]>(initialQuiz);
  const [currentType, setCurrentType] = useState("QUIZ");
  const [noOfParameters, setNoOfParemeters] = useState(1);
  const formik = useFormikContext();
  const { setFieldValue } = formik;

  // Prevent default for all button handlers
  const addQuestion = (e: React.MouseEvent, type: string) => {
    const newQuestion: Question =
      type === "QUIZ"
        ? {
            id: Date.now(),
            type: "QUIZ",
            question: "",
            options: ["", ""],
            correctAnswer: "",
          }
        : {
            id: Date.now(),
            type: "CODING",
            question: "",
            startingCode: "",
            expectedOutput: {
              value: "",
              dataType: "",
            },
            testCases: [
              {
                input: {
                  parameters: [{ value: "", dataType: "" }],
                },
                output: {
                  value: "",
                  dataType: "",
                },
              },
            ],
          };
  
    setQuestions([...questions, newQuestion]);
  };

  const deleteQuestion = (e: React.MouseEvent, id: any) => {
    // e.preventDefault();
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const addOption = (e: React.MouseEvent, questionId: any) => {
    // e.preventDefault();
    setQuestions(
      questions.map((q) =>
        q.id === questionId && q.type === "QUIZE"
          ? { ...q, options: [...q.options, ""] }
          : q
      )
    );
  };

  const updateQuestionParameter = (
    questionId: number,
    paramIndex: number,
    field: string,
    value: any
  ) => {
    setQuestions(
      questions.map((quest) =>
        quest.id === questionId
          ? {
              ...quest,
              parameters: quest.parameters.map((param:any, index:any) =>
                index === paramIndex
                  ? { ...param, [field]: value }
                  : param
              ),
            }
          : quest
      )
    );
  };


  const addTestCase = (e: React.MouseEvent, questionId: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId && q.type === "CODING"
          ? {
              ...q,
              testCases: [
                ...q.testCases,
                {
                  input: { parameters: [], dataTypes: [] }, // Add empty input structure
                  output: [], // Initialize with an empty output
                },
              ],
            }
          : q
      )
    );
  };

  const handleSaveQuiz = (e: React.MouseEvent) => {
    // e.preventDefault();
    onQuizChange(moduleIndex, lessonIndex, questions, setFieldValue);
  };

  // Other helper functions remain the same...
  const updateQuestion = (id: any, field: any, value: any) => {
    console.log(id, field, value, " updateQuestion");
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
    console.log(questions, "questions");
  };

  const updateOption = (
    questionId: number,
    optionIndex: number,
    value: string
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId && q.type === "QUIZE"
          ? {
              ...q,
              options: q.options.map((opt: any, idx: any) =>
                idx === optionIndex ? value : opt
              ),
            }
          : q
      )
    );
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
              type="button" // Added type="button"
              onClick={(e) => {
                // e.preventDefault();
                setCurrentType("QUIZ");
              }}
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
              type="button" // Added type="button"
              onClick={(e) => {
                // e.preventDefault();
                setCurrentType("CODING");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                currentType === "CODING"
                  ? "bg-purple-600 text-white"
                  : "bg-purple-100 text-purple-600"
              }`}
            >
              <Code size={20} />
              Coding Challenge
            </button>
          </div>

          <button
            type="button" // Added type="button"
            onClick={(e) => addQuestion(e, currentType)}
            className="w-full bg-purple-100 hover:bg-purple-200 text-purple-600 font-medium p-4 rounded-lg mb-8 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add{" "}
            {currentType === "QUIZ"
              ? "Multiple Choice Question"
              : "Coding Challenge"}
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
                    type="button" // Added type="button"
                    onClick={(e) => deleteQuestion(e, q.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <textarea
                  value={q.question}
                  onChange={(e) =>
                    updateQuestion(q.id, "question", e.target.value)
                  }
                  placeholder="Enter your question here..."
                  className="w-full p-3 border border-purple-200 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />

                {q.type === "QUIZ" ? (
                  <div className="space-y-4">
                    {q.options.map((option: any, optionIndex: any) => (
                      <div
                        key={optionIndex}
                        className="flex items-center gap-4"
                      >
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={q.correctAnswer === optionIndex}
                          onChange={() =>
                            updateQuestion(q.id, "correctAnswer", optionIndex)
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
                      type="button" // Added type="button"
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
                  <div className="flex flex-col gap-6">



  <div className="flex gap-6">
  {/* Input Parameters Section */}
  <div className="w-full">
    <label className="block text-sm font-medium text-purple-700 mb-2">
      Input Parameters
    </label>









    
    {Array.from({ length: noOfParameters }).map((_, paramIndex) => (
      <div key={paramIndex} className="flex items-center gap-4 mb-3">
        {/* Input for parameter value */}
        <input
          value={
            q.parameters?.[paramIndex]?.value || ""
          }
          onChange={(e) =>
            updateQuestionParameter(q.id, paramIndex, "value", e.target.value)
          }
          placeholder={`Enter parameter ${paramIndex + 1} value...`}
          className="w-full p-3 border border-purple-200 rounded-lg font-mono text-sm"
        />
        
        {/* Dropdown for parameter data type */}
        <select
          value={
            q.parameters?.[paramIndex]?.dataType || "string"
          }
          onChange={(e) =>
            updateQuestionParameter(q.id, paramIndex, "dataType", e.target.value)
          }
          className="p-3 border border-purple-200 rounded-lg"
        >
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
          <option value="object">Object</option>
          <option value="array">Array</option>
        </select>
      </div>
    ))}
  </div>

  {/* Expected Output Section */}
  <div className="w-full">
    <label className="block text-sm font-medium text-purple-700 mb-2">
      Expected Output
    </label>
    <div className="flex items-center gap-4">
      {/* Input for expected output */}
      <input
        value={q.expectedOutput?.value || ""}
        onChange={(e) =>
          updateQuestion(q.id, "expectedOutput", {
            ...q.expectedOutput,
            value: e.target.value,
          })
        }
        placeholder="Enter expected output..."
        className="w-full p-3 border border-purple-200 rounded-lg font-mono text-sm"
      />

      {/* Dropdown for expected output data type */}
      <select
        value={q.expectedOutput?.dataType || "string"}
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
        <option value="array">Array</option>
      </select>
    </div>
  </div>
  </div>
</div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">
                      Test Cases
                    </label>
                    {
  q.testCases.map((testCase: any, testIndex: number) => {
    // Ensure the parameters array matches noOfParameters
    const parameters = Array.from({ length: noOfParameters }, (_, paramIndex) => 
      testCase.parameters?.[paramIndex] || { value: "", dataType: "string" }
    );

    return (
      <div key={testIndex}>
        <label className="block text-sm font-medium text-purple-700 mb-2">
          Test Case {testIndex + 1}
        </label>
        
        {/* Render input fields for each parameter */}
        {parameters.map((param, paramIndex) => (
          <div key={paramIndex} className="flex gap-4 mb-2">
            {/* Input for parameter value */}
            <input
              type="text"
              value={param.value}
              onChange={(e) =>
                setQuestions(
                  questions.map((quest) =>
                    quest.id === q.id && quest.type === "CODING"
                      ? {
                          ...quest,
                          testCases: quest.testCases.map((tc: any, idx: number) =>
                            idx === testIndex
                              ? {
                                  ...tc,
                                  parameters: parameters.map((p, pIdx) =>
                                    pIdx === paramIndex
                                      ? { ...p, value: e.target.value }
                                      : p
                                  ),
                                }
                              : tc
                          ),
                        }
                      : quest
                  )
                )
              }
              placeholder={`Parameter ${paramIndex + 1} Value`}
              className="w-full p-2 border border-purple-200 rounded-lg font-mono text-sm"
            />

            {/* Dropdown for parameter data type */}
            <select
              value={param.dataType}
              onChange={(e) =>
                setQuestions(
                  questions.map((quest) =>
                    quest.id === q.id && quest.type === "CODING"
                      ? {
                          ...quest,
                          testCases: quest.testCases.map((tc: any, idx: number) =>
                            idx === testIndex
                              ? {
                                  ...tc,
                                  parameters: parameters.map((p, pIdx) =>
                                    pIdx === paramIndex
                                      ? { ...p, dataType: e.target.value }
                                      : p
                                  ),
                                }
                              : tc
                          ),
                        }
                      : quest
                  )
                )
              }
              className="p-2 border border-purple-200 rounded-lg"
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="object">Object</option>
              <option value="array">Array</option>
            </select>
          </div>
        ))}

        {/* Input for expected value */}
        <div className="flex gap-4 mb-2">
          <input
            type="text"
            value={testCase.expectedValue?.value || ""}
            onChange={(e) =>
              setQuestions(
                questions.map((quest) =>
                  quest.id === q.id && quest.type === "CODING"
                    ? {
                        ...quest,
                        testCases: quest.testCases.map((tc: any, idx: number) =>
                          idx === testIndex
                            ? {
                                ...tc,
                                expectedValue: {
                                  ...tc.expectedValue,
                                  value: e.target.value,
                                },
                              }
                            : tc
                        ),
                      }
                    : quest
                )
              )
            }
            placeholder="Expected Value"
            className="w-full p-2 border border-purple-200 rounded-lg font-mono text-sm"
          />

          {/* Dropdown for expected value data type */}
          <select
            value={testCase.expectedValue?.dataType || "string"}
            onChange={(e) =>
              setQuestions(
                questions.map((quest) =>
                  quest.id === q.id && quest.type === "CODING"
                    ? {
                        ...quest,
                        testCases: quest.testCases.map((tc: any, idx: number) =>
                          idx === testIndex
                            ? {
                                ...tc,
                                expectedValue: {
                                  ...tc.expectedValue,
                                  dataType: e.target.value,
                                },
                              }
                            : tc
                        ),
                      }
                    : quest
                )
              )
            }
            className="p-2 border border-purple-200 rounded-lg"
          >
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="object">Object</option>
            <option value="array">Array</option>
          </select>
        </div>
        <button
          type="button"
          onClick={(e) => addTestCase(e, q.id)}
          className="text-purple-600 hover:text-purple-800 flex items-center gap-2"
        >
          Add Test Case
        </button>
      </div>
    );
  })}
                  </div>
                )}
              </div>
            ))}
          </div>
   
          {questions.length > 0 && (
            <button
              type="button" // Added type="button"
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
