

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
      questions?:quesitons
    }>;
  }>;
  
}


interface quesitons { question: string; options:{answer:string; correction:boolean}[]}


 