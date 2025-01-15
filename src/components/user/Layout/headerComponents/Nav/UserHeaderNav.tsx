import { NavLink } from 'react-router-dom';
import { firstNav } from '../../../data/HeaderNavData';

const HeaderNav = () => {

    return (
        <div className={`flex mr-10 gap-10 items-center self-center font-semibold h-8 px-5  `}>
            {firstNav.map((link) => (
                <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                        isActive ? "text-white" : "hover:text-gray-50 transition-all"
                    }
                >
                    {link.name}
                </NavLink>
            ))}
        </div>
    );
};

export default HeaderNav;
