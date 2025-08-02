import React from "react";
import { createBrowserRouter } from "react-router-dom";
import CharacterList from "./pages/CharacterList";
import CharacterSelected from "./pages/CharacterSelected";



    const routes = createBrowserRouter([
        {
            path: "*",
            Component: CharacterList,
            children: [
                {
                    path: ":id",
                    Component: CharacterSelected
                }
            ]
        }
    ])

    export default routes;