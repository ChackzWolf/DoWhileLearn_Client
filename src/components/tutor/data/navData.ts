import { HiOutlineUsers } from "react-icons/hi2";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { RiFunctionAddFill } from "react-icons/ri";
import { BsCollectionPlay } from "react-icons/bs";


export const data = [
    {
        name: 'Users',
        icon: HiOutlineUsers,
        path:'/tutor/users'
    },
    {
        name: 'Payouts',
        icon: RiMoneyRupeeCircleLine,
        path: '/tutor/payouts'
    },
]

export const content = [
    {   
        name: "Create course",
        path: "/tutor/createCourse",
        icon: RiFunctionAddFill
    },
    {
        name: "Courses",
        path: "/tutor/courses",
        icon: BsCollectionPlay
    },
    {
        name: "Live",
        path: "tutor/live",
        icon: HiOutlineUsers
    }

]