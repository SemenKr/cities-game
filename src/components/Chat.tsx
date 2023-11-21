import { FC } from 'react';

interface ChatProps {
    playerCities: string[];
    computerCities: string[];
}

const Chat: FC<ChatProps> = ({ playerCities, computerCities }) => {
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ flex: 1, marginRight: '10px' }}>
                <h2>Города игрока:</h2>
                <ul>
                    {playerCities.map((city, index) => (
                        <li key={index}>{city}</li>
                    ))}
                </ul>
            </div>
            <div style={{ flex: 1, marginLeft: '10px' }}>
                <h2>Города компьютера:</h2>
                <ul>
                    {computerCities.map((city, index) => (
                        <li key={index}>{city}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Chat;
