import { useContext, useState, useEffect, Fragment } from 'react'
import { MESSAGE_TYPES } from './App';
import { SocketContext } from './SocketContext';
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

const levels = [
    { id: 1, name: 'Debug' },
    { id: 2, name: 'Info' },
    { id: 3, name: 'Warning' },
    { id: 4, name: 'Error' },
    { id: 5, name: 'Fatal' },
]

const LEVEL = ["NOT IMPLEMENTED", "Debug", "Info", "Warning", "Error", "Fatal"]
const LEVEL_COLOR = ["NOT IMPLEMENTED", "text-gray-600", "text-blue-600", "text-yellow-600", "text-red-600", "text-red-700"]

export default function Logs() {
    const socketProvider = useContext(SocketContext);
    const [logs, setLogs] = useState<any[]>([])
    const [selectedPerson, setSelectedPerson] = useState(levels[0])

    useEffect(() => {

        switch (socketProvider?.data?.type) {
            case MESSAGE_TYPES.GET_LOGS:
                console.log(socketProvider.data.result)
                setLogs(socketProvider.data.result)
                break;
            default:
                break;
        }
    }, [socketProvider?.data])

    const loadLogs = () => {
        socketProvider?.socket?.send(JSON.stringify({ type: MESSAGE_TYPES.GET_LOGS }));
    }

    return (<>
        <Listbox value={selectedPerson} onChange={setSelectedPerson}>
            <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">{selectedPerson.name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {levels.map((person, personIdx) => (
                            <Listbox.Option
                                key={personIdx}
                                className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                    }`
                                }
                                value={person}
                            >
                                {({ selected }) => (
                                    <>
                                        <span
                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                }`}
                                        >
                                            {person.name}
                                        </span>
                                        {selected ? (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>

        <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Message
                        </th>
                        <th scope="col" className="px-6 py-3">
                            URL
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Level
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        logs.map((item, i) => {
                            return (<tr key={i} className="bg-white border-b">
                                <th scope="row" className="px-6 py-4 ">
                                    {item.id}
                                </th>
                                <td className="px-6 py-4 font-medium text-gray-900 break-word">
                                    {item.message}
                                </td>
                                <td className="px-6 py-4 break-word">
                                    {item.url || "NULL"}
                                </td>
                                <td className={`px-6 py-4 font-medium ${LEVEL_COLOR[item.level]} font-bold text-red-600 whitespace-nowrap`}>
                                    {LEVEL[item.level]}
                                </td>
                            </tr>)
                        })
                    }
                </tbody>
            </table>
        </div></>
    )
}
