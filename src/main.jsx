/** @format */

import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AppV2 from './AppV2.jsx';

function Root() {
    const [version, setVersion] = useState('v1');

    return (
        <div>
            <div className="fixed top-3 right-3 z-50 flex gap-2">
                <button
                    onClick={() => setVersion('v1')}
                    className="px-3 py-1 text-xs bg-slate-700 text-white rounded"
                >
                    App V1
                </button>

                <button
                    onClick={() => setVersion('v2')}
                    className="px-3 py-1 text-xs bg-emerald-600 text-white rounded"
                >
                    App V2
                </button>
            </div>

            {version === 'v1' ? <App /> : <AppV2 />}
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>,
);
