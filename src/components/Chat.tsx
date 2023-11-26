import { FC, useEffect, useRef } from 'react';
import styles from './Chat.module.scss';

interface ChatProps {
    usedCities: string[];
}

const Chat: FC<ChatProps> = ({ usedCities }) => {
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [usedCities]);

    return (
        <div className={styles.chat} ref={chatRef}>
            <ul>
                {usedCities.map((city, index) => (
                    <li key={index}>
                        <span>{city}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Chat;
