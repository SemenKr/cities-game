import { FC } from 'react';
import { Button, Flex, Tag, Typography } from 'antd';
import styles from './ResultScreen.module.css';
import { getAverageCitiesPerRound, getRoundStats, getStreakLabel } from "src/lib/gameStats.ts";
import { PlayerStats } from "src/types/gameStats.ts";

const { Paragraph, Text, Title } = Typography;

interface ResultScreenProps {
    onRestart: () => void;
    usedCitiesInGame: string[];
    title: string;
    subtitle: string;
    variant: 'win' | 'loose';
    reasonTitle: string;
    reasonDescription: string;
    playerStats: PlayerStats;
}

const ResultScreen: FC<ResultScreenProps> = ({
    onRestart,
    usedCitiesInGame,
    title,
    subtitle,
    variant,
    reasonTitle,
    reasonDescription,
    playerStats,
}) => {
    const { totalCities, playerCities, computerCities, lastCity } = getRoundStats(usedCitiesInGame);
    const heroClassName = variant === 'win' ? styles.heroWin : styles.heroLoose;
    const tagColor = variant === 'win' ? 'success' : 'error';
    const averageCities = getAverageCitiesPerRound(playerStats);
    const streakLabel = getStreakLabel(playerStats);

    return (
        <div className={styles.screen}>
            <div className={`${styles.hero} ${heroClassName}`}>
                <div className={styles.heroTop}>
                    <Tag className={styles.eyebrow} color={tagColor}>
                        {variant === 'win' ? 'Победа' : 'Поражение'}
                    </Tag>
                    <div className={styles.heroBadge}>
                        Раунд из {totalCities} город{totalCities === 1 ? 'а' : totalCities < 5 ? 'ов' : 'ов'}
                    </div>
                </div>
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

            <div className={styles.reasonCard}>
                <Text type="secondary">Причина завершения</Text>
                <div className={styles.reasonValue}>{reasonTitle}</div>
                <Paragraph className={styles.summary}>{reasonDescription}</Paragraph>
            </div>

            <div className={styles.reasonCard}>
                <Text type="secondary">Ваш общий прогресс</Text>
                <div className={styles.metaStats}>
                    <div className={styles.metaStat}>
                        <span>Побед</span>
                        <strong>{playerStats.wins}</strong>
                    </div>
                    <div className={styles.metaStat}>
                        <span>Поражений</span>
                        <strong>{playerStats.losses}</strong>
                    </div>
                    <div className={styles.metaStat}>
                        <span>Рекорд</span>
                        <strong>{playerStats.bestRoundCities}</strong>
                    </div>
                    <div className={styles.metaStat}>
                        <span>Среднее</span>
                        <strong>{averageCities}</strong>
                    </div>
                    <div className={styles.metaStatWide}>
                        <span>Текущая серия</span>
                        <strong>{streakLabel}</strong>
                    </div>
                </div>
            </div>

            <div className={styles.lastCity}>
                <Text type="secondary">Последний засчитанный город</Text>
                <div className={styles.lastCityValue}>{lastCity ?? 'Нет данных'}</div>
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
