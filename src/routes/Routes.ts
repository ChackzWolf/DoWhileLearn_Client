export const ROUTES = {
    common: {
        landingPage: '/',
        AuthChoice:  '/AuthChoice',
        Courses:     '/courses',
        courseDetails : (id:string)=> `/course/${id}`,
    },
    user: {
        signin:                   '/user/auth/login',
        signup:                   '/user/auth/register',
        signupOTP:                '/user/auth/register/otp',
        forgotPasswordEmailEntry: '/user/auth/forgot-password',
        forgotPasswordReset:      '/user/auth/forgot-password/reset',
        forgotPasswordOTP:        '/user/auth/forgot-password/otp',

        profile:  '/user/profile',
        wishlist: '/user/wishlist',
        courses:  '/courses',
        courseDetails: (id:string)=> `/course/${id}`,
        tutorDetails:(id:string) => `/user/tutor/profile/${id}`
    },
    tutor: {
        signin:                   '/tutor/auth/login',
        signup:                   '/tutor/auth/register',
        signupOTP:                '/tutor/auth/register/otp',
        forgotPasswordEmailEntry: '/tutor/auth/forgot-password',
        forgotPasswordReset:      '/tutor/auth/forgot-password/reset',
        forgotPasswordOTP:        '/tutor/auth/forgot-password/otp',
        
        completeRegisteration:    '/tutor/complete-registration',

        dashBoard:    '/tutor',
        usersList:    '/tutor/users',
        payoutsList:  '/tutor/payouts',
        createCourse: '/tutor/createCourse',
        editCourse:   '/tutor/courses/edit-course',
        courseList:   '/tutor/courses',
        profile:      '/tutor/profile',
        courseDetails: (id:string) => `/tutor/courses/${id}`,
        userDetails:   (id:string) => `/tutor/user/details/${id}`
    },
    admin: {
        signin: '/admin/auth/login',
        
        forgotPasswordEmailEntry: '/admin/auth/forgot-password',
        forgotPasswordReset:      '/admin/auth/forgot-password/reset',
        forgotPasswordOTP:        '/admin/auth/forgot-password/otp',

        dashBoard:   '/admin',
        usersList:   '/admin/students',
        tutorList:   '/admin/tutors',
        payoutsList: '/admin/payouts',
        courseList:  '/admin/courses',
        courseDetails: (id:string) => `/admin/courses/${id}`,
        userDetails:   (id:string) => `/admin/student/details/${id}`,
        tutorDetails:  (id:string) => `/admin/tutor/details/${id}`,
    },
}