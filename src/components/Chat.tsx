import {FC} from 'react';
import styles from './Chat.module.scss';

interface ChatProps {
    usedCities: string[];
}

const Chat: FC<ChatProps> = ({ usedCities }) => {

    return (
        <div className={styles.chat}>
                <ul>
                    {usedCities.map((city, index) => (
                        <li key={index} ><span >{city}</span></li>
                    ))}
                </ul>
        </div>
    );
};

export default Chat;
