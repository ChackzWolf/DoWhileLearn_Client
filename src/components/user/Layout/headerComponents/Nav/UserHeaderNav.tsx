import { NavLink } from 'react-router-dom';
import { firstNav } from '../../../data/HeaderNavData';

const HeaderNav = () => {
    return (
        <div className='flex mr-10 gap-10 items-center font-semibold'>
            {firstNav.map((link) => (
                <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                        isActive ? "text-[#7C24F0]" : "hover:text-[#6211cd] transition-all"
                    }
                >
                    {link.name}
                </NavLink>
            ))}
        </div>
    );
};

export default HeaderNav;
