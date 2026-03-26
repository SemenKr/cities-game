import { FC, useEffect, useRef } from 'react';
import styles from './Chat.module.scss';

interface ChatProps {
    usedCities: string[];
    isComputerThinking: boolean;
    pendingLetter: string;
}

const Chat: FC<ChatProps> = ({ usedCities, isComputerThinking, pendingLetter }) => {
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
                {isComputerThinking && (
                    <li className={styles.typingItem}>
                        <div className={styles.typingBubble}>
                            <div className={styles.typingDots} aria-hidden="true">
                                <span />
                                <span />
                                <span />
                            </div>
                            <small>
                                Компьютер думает{pendingLetter ? ` над городом на "${pendingLetter}"` : '...'}
                            </small>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Chat;
