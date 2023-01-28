import React from 'react'

interface FooterProps {
    marginfull: boolean;
    onClick: React.MouseEventHandler<HTMLAnchorElement>;
}

export default function Footer({ marginfull, onClick }: FooterProps) {
    return (

        <footer className={`p-4 bg-white md:flex md:items-center md:justify-between md:p-6 ${marginfull ? 'mt-auto' : ''}`}>
            <span className="text-sm text-gray-500 sm:text-center">© 2023 <a href="https://github.com/mez0ru" className="hover:underline">Hamzah Abdulqudos Al-washali</a>. All Rights Reserved.
            </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 sm:mt-0">
                <li>
                    <a id="about" href="#" className="mr-4 hover:underline md:mr-6" onClick={onClick}>About</a>
                </li>
                <li>
                    <a id="set-games" href="#" className="mr-4 hover:underline md:mr-6" onClick={onClick}>Set "Games.txt" Path</a>
                </li>
                <li>
                    <a id="licensing" href="#" className="mr-4 hover:underline md:mr-6" onClick={onClick}>Licensing</a>
                </li>
            </ul>
        </footer>

        // <footer className="bg-neutral-800 text-white w-full p-4 fixed bottom-0">
        //     <h3>Copyright &copy; Hamzah Abdulqudos Al-washali</h3>
        //     <h3>Description: This is a web application to help manage PSX Proxy.</h3>
        // </footer>
    )
}
