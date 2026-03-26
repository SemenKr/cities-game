const IGNORED_LAST_LETTERS = new Set(['ъ', 'ь', 'й', 'ы']);

export const normalizeCity = (value: string) => {
    return value.trim().replace(/\s+/g, ' ').replace(/ё/gi, 'е').toLowerCase();
};

export const findCanonicalCity = (input: string, cities: string[]) => {
    const normalizedInput = normalizeCity(input);

    if (!normalizedInput) {
        return null;
    }

    return cities.find((city) => normalizeCity(city) === normalizedInput) ?? null;
};

export const getLastLetter = (city: string) => {
    const normalizedCity = normalizeCity(city);

    for (let index = normalizedCity.length - 1; index >= 0; index -= 1) {
        const letter = normalizedCity[index];

        if (!IGNORED_LAST_LETTERS.has(letter)) {
            return letter.toUpperCase();
        }
    }

    return '';
};

export const matchesRequiredLetter = (city: string, requiredLetter: string) => {
    if (!requiredLetter) {
        return true;
    }

    return normalizeCity(city).startsWith(requiredLetter.toLowerCase());
};

export const hasCityBeenUsed = (city: string, usedCities: string[]) => {
    const normalizedCity = normalizeCity(city);
    return usedCities.some((usedCity) => normalizeCity(usedCity) === normalizedCity);
};

export const filterAvailableCities = ({
    cities,
    requiredLetter,
    usedCities,
    query = '',
}: {
    cities: string[];
    requiredLetter: string;
    usedCities: string[];
    query?: string;
}) => {
    const normalizedQuery = normalizeCity(query);

    return cities.filter((city) => {
        if (!matchesRequiredLetter(city, requiredLetter)) {
            return false;
        }

        if (hasCityBeenUsed(city, usedCities)) {
            return false;
        }

        if (normalizedQuery && !normalizeCity(city).includes(normalizedQuery)) {
            return false;
        }

        return true;
    });
};

export const chooseComputerCity = ({
    cities,
    requiredLetter,
    usedCities,
}: {
    cities: string[];
    requiredLetter: string;
    usedCities: string[];
}) => {
    const availableCities = filterAvailableCities({
        cities,
        requiredLetter,
        usedCities,
    });

    if (availableCities.length === 0) {
        return null;
    }

    const rankedCities = availableCities
        .map((city) => {
            const nextUsedCities = [...usedCities, city];
            const playerReplyCount = filterAvailableCities({
                cities,
                requiredLetter: getLastLetter(city),
                usedCities: nextUsedCities,
            }).length;

            return {
                city,
                playerReplyCount,
            };
        })
        .sort((left, right) => {
            if (left.playerReplyCount !== right.playerReplyCount) {
                return left.playerReplyCount - right.playerReplyCount;
            }

            return left.city.localeCompare(right.city, 'ru');
        });

    return rankedCities[0].city;
};
