import { HashRouter, Routes, Route } from 'react-router-dom';
import About from './about/about';
import Dashboard from './dashboard/dashboard';

const Router = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Dashboard/>} />
                <Route path="/about" element={<About/>} />
            </Routes>
        </HashRouter>
    )
};

export default Router;