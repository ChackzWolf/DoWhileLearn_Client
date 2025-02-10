import HeaderDropdown from "../Supporters/HeaderDropDown";




const Header = () =>{


   
    return (
        
          <div className="items-center w-full mx-auto p-3 px-5 shadow-xl  bg-slate-50 rounded-b-lg">
                <div className="justify-between flex">
                    <div className="col-span-1 flex gap-2">
                        <img src="/logos/brainPurple.svg" alt="Brain Bright Icon" className="h-8 w-auto mt-1" />
                        <h1 className="text-2xl font-extrabold text-[#7C24F0]">DoWhile{' { Learn } '}</h1>
                        <h1 className="text-[#7C24F0] font-bold my-2">Admin</h1>
                    </div>


                    <div className="justify-end flex">                        
                        <div>
                            <HeaderDropdown/>
                        </div>
                    </div>    
                </div>
          </div>
        
      );
}

export default Header;