import { useContext, useState, useEffect, Fragment, useRef } from 'react'
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
    { id: 6, name: 'Any' },
]

const LEVEL = ["NOT IMPLEMENTED", "Debug", "Info", "Warning", "Error", "Fatal"]
const LEVEL_COLOR = ["NOT IMPLEMENTED", "text-gray-600", "text-blue-600", "text-yellow-600", "text-red-600", "text-red-700"]

export default function Logs() {
    const socketProvider = useContext(SocketContext);
    const [logs, setLogs] = useState<any[]>([])
    const [selectedLevel, setSelectedLevel] = useState(levels[0])
    const [text, setText] = useState('')
    const [limit, setLimit] = useState(50)
    const status = useRef<HTMLHeadingElement>(null)
    const [offset, setOffset] = useState(0)
    useEffect(() => {

        switch (socketProvider?.data?.type) {
            case MESSAGE_TYPES.GET_LOGS:
                console.log(socketProvider.data.result)
                setLogs(socketProvider.data.result)
                status.current!.innerText = `Query finished with ${socketProvider.data.result.length} results!`;
                break;
            default:
                break;
        }
    }, [socketProvider?.data])

    const loadLogs = () => {
        socketProvider?.socket?.send(JSON.stringify({ type: MESSAGE_TYPES.GET_LOGS, level: selectedLevel.id === 6 ? undefined : selectedLevel.id, text, limit: limit === 0 ? undefined : limit, offset }));
    }

    return (<>
        <div className='table md:mb-3'>
            <h2 className="text-lg sm:text-xl text-gray-700">Search Logs</h2>
        </div>
        <div className='grid grid-cols-6 grid-rows-2 mt-5 gap-4'>
            <Listbox value={selectedLevel} onChange={setSelectedLevel}>
                <div className="relative mt-1">
                    <Listbox.Button className="z-10 relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 sm:text-sm">
                        <span className="block truncate">{selectedLevel.name}</span>
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
                        <Listbox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {levels.map((person, personIdx) => (
                                <Listbox.Option
                                    key={personIdx}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-purple-100 text-purple-900' : 'text-gray-900'
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
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-600">
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
            <input type="text" className="col-span-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder='Text search' onChange={(e) => setText(e.currentTarget.value)} value={text} />
            <button type="button" className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm" onClick={loadLogs}>Query Search!</button>
            <input type="number" placeholder='Limit' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" onChange={(e) => setLimit(parseInt(e.currentTarget.value))} value={limit} />
            <input type="number" placeholder='Offset' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" onChange={(e) => setOffset(parseInt(e.currentTarget.value))} value={offset} />
            <h5 ref={status}></h5>
        </div>

        <div className="relative overflow-x-auto mt-4">
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
                        <th scope="col" className="px-6 py-3">
                            Date
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
                                <td className="px-6 py-4 font-medium text-gray-900 w-3/4">
                                    {item.message}
                                </td>
                                <td className="px-6 py-4 break-word">
                                    {item.url || "NULL"}
                                </td>
                                <td className={`px-6 py-4 font-medium ${LEVEL_COLOR[item.level]} font-bold whitespace-nowrap`}>
                                    {LEVEL[item.level]}
                                </td>
                                <td className={`px-6 py-4 font-medium [word-spacing:9999px]`}>
                                    {item.created_at}
                                </td>
                            </tr>)
                        })
                    }
                </tbody>
            </table>
        </div></>
    )
}
