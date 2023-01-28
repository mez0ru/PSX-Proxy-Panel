import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons/faTriangleExclamation'

interface AlertProps {
    level?: number;
    message: string;
}

export default function Alert({ level = 3, message }: AlertProps) {
    return (
        <div className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
            <FontAwesomeIcon className='flex-shrink-0 inline w-5 h-5 mr-3' icon={faTriangleExclamation} />
            <div className="font-semibold"><strong>{level === 4 ? "Critical" : "Warning"}</strong> {message}
            </div>
        </div>
    )
}
