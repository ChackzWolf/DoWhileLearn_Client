import { HiOutlineUsers } from "react-icons/hi2";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { BsCollectionPlay } from "react-icons/bs";


export const data = [
    {
        name: 'Students',
        icon: HiOutlineUsers,
        path:'/admin/students'
    },
    {
        name: 'Tutors',
        icon: RiMoneyRupeeCircleLine,
        path: '/admin/tutors'
    },
    {
        name: 'Payouts',
        icon: RiMoneyRupeeCircleLine,
        path: '/admin/payouts'
    },
]

export const content = [
    {
        name: "Courses",
        path: "/tutor/courses",
        icon: BsCollectionPlay
    },
    {
        name: "On going lives",
        path: "tutor/live",
        icon: HiOutlineUsers
    }

]