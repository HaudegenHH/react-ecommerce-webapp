import { createContext, useState, useEffect } from "react";

// should run once using useEffect
//import { addCollectionAndDocuments } from "../utils/firebase/firebase.utils.js";

//import SHOP_DATA from '../shop-data.js';

import { getCategoriesAndDocuments } from "../utils/firebase/firebase.utils";

// renaming Products- to CategoriesContext
export const CategoriesContext = createContext({
    categoriesMap: {}
});

// similarily rename ProductsProvider to:
export const CategoriesProvider = ({children}) => {
    const [categoriesMap, setCategoriesMap] = useState({})
    // useEffect(() => {
    //   addCollectionAndDocuments('categories', SHOP_DATA, 'title');
    // }, [])

    useEffect(() => {
        const getCategoriesMap = async () => {
            const categoriesMap = await getCategoriesAndDocuments();
            //console.log(categoriesMap);
            // {hats: Array(9), jackets: Array(5), mens: Array(6), 
            // sneakers: Array(8), womens: Array(7)}
            setCategoriesMap(categoriesMap);
        }
        getCategoriesMap();
    }, [])
    
    const value = { categoriesMap };
    return (
        <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>
    );
}