import { HashRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HomePage } from './pages/HomePage';
import { GameShell } from './pages/GameShell';

export function App() {
    return (
        <HashRouter>
            <AnimatePresence mode="wait">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/game/:gameId" element={<GameShell />} />
                </Routes>
            </AnimatePresence>
        </HashRouter>
    );
}
