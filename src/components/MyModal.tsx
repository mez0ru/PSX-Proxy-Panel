import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

export const OPERATION = {
    ADD_GAME_TO_AUTO_UPDATES: 0,
    INFO: 1,
    INPUT: 2,
}

interface ModalProps {
    title: string;
    message: string;
    isOpen: boolean;
    isGameAdded: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    operation: number;
    confirmAction: React.MouseEventHandler<HTMLButtonElement>;

    path: string;
    setPath: React.Dispatch<React.SetStateAction<string>>;
    passcode: string;
    setPasscode: React.Dispatch<React.SetStateAction<string>>;
}

function renderButtons(operation: number, isGameAdded: boolean, onClick: React.MouseEventHandler<HTMLButtonElement>, dismiss: React.MouseEventHandler<HTMLButtonElement>, passcode: string, setPasscode: React.Dispatch<React.SetStateAction<string>>, path: string, setPath: React.Dispatch<React.SetStateAction<string>>) {
    switch (operation) {
        case OPERATION.ADD_GAME_TO_AUTO_UPDATES:
            return (<>{isGameAdded || <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 mr-3 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                onClick={onClick}
            >
                Confirm
            </button>}
                <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={dismiss}
                >
                    Dismiss
                </button></>)
        case OPERATION.INPUT:
            return <><div className="mb-6">
                <label htmlFor="passcode" className="block mb-2 text-sm font-medium text-gray-900">Passcode</label>
                <input type="password" id="passcode" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full p-2.5" placeholder="Passcode" required value={passcode} onChange={(e) => setPasscode(e.currentTarget.value)} />
                <label htmlFor="path" className="block mt-4 mb-2 text-sm font-medium text-gray-900">New Path</label>
                <input type="text" id="path" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full p-2.5" placeholder="C:\Users\example\..\games.txt" required value={path} onChange={(e) => setPath(e.currentTarget.value)} />
            </div>
                <button
                    type="button" disabled={path && passcode ? false : true}
                    className="inline-flex justify-center mt-1 rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-400"
                    onClick={onClick}
                >
                    Confirm
                </button>
            </>
            break;
        default:
            return <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={dismiss}
            >
                Dismiss
            </button>
    }
}

export function MyModal({ title, message, isOpen, setIsOpen, operation, isGameAdded, confirmAction, passcode, setPasscode, path, setPath }: ModalProps) {
    // let [isOpen, setIsOpen] = useState(true)

    function closeModal() {
        setIsOpen(false)
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    {title}
                                </Dialog.Title>
                                <div className="mt-2 mb-5">
                                    <p className="text-sm text-gray-500">{message}</p>
                                </div>

                                <div className="mt-4">
                                    {renderButtons(operation, isGameAdded, confirmAction, closeModal, passcode, setPasscode, path, setPath)}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
