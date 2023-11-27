// LooseScreen.tsx
import { FC } from 'react';
import {Button, Flex, Typography } from "antd";

const { Title, Paragraph, Text } = Typography;

interface LooseScreenProps {
    onRestart: () => void;
    usedCitiesInGame: string[];
}

const LooseScreen: FC<LooseScreenProps> = ({onRestart, usedCitiesInGame}) => {
    return (
        <Flex style={{textAlign: 'center'}}
              vertical justify={'center'}
              align={'center'}
              gap={'small'}>
            {/* Add your loose screen content here */}
            <Title  level={3}>К сожалению твое время вышло!<br/>
                Твой противник победил!</Title>
            <Paragraph>Всего было перечислено городов: {usedCitiesInGame.length} <br/> Очень не плохой результат!</Paragraph>
            <Text style={{color: "#DC2626", fontSize:'2rem', fontWeight:'500'}}>00:00</Text>
            <Paragraph>Последний город названный победителем <br/> {usedCitiesInGame[usedCitiesInGame.length - 1]}</Paragraph>

            <Button
                type={"primary"}
                onClick={onRestart}>
                Начать новую игру
            </Button>
        </Flex>
    );
};

export default LooseScreen
