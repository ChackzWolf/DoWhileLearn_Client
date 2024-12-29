export const ROUTES = {
    common: {
        landingPage: '/'
    },
    user: {
        signin: '/login/user',
        signup: '/register/user',
        profile: '/user/profile',
        wishlist: '/user/wishlist',
        courses: '/courses',
        courseDetails: (id:string)=> `/course/${id}`,
    },
    tutor: {
        signin: '/login/tutor',
        signup: '/register/tutor',
        dashBoard: '/tutor',
        usersList: '/tutor/users',
        payoutsList: '/tutor/payouts',
        createCourse: '/tutor/createCourse',
        courseList: '/tutor/courses',
        profile: '/tutor/profile',
        courseDetails: (id:string) => `/tutor/courses/${id}`,
        userDetails: (id:string) => `/tutor/user/details/${id}`
    }
}

// navigate(ROUTES.user.courseDetails.replace(':id', id));