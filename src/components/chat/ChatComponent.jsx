import React, { useEffect, useRef } from 'react'
import { convertISOToCustomFormat } from '../../functions/format'
import { postData } from '../../functions/postData'
import { GET_NOTIFY } from '../../config/host'
import { useDispatch, useSelector } from 'react-redux';
import { addNotify, addNotification } from '../../redux/slice'

function ChatComponent({ selected, editable }) {
    const notify = useSelector((state) => state.notify);
    const buttonRef = useRef(null);
    const inputRef = useRef(null)
    const [data, setData] = React.useState({})
    const dispatch = useDispatch();
    const user = JSON.parse(sessionStorage.getItem('user'))
    const [inputText, setInputText] = React.useState('')

    useEffect(() => {
        getData()
        inputRef.current.focus()
    }, [selected, notify])

    const handleSend = async () => {
        let result = await postData(GET_NOTIFY, {
            sender: { userId: user.userId },
            receiver: { userId: data.user.userId },
            messages: inputText
        })
        dispatch(addNotify({
            user: data.user,
            message: {
                me: true,
                content: inputText,
                createDate: result.createDate
            }
        }))
        dispatch(addNotification({
            type: 'ADD_NOTIFICATION',
            content: {
                sender: user.userId,
                receiver: data.user.userId,
                message: inputText
            }
        }))
        setInputText('')
    }

    const getData = () => {
        const index = notify.findIndex(i => i.user.userId === selected)
        if (index !== -1)
            setData(notify[index])
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          buttonRef.current.click();
        }
      };

    const BubbleChat = ({ item }) => {
        const time = convertISOToCustomFormat(item.createDate)
        return (
            <div title={time.substring(5)} className={`w-100 d-flex ${item.me? 'justify-content-end' : 'justify-content-start'}`}>
                <div className={`p-2 mx-1 border ${item.me ? 'bg-primary border-light' : 'bg-light border-dark'}`}
                    style={{
                        width: 'fit-content', borderRadius: 15, maxWidth: '45%', textAlign: 'start',
                        wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal',
                    }}>
                    <p className={`m-0 w-100 ${item.me ? 'text-light' : 'text-dark'}`}>{item.content}</p>
                    <p className={`m-0 w-100 ${item.me ? 'text-light' : 'text-dark'}`}>{time.substring(0, 5)}</p>
                </div>
            </div>
        )
    }

    return (
        <div className='divCenterColumn w-100' style={{ flexGrow: 1 }}>
            <div style={{ flexGrow: 1, maxHeight: 471, display: 'flex', flexDirection: 'row', width: '100%' }}>
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column-reverse',
                    overflowY: 'auto', overflowX: 'hidden'
                 }} 
                    className='border m-0 h-100 border-dark rounded'>
                    {
                        data?.messages?.map((item, index) => (
                            <div key={index}>
                                <BubbleChat item={item} />
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className='mt-2 divRowBetween w-100' style={{ height: 60 }}>
                <input className='w-90 rounded' disabled={!editable} style={{ height: 40 }} placeholder='Type message' 
                    value={inputText} 
                    ref={inputRef}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <button ref={buttonRef} className='w-10 bg-primary ml-2' disabled={!editable} style={{ height: 40 }} onClick={handleSend}>Send</button>
            </div>
        </div>
    )
}

export default ChatComponent