import React, {useState, useEffect} from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({socket, user, room}) {

    const [currentMsg, setCurrentMsg] = useState('');
    const [msgList, setMsgList] = useState([]);

    const setChatMsg = (e) => {
        setCurrentMsg(e.target.value);
    }

    const sendMsg = async (e) => {
        e.preventDefault();
        const validateInput = /^[0-9a-zA-Z-=.,]+$/;
        if(currentMsg !== '' && validateInput) {
            const messageData = {
                room: room,
                author: user,
                msg: currentMsg,
                time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes()
            }

            await socket.emit('send_msg', messageData);
            setCurrentMsg('');
            setMsgList((list) => [...list, messageData]);
        }
    };

    useEffect(() => {
        socket.on('receive_msg', (data) => {
            setMsgList((list) => [...list, data]);
        })
    }, [socket]);

    return (
        <div className="chat-window">
            <div className="chat-header"><p>{`Chat Room: ${room}`}</p></div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                {msgList.map((messageContent, i) => {
                    return (
                        <div className="message" key={i} id={user === messageContent.author ? 'you' : 'other'}>
                            <div>
                                <div className="message-content">
                                    <p>{messageContent.msg}</p>
                                </div>
                                <div className="message-meta">
                                    <span className="message-status"></span>
                                    <p id="time">{messageContent.time}</p>
                                    <p id="author">{messageContent.author}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
                </ScrollToBottom>
            </div>
                <form>
                    <div className="chat-footer">
                        <input type="text" placeholder="Message" onChange={setChatMsg} value={currentMsg} />
                        <button type="submit" onClick={sendMsg}>&#9658;</button>
                    </div>
                </form>
        </div>
    )
}

export default Chat;
