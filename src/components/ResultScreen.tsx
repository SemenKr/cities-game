import { FC } from 'react';
import { Button, Flex, Tag, Typography } from 'antd';
import styles from './ResultScreen.module.css';

const { Paragraph, Text, Title } = Typography;

interface ResultScreenProps {
    onRestart: () => void;
    usedCitiesInGame: string[];
    title: string;
    subtitle: string;
    variant: 'win' | 'loose';
}

const ResultScreen: FC<ResultScreenProps> = ({
    onRestart,
    usedCitiesInGame,
    title,
    subtitle,
    variant,
}) => {
    const totalCities = usedCitiesInGame.length;
    const playerCities = Math.ceil(totalCities / 2);
    const computerCities = Math.floor(totalCities / 2);
    const lastCity = usedCitiesInGame[usedCitiesInGame.length - 1] ?? 'Нет данных';
    const heroClassName = variant === 'win' ? styles.heroWin : styles.heroLoose;
    const tagColor = variant === 'win' ? 'success' : 'error';

    return (
        <div className={styles.screen}>
            <div className={`${styles.hero} ${heroClassName}`}>
                <Tag className={styles.eyebrow} color={tagColor}>
                    {variant === 'win' ? 'Победа' : 'Поражение'}
                </Tag>
                <Title level={2} className={styles.title}>{title}</Title>
                <Paragraph className={styles.summary}>{subtitle}</Paragraph>
            </div>

            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <Text className={styles.statLabel}>Всего городов</Text>
                    <div className={styles.statValue}>{totalCities}</div>
                </div>
                <div className={styles.statCard}>
                    <Text className={styles.statLabel}>Ваших ходов</Text>
                    <div className={styles.statValue}>{playerCities}</div>
                </div>
                <div className={styles.statCard}>
                    <Text className={styles.statLabel}>Ходов компьютера</Text>
                    <div className={styles.statValue}>{computerCities}</div>
                </div>
            </div>

            <div className={styles.lastCity}>
                <Text type="secondary">Последний засчитанный город</Text>
                <div className={styles.lastCityValue}>{lastCity}</div>
            </div>

            <Flex className={styles.actions}>
                <Button type="primary" size="large" onClick={onRestart}>
                    Начать новую игру
                </Button>
            </Flex>
        </div>
    );
};

export default ResultScreen;
