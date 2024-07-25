import { faBars, faBell, faListCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"

const Menu = () => {
    
  return (
    <main className='w-full lg:w-[calc(100%-256px)] ml-64 bg-gray-50 min-h-screen'>
        <div className="py-3 px-6 bg-white flex items-center shadow-md shadow-black/5">
            <button type="button" className="text-lg text-gray-600" >
                 <FontAwesomeIcon icon={faBars}/>
            </button>
            <ul className=" flex items-center text-sm ml-4">
                <li className="mr-2">
                    <Link to={"/"} className="text-gray-400 font-medium hover:text-gray-600"> Dashboard</Link>
                </li>
            </ul>
            <ul className="ml-auto flex items-center">
                <li className="mr-1">
                    <button type='button' 
                    className="text-gray-400 w-8 h-8 rounded flex items-center justify-center
                     hover:bg-gray-50 hover:text-gray-600">
                        <FontAwesomeIcon icon={faListCheck} />                    
                    </button>
                </li>
                <li className="mr-1">
                    <button type='button' 
                    className="text-gray-400 w-8 h-8 rounded flex items-center justify-center
                     hover:bg-gray-50 hover:text-gray-600">
                        <FontAwesomeIcon icon={faBell}/>
                    </button>
                </li>
                <li>
                    <button type="button">
                    <img src='https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png' 
                        alt='nat'
                        className="w-10 h-10 rounded-full block object-cover align-middle"/>
                    </button>
                </li>
            </ul>
        </div>
    </main>
  )
}

export default Menu