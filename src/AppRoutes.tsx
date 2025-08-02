import React from "react";
import { createBrowserRouter } from "react-router-dom";
import CharacterList from "./pages/CharacterList";
import CharacterSelectedDesktop from "./components/CharacterSelectedDesktop";
import CharacterDetail from "./pages/CharacterDetail";



    const routes = createBrowserRouter([
        {
            path: "/",
            element: <CharacterList />
        },
        {
            path: "/:id",
            element: <CharacterDetail />
        }
    ])

    export default routes;