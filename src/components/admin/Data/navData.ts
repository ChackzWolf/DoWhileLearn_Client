import { HiAcademicCap, HiOutlineUsers } from "react-icons/hi2";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { BsCollectionPlay } from "react-icons/bs";
import { ROUTES } from "../../../routes/Routes";


export const data = [
    {
        name: 'Students',
        icon: HiOutlineUsers,
        path: ROUTES.admin.usersList
    },
    {
        name: 'Tutors',
        icon: HiAcademicCap,
        path: ROUTES.admin.tutorList
    },
    {
        name: 'Payouts',
        icon: RiMoneyRupeeCircleLine,
        path: ROUTES.admin.payoutsList
    },
]

export const content = [
    {
        name: "Courses",
        path: ROUTES.admin.courseList,
        icon: BsCollectionPlay
    }
]