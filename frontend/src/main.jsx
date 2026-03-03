
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';

import {BrowserRouter} from "react-router-dom"
import { Context_app } from './contextapp/Context_app.jsx';


createRoot(document.getElementById('root')).render(
<BrowserRouter>
<Context_app>
   <App />
</Context_app>

</BrowserRouter>
   
 ,
)
