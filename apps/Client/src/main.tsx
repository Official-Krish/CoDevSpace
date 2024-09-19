
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react';
import { AppBar } from './components/appbar.tsx';
import { Footer } from './components/footer.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <ChakraProvider>
        <AppBar/>
        <App />
        <Footer/>
      </ChakraProvider>
    </BrowserRouter>
)
