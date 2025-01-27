import { NavLink } from 'react-router-dom';
import { firstNav } from '../../../data/HeaderNavData';

const HeaderNav = () => {

    return (
        <div className={`flex md:mr-10 md:gap-10 lg:gap-10 gap-2 md:text-base text-sm  items-center self-center font-semibold h-8 md:px-5 lg:px-5 pr-2`}>
            {firstNav.map((link) => (
                <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                        isActive ? "text-accent underline" : "hover:underline hover:scale-105 text-accent transition-all"
                    }
                >
                    {link.name}
                </NavLink>
            ))}
        </div>
    );
};

export default HeaderNav;
