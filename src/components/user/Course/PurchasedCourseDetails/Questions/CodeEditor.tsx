import React, { useState, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import { 
  PlayCircle, 
  LightbulbIcon, 
  Trophy, 
  Book, 
  Code2, 
  TestTube,
  Check,
  X,
  ChevronRight
} from 'lucide-react';

// Types remain the same as before
type CodingQuestion = {
  id: number;
  type: "CODING";
  question: string;
  startingCode: string;
  noOfParameters: number;
  parameters: { value: string; dataType: string }[];
  expectedOutput: TestOutput;
  testCases: TestCase[];
  score: number;
  hints: string[];
  solution: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
};

type TestCase = {
  parameters: { value: string; dataType: string }[];
  expectedValue: TestOutput;
};

type TestOutput = {
  value: string;
  dataType: string;
};

const DifficultyBadge = ({ difficulty }: { difficulty: 'Easy' | 'Medium' | 'Hard' }) => {
  const colors = {
    Easy: 'bg-emerald-100 text-emerald-800',
    Medium: 'bg-amber-100 text-amber-800',
    Hard: 'bg-rose-100 text-rose-800'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[difficulty]}`}>
      {difficulty}
    </span>
  );
};

const TabButton = ({ active, onClick, children }: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode 
}) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
      ${active 
        ? 'bg-blue-100 text-blue-800' 
        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}
    `}
  >
    {children}
  </button>
);

const Alert = ({ variant = 'info', title, children }: {
  variant?: 'success' | 'error' | 'info';
  title?: string;
  children: React.ReactNode;
}) => {
  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-rose-50 border-rose-200 text-rose-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <div className={`p-4 rounded-lg border ${styles[variant]}`}>
      {title && (
        <div className="font-medium mb-1 flex items-center gap-2">
          {variant === 'success' && <Check className="h-4 w-4" />}
          {variant === 'error' && <X className="h-4 w-4" />}
          {title}
        </div>
      )}
      <div className="text-sm">{children}</div>
    </div>
  );
};

const CodingQuestionInterface = ({ 
  question,
  startingCode,
  testCases,
  expectedOutput,
  parameters,
  score,
  hints,
  solution,
  difficulty
}: CodingQuestion) => {
  const [code, setCode] = useState(startingCode);
  const [output, setOutput] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [error, setError] = useState<string>('');
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [activeTab, setActiveTab] = useState('question');
  const [testResults, setTestResults] = useState<{ passed: boolean; input: string; expected: string; actual: string }[]>([]);
  const [editorInstance, setEditorInstance] = useState<any>(null);

  useEffect(() => {
    const container = document.getElementById('monaco-container');
    if (container) {
      const editor = monaco.editor.create(container, {
        value: startingCode,
        language: 'javascript',
        theme: 'vs-dark',
        minimap: { enabled: false },
        automaticLayout: true,
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line',
        tabSize: 2,
      });

      editor.onDidChangeModelContent(() => {
        setCode(editor.getValue());
      });

      setEditorInstance(editor);
      return () => editor.dispose();
    }
  }, []);

  const runCode = async () => {
    try {
      setError('');
      setOutput('');
      setTestResults([]);

      const results = testCases.map(test => {
        try {
          const userFunction = new Function(...parameters.map(p => p.value), code);
          const result = userFunction(...test.parameters.map(p => {
            switch(p.dataType.toLowerCase()) {
              case 'number': return Number(p.value);
              case 'boolean': return p.value === 'true';
              default: return p.value;
            }
          }));

          return {
            passed: result.toString() === test.expectedValue.value,
            input: test.parameters.map(p => p.value).join(', '),
            expected: test.expectedValue.value,
            actual: result.toString()
          };
        } catch (err:any) {
          return {
            passed: false,
            input: test.parameters.map(p => p.value).join(', '),
            expected: test.expectedValue.value,
            actual: 'Error: ' + err?.message
          };
        }
      });

      setTestResults(results);
      const allPassed = results.every(r => r.passed);
      setIsCorrect(allPassed);
      setOutput(allPassed ? 'All test cases passed!' : 'Some test cases failed');
    } catch (err:any) {
      setError(err?.message ||'Unidentified error.');
      setIsCorrect(false);
    }
  };

  return (
    <div className="max-w-6xl h-screen mx-auto p-4 bg-white overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Coding Challenge</h1>
          <div className="flex items-center gap-4">
            <DifficultyBadge difficulty={difficulty} />
            <div className="flex items-center gap-2 text-amber-600">
              <Trophy className="h-5 w-5" />
              <span className="font-medium">{score} points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto bg-gray-50 p-2 rounded-lg">
            <TabButton 
              active={activeTab === 'question'} 
              onClick={() => setActiveTab('question')}
            >
              <Book className="h-4 w-4" />
              Question
            </TabButton>
            <TabButton 
              active={activeTab === 'hints'} 
              onClick={() => setActiveTab('hints')}
            >
              <LightbulbIcon className="h-4 w-4" />
              Hints
            </TabButton>
            <TabButton 
              active={activeTab === 'solution'} 
              onClick={() => setActiveTab('solution')}
            >
              <Code2 className="h-4 w-4" />
              Solution
            </TabButton>
            <TabButton 
              active={activeTab === 'tests'} 
              onClick={() => setActiveTab('tests')}
            >
              <TestTube className="h-4 w-4" />
              Tests
            </TabButton>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg border p-6 min-h-[350px]">
            {activeTab === 'question' && (
              <div className="space-y-4">
                <div className="prose max-w-none" 
                  dangerouslySetInnerHTML={{ __html: question }} 
                />
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Parameters:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {parameters.map((param, index) => (
                      <div key={index} 
                        className="p-3 bg-gray-50 rounded-lg text-sm border">
                        <span className="font-mono text-blue-600">{param.value}</span>
                        <span className="text-gray-600">: {param.dataType}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hints' && (
              <div className="space-y-3">
                {hints.map((hint, index) => (
                  <Alert key={index} variant="info">
                    <div className="flex gap-2">
                      <LightbulbIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>{hint}</span>
                    </div>
                  </Alert>
                ))}
              </div>
            )}

            {activeTab === 'solution' && (
              <div>
                {showSolution ? (
                  <div className="space-y-4">
                    <pre className="p-4 bg-gray-50 rounded-lg overflow-x-auto">
                      <code>{solution}</code>
                    </pre>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSolution(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Show Solution
                  </button>
                )}
              </div>
            )}

            {activeTab === 'tests' && (
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <Alert
                    key={index}
                    variant={result.passed ? 'success' : 'error'}
                    title={`Test Case ${index + 1}`}
                  >
                    <div className="space-y-1">
                      <div>Input: {result.input}</div>
                      <div>Expected: {result.expected}</div>
                      <div>Actual: {result.actual}</div>
                    </div>
                  </Alert>
                ))}
              </div>
            )}
          </div>
          {(output || error) && (
                <Alert
                  variant={isCorrect ? 'success' : 'error'}
                  title={isCorrect ? 'Success!' : error ? 'Error' : 'Test Cases Failed'}
                >
                  {error || output}
                </Alert>
              )}
        </div>

        {/* Right Panel - Code Editor */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Code2 className="h-5 w-5 text-gray-600" />
                Code Editor
              </h2>
            </div>
            <div id="monaco-container" className="h-[400px]" />
            <div className="p-4 space-y-4">
              <button
                onClick={runCode}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <PlayCircle className="h-4 w-4" />
                Run Code
              </button>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingQuestionInterface;