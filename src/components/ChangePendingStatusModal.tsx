import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ActionResult } from '../Games';

export enum OPERATION {
    INFO = 0,
    INPUT,
}

export interface MessageProps {
    operation: number;
    title: string;
    message: string;
    code: string;
}

interface ModalProps {
    messageProps: MessageProps;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    confirmAction: React.MouseEventHandler<HTMLButtonElement>;

    scLink: string;
    setScLink: React.Dispatch<React.SetStateAction<string>>;
    setJdownloaderResult: React.Dispatch<React.SetStateAction<ActionResult>>;
    jdownloaderResult: ActionResult;
    downloadAction: React.MouseEventHandler<HTMLButtonElement>;
}

function renderButtons(operation: number, onClick: React.MouseEventHandler<HTMLButtonElement>, dismiss: React.MouseEventHandler<HTMLButtonElement>, code: string, scLink: string, setScLink: React.Dispatch<React.SetStateAction<string>>) {
    switch (operation) {
        case OPERATION.INPUT:
            return <><div className="mb-6">
                <label htmlFor="sc package link" className="block mt-4 mb-2 text-sm font-medium text-gray-900">SC Package Link</label>
                <input type="text" id="path" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="https://sgst.prod.dl.play...FSRELE000000100_sc.pkg" required value={scLink} onChange={(e) => setScLink(e.currentTarget.value)} />
            </div>

                <button
                    type="button" disabled={scLink.endsWith('_sc.pkg') && scLink.includes(code) ? false : true}
                    className="inline-flex justify-center mt-1 rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-400 mr-3"
                    onClick={onClick}
                >
                    Confirm
                </button>
                <a className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" href={`https://prosperopatches.com/${code}`} target="_blank" rel="noreferrer">
                    Go to Website</a>
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

export function ChangePendingStatusModal({ messageProps, isOpen, setIsOpen, confirmAction, scLink, setScLink, setJdownloaderResult, jdownloaderResult, downloadAction }: ModalProps) {
    // let [isOpen, setIsOpen] = useState(true)

    function closeModal() {
        if (jdownloaderResult !== ActionResult.INITIALIZED)
            setJdownloaderResult(ActionResult.UNINITIALIZED);
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
                                    {messageProps.title}
                                </Dialog.Title>
                                <div className="mt-2 mb-1">
                                    <p className="text-sm text-gray-500">{messageProps.message}</p>
                                </div>

                                <div className="mb-5">
                                    <p className="text-sm text-gray-500 font-semibold">Game ID: {messageProps.code}</p>
                                </div>

                                <div className="mt-4">
                                    {renderButtons(messageProps.operation, confirmAction, closeModal, messageProps.code, scLink, setScLink)}
                                </div>
                                {messageProps.operation !== OPERATION.INFO && <>
                                    <hr className="h-px my-5 bg-gray-200 border-0"></hr>
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 mt-5"
                                    >
                                        Download Update/Game
                                    </Dialog.Title>
                                    <div className="mt-2 mb-5">
                                        <p className="text-sm text-gray-500">Downloading this specific update/game version is possible.</p>
                                    </div>
                                    <div className="mt-4">

                                        <button
                                            type="button"
                                            disabled={jdownloaderResult !== ActionResult.UNINITIALIZED}
                                            className="inline-flex justify-center mt-1 rounded-md border border-transparent bg-violet-100 px-4 py-2 text-sm font-medium text-violet-900 hover:bg-violet-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-400 mr-3"
                                            onClick={downloadAction}
                                        >Download
                                        </button>
                                        {jdownloaderResult === ActionResult.INITIALIZED && <span><svg aria-hidden="true" className="inline-flex justify-center w-5 h-5 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg></span>}

                                        {jdownloaderResult === ActionResult.SUCCESS && <span className="text-green-500 font-['Montserrat']">Success!</span>}
                                        {jdownloaderResult === ActionResult.FAIL && <span className="text-red-500 font-['Montserrat']">Failed!</span>}
                                    </div></>}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
