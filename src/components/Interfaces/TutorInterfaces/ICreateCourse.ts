

export interface ICreateCourse1 {
    thumbnail: File | null | string;
    courseTitle: string;
    courseDescription: string;
    coursePrice: string;
    discountPrice: string;
    courseCategory: string;
    courseLevel: string;
    demoURL: string;
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
      video: File | null;  
      description: string;
      questions?:quesitons
    }>;
  }>;
  
}


interface quesitons { question: string; options:{answer:string; correction:boolean}[]}


 