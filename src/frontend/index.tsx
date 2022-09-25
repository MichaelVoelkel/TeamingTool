import LocalSessionResultsRepository from 'infra/session/session_results_repository';
import React from 'react'
import { createRoot } from 'react-dom/client'
import Home from './Home';
import './index.css'

const container = document.getElementById('app-root');

const root = createRoot(container!);
root.render(
    <Home />
);