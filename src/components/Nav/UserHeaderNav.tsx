import { NavLink } from 'react-router-dom';
import {links} from '../data/mobileNavItems';


const HeaderNav = ()=>{
    return(
        <div className='flex mr-10'>
            {links.map((link)=>(
                <NavLink key={link.path} to = {link.path}>
                    {link.name}
                </NavLink>
            ))}
        </div>
    )
}

export default HeaderNav
