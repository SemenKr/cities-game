// LooseScreen.tsx
import { FC } from 'react';
import {Button} from "antd";

interface LooseScreenProps {
    onRestart: () => void;
}

const LooseScreen: FC<LooseScreenProps> = ({onRestart}) => {
    return (
        <div>
            {/* Add your loose screen content here */}
            <h1>You Loose!</h1>
            <Button
                type={"primary"}
                onClick={onRestart}>
                Попробуй еще!
            </Button>
        </div>
    );
};

export default LooseScreen;
