import './App.css'
import {Game} from "./components/Game.tsx";
import { ConfigProvider} from "antd";

function App() {


  return (


        <ConfigProvider
            theme={{
                token: {
                    // Seed Token
                    colorPrimary: '#8B5CF6',
                    borderRadius: 8,

                    // Alias Token

                },
            }}
        >
            <Game />
        </ConfigProvider>


  )
}

export default App
