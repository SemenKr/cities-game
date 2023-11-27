// WinScreen.tsx
import { FC } from 'react';
import {Button, Flex, Typography } from "antd";
const { Title, Paragraph, Text } = Typography;


interface WinScreenProps {
    onRestart: () => void
    usedCitiesInGame: string[];
}

const WinScreen: FC<WinScreenProps> = ({onRestart, usedCitiesInGame}) => {
    return (
        <Flex style={{textAlign: 'center'}}
              vertical justify={'center'}
              align={'center'}
              gap={'small'}>
            {/* Add your loose screen content here */}
            <Title  level={3}>Поздравляем тебя с победой!<br/> Твой противник не вспомнил нужный город!</Title>
            <Paragraph>Всего было перечислено городов: {usedCitiesInGame.length} <br/> Очень не плохой результат!</Paragraph>
            <Text style={{color: "#16A34A", fontSize:'2rem', fontWeight:'500'}}>00:00</Text>
            <Paragraph>Последний город названный победителем <br/> {usedCitiesInGame[usedCitiesInGame.length - 1]}</Paragraph>

            <Button
                type={"primary"}
                onClick={onRestart}>
                Начать новую игру
            </Button>
        </Flex>
    );
};

export default WinScreen;
