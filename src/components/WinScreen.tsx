// WinScreen.tsx
import { FC } from 'react';
import {Button} from "antd";

interface WinScreenProps {
    onRestart: () => void
}

const WinScreen: FC<WinScreenProps> = ({onRestart}) => {
    return (
        <div>
            {/* Add your win screen content here */}
            <h1>You Win!</h1>
            <Button type={"primary"} onClick={onRestart}  />
        </div>
    );
};

export default WinScreen;
