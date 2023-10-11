import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate
} from "react-router-dom"
import { Home } from "./Pages/Home"
import { Brusque } from "./Pages/Brusque"
import { Blumenau } from "./Pages/Blumenau"
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: "https://monitoramento.defesacivil.sc.gov.br/graphql",
    cache: new InMemoryCache(),
});

export function AppRoutes() {
    return (
        <Router>
            <ApolloProvider client={client}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Brusque" element={<Brusque />} />
                    <Route path="/Blumenau" element={<Blumenau />} />
                </Routes>
            </ApolloProvider>
        </Router>
    )
}