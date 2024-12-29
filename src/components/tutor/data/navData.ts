import { HiOutlineUsers } from "react-icons/hi2";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { RiFunctionAddFill } from "react-icons/ri";
import { BsCollectionPlay } from "react-icons/bs";
import { ROUTES } from "../../../routes/Routes";


export const data = [
    {
        name: 'Students',
        icon: HiOutlineUsers,
        path: ROUTES.tutor.usersList,
    },
    {
        name: 'Payouts',
        icon: RiMoneyRupeeCircleLine,
        path: ROUTES.tutor.payoutsList,
    },
]

export const content = [
    {   
        name: "Create course",
        path: ROUTES.tutor.createCourse,
        icon: RiFunctionAddFill
    },
    {
        name: "Courses",
        path: ROUTES.tutor.courseList,
        icon: BsCollectionPlay
    }

]