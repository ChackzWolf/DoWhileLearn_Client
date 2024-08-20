import { NavLink } from 'react-router-dom';
import {links} from '../data/mobileNavItems';


const HeaderNav = ()=>{
    return(
        <div className='flex'>
            {links.map((link)=>(
                <NavLink key={link.path} to = {link.path}>
                    {link.name}
                </NavLink>
            ))}
        </div>
    )
}

export default HeaderNav
