import React, {useContext} from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const GameContext = React.createContext(null)

export function useGame() {
    return useContext(GameContext);
}

export function GameProvider({ children }: any) {
    const [ currentMap, setCurrentMap ] = useLocalStorage('currentMap', '');
    const [ currentPlayerLocation, setCurrentPlayerLocation ] = useLocalStorage('currentPlayerLocation', '');
    const [ currentRound, setCurrentRound ] = useLocalStorage('currentRound', 0);
    const [ currentScore, setCurrentScore ] = useLocalStorage('currentScore', 0);
    const [ maps, setMaps ] = useLocalStorage('maps', []);
    const [ playerLocations, setPlayerLocations ] = useLocalStorage('playerLocations', []);
    const [ scores, setScores ] = useLocalStorage('scores', []);

    const value = {
    currentMap,
    setCurrentMap,
    currentRound,
    setCurrentRound,
    currentScore,
    setCurrentScore,
    maps,
    setMaps,
    scores,
    setScores,
    playerLocations,
    setPlayerLocations,
    currentPlayerLocation,
    setCurrentPlayerLocation
    }

    return (
    <GameContext.Provider value={value}>
        {children}
    </GameContext.Provider>
    )
    }