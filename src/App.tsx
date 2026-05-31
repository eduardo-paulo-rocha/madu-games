import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HomePage } from './pages/HomePage';
import { GameShell } from './pages/GameShell';

export function App() {
    return (
        <BrowserRouter>
            <AnimatePresence mode="wait">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/game/:gameId" element={<GameShell />} />
                </Routes>
            </AnimatePresence>
        </BrowserRouter>
    );
}
