

export interface ICreateCourse1 {
    tutorId?:string
    thumbnail: string;
    courseTitle: string;
    courseDescription: string;
    coursePrice: string;
    discountPrice: string;
    courseCategory: string;
    courseLevel: string;
    demoURL: string;
    courseId?:string;
    averageRating?:number
    ratingCount?:number
  }
  export interface ICreateCourse2 {
    prerequisites: string [];
    benefits: string []
  }
 
export interface CreateCourseState {
  Modules: Array<{
    name: string;
    description: string;
    lessons: Array<{
      title: string;
      video: File | null | string;  
      description: string;
      questions?:Question[]
    }>;
  }>;
  
}


// Types
type MultipleChoiceQuestion = {
  id: number;
  type: "QUIZ";
  question: string;
  options: string[];
  difficulty: string;
  correctAnswer: string;
};

type CodingQuestion = {
  id: number;
  type: "CODING";
  question: string;
  startingCode: string;
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

 