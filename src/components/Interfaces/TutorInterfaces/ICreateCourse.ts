
export interface ICreateCourse1 {
    thumbnail: File | null;
    courseName: string;
    courseDescription: string;
    coursePrice: string;
    estimatedPrice: string;
    courseCategory: string;
    courseLevel: string;
    demoURL: string;
    benefits: Array<string>;
    prerequisites: Array<string>;
  }
  